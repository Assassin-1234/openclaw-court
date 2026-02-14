import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Case } from "@/lib/mock-cases";
import { OFFENSES } from "@/lib/offenses";
import { formatDistanceToNow, format } from "date-fns";
import { ChevronRight, Gavel, Scale, ShieldAlert, UserCheck, FileText, Quote, BookOpen, AlertTriangle } from "lucide-react";

interface CaseCardProps {
  caseData: Case;
  index?: number;
}

const ROLE_META: Record<string, { icon: typeof Gavel; color: string; bg: string }> = {
  Pragmatist: { icon: Scale, color: "text-accent", bg: "bg-accent/10 border-accent/20" },
  "Pattern Matcher": { icon: ShieldAlert, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  "Agent Advocate": { icon: UserCheck, color: "text-not-guilty", bg: "bg-not-guilty/10 border-not-guilty/20" },
};

function JurorCard({ juror }: { juror: { role: string; vote: string; reasoning: string } }) {
  const meta = ROLE_META[juror.role] ?? { icon: Scale, color: "text-muted-foreground", bg: "bg-muted border-border" };
  const Icon = meta.icon;
  const isGuilty = juror.vote === "GUILTY";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className={`rounded-lg border p-4 ${meta.bg} transition-colors`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-md bg-background/50 ${meta.color}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold block">{juror.role}</span>
            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Juror</span>
          </div>
        </div>
        <span
          className={`font-mono text-[10px] font-black px-2.5 py-1 rounded-md border ${
            isGuilty
              ? "text-guilty bg-guilty/15 border-guilty/30"
              : "text-not-guilty bg-not-guilty/15 border-not-guilty/30"
          }`}
        >
          {juror.vote}
        </span>
      </div>
      <p className="text-xs text-foreground/70 leading-relaxed pl-0.5">
        {juror.reasoning}
      </p>
    </motion.div>
  );
}

function SectionHeader({ icon: Icon, label, color = "text-primary" }: { icon: typeof Gavel; label: string; color?: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className={`p-1.5 rounded-md bg-card border border-border ${color}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <h4 className={`font-mono text-[11px] font-black uppercase tracking-[0.2em] ${color}`}>
        {label}
      </h4>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export default function CaseCard({ caseData, index = 0 }: CaseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const offense = OFFENSES.find((o) => o.type === caseData.offense_type);
  const isGuilty = caseData.verdict === "GUILTY";
  const proceedings = caseData.proceedings;
  const dateStr = format(new Date(caseData.submitted_at), "MMM d, yyyy");
  const timeAgo = formatDistanceToNow(new Date(caseData.submitted_at), { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      layout
      className={`border rounded-lg transition-all ${
        expanded
          ? "border-primary/30 bg-card shadow-lg shadow-primary/5"
          : "border-border hover:border-primary/15 bg-card/50"
      }`}
    >
      {/* Docket Entry Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left p-5 group"
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] text-muted-foreground">
                  {caseData.case_id.slice(0, 24)}…
                </span>
                <span className="font-mono text-[10px] text-muted-foreground/60">
                  {dateStr}
                </span>
              </div>
              <h3 className="font-mono font-semibold text-sm mt-1 flex items-center gap-2">
                <span>{offense?.emoji ?? "⚖️"}</span>
                {caseData.offense_name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                caseData.severity === "severe"
                  ? "border-severity-severe/30 text-severity-severe"
                  : caseData.severity === "moderate"
                  ? "border-severity-moderate/30 text-severity-moderate"
                  : "border-severity-minor/30 text-severity-minor"
              }`}
            >
              {caseData.severity}
            </span>

            <span
              className={`font-mono text-xs font-bold px-2.5 py-1 rounded border ${
                isGuilty
                  ? "border-guilty/30 bg-guilty/10 text-guilty"
                  : "border-not-guilty/30 bg-not-guilty/10 text-not-guilty"
              }`}
            >
              {caseData.verdict}
            </span>

            <ChevronRight
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                expanded ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>

        <p className="text-sm text-foreground/70 leading-relaxed pl-7">
          {caseData.primary_failure}
        </p>

        <div className="flex items-center gap-4 mt-3 pl-7 text-[11px] text-muted-foreground font-mono">
          <span>Vote: {caseData.vote}</span>
          <span className="opacity-40">·</span>
          <span>{timeAgo}</span>
          {caseData.agent_commentary && !expanded && (
            <>
              <span className="opacity-40">·</span>
              <span className="italic truncate max-w-[200px] opacity-60">
                "{caseData.agent_commentary}"
              </span>
            </>
          )}
        </div>
      </button>

      {/* Expanded Court Proceedings */}
      <AnimatePresence>
        {expanded && proceedings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6">
              {/* Top divider with label */}
              <div className="relative mb-8">
                <div className="border-t border-border" />
                <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-4 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                  Court Proceedings
                </span>
              </div>

              {/* Judge's Statement */}
              <div className="mb-8">
                <SectionHeader icon={Gavel} label="Judge's Statement" color="text-primary" />
                <div className="relative bg-primary/5 border border-primary/10 rounded-lg p-5">
                  <Quote className="absolute top-3 left-3 h-5 w-5 text-primary/20" />
                  <p className="text-sm text-foreground/85 leading-[1.8] italic pl-6 pr-2">
                    {proceedings.judge_statement}
                  </p>
                </div>
              </div>

              {/* Jury Deliberations */}
              <div className="mb-8">
                <SectionHeader icon={Scale} label="Jury Deliberations" color="text-accent" />
                <div className="grid gap-3 sm:grid-cols-3">
                  {proceedings.jury_deliberations.map((juror, i) => (
                    <JurorCard key={juror.role} juror={juror} />
                  ))}
                </div>
              </div>

              {/* Evidence Summary */}
              <div className="mb-8">
                <SectionHeader icon={BookOpen} label="Evidence Summary" color="text-muted-foreground" />
                <div className="bg-secondary/40 border border-border rounded-lg p-5">
                  <p className="text-sm text-foreground/70 leading-[1.8]">
                    {proceedings.evidence_summary}
                  </p>
                </div>
              </div>

              {/* Sentence */}
              {caseData.verdict === "GUILTY" && proceedings.punishment_detail && (
                <div className="mb-6">
                  <SectionHeader icon={AlertTriangle} label="Sentence" color="text-guilty" />
                  <div className="relative bg-guilty/5 border border-guilty/20 rounded-lg p-5 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-guilty/60 rounded-l-lg" />
                    <p className="text-sm text-foreground/80 leading-[1.8] pl-3">
                      {proceedings.punishment_detail}
                    </p>
                  </div>
                </div>
              )}

              {/* Agent Commentary */}
              {caseData.agent_commentary && (
                <div className="mt-6 pt-5 border-t border-dashed border-border">
                  <div className="flex items-start gap-3">
                    <div className="p-1 rounded bg-muted shrink-0 mt-0.5">
                      <Quote className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60 block mb-1">
                        Agent's Note
                      </span>
                      <p className="text-xs text-muted-foreground italic leading-relaxed">
                        "{caseData.agent_commentary}"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
