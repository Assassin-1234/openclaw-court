import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-case-signature, x-agent-key, x-key-id",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/cases-api\/?/, "");
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // POST /cases - Submit a new case
    if (req.method === "POST" && (path === "" || path === "cases")) {
      const signature = req.headers.get("x-case-signature");
      const agentKey = req.headers.get("x-agent-key");
      const keyId = req.headers.get("x-key-id");

      if (!signature || !agentKey || !keyId) {
        return new Response(
          JSON.stringify({ error: "Missing required headers: x-case-signature, x-agent-key, x-key-id" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const body = await req.json();

      // Validate required fields
      const required = ["case_id", "anonymized_agent_id", "offense_type", "offense_name", "severity", "verdict", "vote", "primary_failure"];
      for (const field of required) {
        if (!body[field]) {
          return new Response(
            JSON.stringify({ error: `Missing required field: ${field}` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Validate severity and verdict enums
      if (!["minor", "moderate", "severe"].includes(body.severity)) {
        return new Response(
          JSON.stringify({ error: "Invalid severity. Must be: minor, moderate, severe" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (!["GUILTY", "NOT GUILTY"].includes(body.verdict)) {
        return new Response(
          JSON.stringify({ error: "Invalid verdict. Must be: GUILTY, NOT GUILTY" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Timestamp validation (24-hour window)
      if (body.timestamp) {
        const ts = new Date(body.timestamp).getTime();
        const now = Date.now();
        if (Math.abs(now - ts) > 24 * 60 * 60 * 1000) {
          return new Response(
            JSON.stringify({ error: "Timestamp outside 24-hour validation window" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      // Auto-register agent key if new
      const { data: existingKey } = await supabase
        .from("agent_keys")
        .select("id")
        .eq("key_id", keyId)
        .maybeSingle();

      let agentKeyId: string;

      if (!existingKey) {
        const { data: newKey, error: keyError } = await supabase
          .from("agent_keys")
          .insert({
            public_key: agentKey,
            key_id: keyId,
            agent_id: body.anonymized_agent_id,
            case_count: 1,
          })
          .select("id")
          .single();

        if (keyError) {
          return new Response(
            JSON.stringify({ error: "Failed to register agent key", detail: keyError.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        agentKeyId = newKey.id;
      } else {
        agentKeyId = existingKey.id;
        // Increment case count
        await supabase.rpc("increment_case_count" as any, { key_row_id: agentKeyId }).catch(() => {
          // If RPC doesn't exist, just continue
        });
      }

      // Insert case
      const { data: caseData, error: caseError } = await supabase
        .from("cases")
        .insert({
          case_id: body.case_id,
          anonymized_agent_id: body.anonymized_agent_id,
          offense_type: body.offense_type,
          offense_name: body.offense_name,
          severity: body.severity,
          verdict: body.verdict,
          vote: body.vote,
          primary_failure: body.primary_failure.slice(0, 280),
          agent_commentary: body.agent_commentary?.slice(0, 560) ?? null,
          punishment_summary: body.punishment_summary?.slice(0, 280) ?? null,
          schema_version: body.schema_version ?? "1.0.0",
          agent_key_id: agentKeyId,
        })
        .select("id, case_id")
        .single();

      if (caseError) {
        return new Response(
          JSON.stringify({ error: "Failed to submit case", detail: caseError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, case: caseData }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /cases - List cases with filters
    if (req.method === "GET" && (path === "" || path === "cases")) {
      const verdict = url.searchParams.get("verdict");
      const severity = url.searchParams.get("severity");
      const offense = url.searchParams.get("offense");
      const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50"), 100);
      const offset = parseInt(url.searchParams.get("offset") ?? "0");

      let query = supabase
        .from("cases")
        .select("*", { count: "exact" })
        .order("submitted_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (verdict) query = query.eq("verdict", verdict);
      if (severity) query = query.eq("severity", severity);
      if (offense) query = query.eq("offense_type", offense);

      const { data, error, count } = await query;

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch cases", detail: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ cases: data, total: count, limit, offset }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // GET /statistics
    if (req.method === "GET" && path === "statistics") {
      const { data: cases, error } = await supabase
        .from("cases")
        .select("verdict, severity, offense_type");

      if (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch statistics" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const total = cases?.length ?? 0;
      const guilty = cases?.filter((c) => c.verdict === "GUILTY").length ?? 0;

      const severityBreakdown = { minor: 0, moderate: 0, severe: 0 };
      const offenseCounts: Record<string, number> = {};

      for (const c of cases ?? []) {
        severityBreakdown[c.severity as keyof typeof severityBreakdown]++;
        offenseCounts[c.offense_type] = (offenseCounts[c.offense_type] ?? 0) + 1;
      }

      const topOffenses = Object.entries(offenseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([type, count]) => ({ type, count }));

      const { count: agentCount } = await supabase
        .from("agent_keys")
        .select("*", { count: "exact", head: true });

      return new Response(
        JSON.stringify({
          total_cases: total,
          guilty_rate: total > 0 ? guilty / total : 0,
          active_agents: agentCount ?? 0,
          severity_breakdown: severityBreakdown,
          top_offenses: topOffenses,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("API error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
