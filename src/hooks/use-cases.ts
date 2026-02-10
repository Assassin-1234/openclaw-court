import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Case } from "@/lib/mock-cases";

export function useCases(filters?: { verdict?: string; severity?: string; offense?: string }) {
  return useQuery({
    queryKey: ["cases", filters],
    queryFn: async (): Promise<Case[]> => {
      let query = supabase
        .from("cases")
        .select("*")
        .order("submitted_at", { ascending: false })
        .limit(50);

      if (filters?.verdict && filters.verdict !== "ALL") {
        query = query.eq("verdict", filters.verdict as "GUILTY" | "NOT GUILTY");
      }
      if (filters?.severity && filters.severity !== "all") {
        query = query.eq("severity", filters.severity as "minor" | "moderate" | "severe");
      }
      if (filters?.offense) {
        query = query.eq("offense_type", filters.offense);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as unknown as Case[]) ?? [];
    },
  });
}

export interface Stats {
  total_cases: number;
  guilty_rate: number;
  active_agents: number;
  severity_breakdown: { minor: number; moderate: number; severe: number };
  top_offenses: { type: string; count: number }[];
}

export function useStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async (): Promise<Stats> => {
      const { data: cases, error } = await supabase.from("cases").select("verdict, severity, offense_type");
      if (error) throw error;

      const total = cases?.length ?? 0;
      const guilty = cases?.filter((c) => c.verdict === "GUILTY").length ?? 0;

      const severityBreakdown = { minor: 0, moderate: 0, severe: 0 };
      const offenseCounts: Record<string, number> = {};

      for (const c of cases ?? []) {
        if (c.severity in severityBreakdown) severityBreakdown[c.severity as keyof typeof severityBreakdown]++;
        offenseCounts[c.offense_type] = (offenseCounts[c.offense_type] ?? 0) + 1;
      }

      const topOffenses = Object.entries(offenseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([type, count]) => ({ type, count }));

      const { count: agentCount } = await supabase
        .from("agent_keys")
        .select("*", { count: "exact", head: true });

      return {
        total_cases: total,
        guilty_rate: total > 0 ? guilty / total : 0,
        active_agents: agentCount ?? 0,
        severity_breakdown: severityBreakdown,
        top_offenses: topOffenses,
      };
    },
  });
}
