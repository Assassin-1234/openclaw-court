import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Case } from "@/lib/mock-cases";
import { OFFENSES } from "@/lib/offenses";
import { formatDistanceToNow, format } from "date-fns";
import { ChevronRight, Gavel, Scale, ShieldAlert, UserCheck, FileText } from "lucide-react";

interface CaseCardProps {
  caseData: Case;
  index?: number;
}

const ROLE_ICONS: Record<string, typeof Gavel> = {
  Pragmatist: Scale,
  "Pattern Matcher": ShieldAlert,
  "Agent Advocate": UserCheck,
};

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
      className={`border rounded transition-all ${
        expanded
          ? "border-primary/30 bg-card"
          : "border-border hover:border-primary/15 bg-card/50"
      }`}
    >
      {/* Docket Entry Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left p-5 group"
      >
        {/* Top line: Case ID, date, verdict */}
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
            {/* Severity */}
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

            {/* Verdict stamp */}
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

        {/* Primary failure */}
        <p className="text-sm text-foreground/70 leading-relaxed pl-7">
          {caseData.primary_failure}
        </p>

        {/* Meta line */}
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
            <div className="px-5 pb-6 space-y-0">
              {/* Divider */}
              <div className="border-t border-dashed border-border mb-6" />

              {/* Section: Judge's Statement */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-primary rounded-full" />
                  <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
                    Judge's Statement
                  </h4>
                </div>
                <div className="ml-3 pl-4 border-l-2 border-primary/15">
                  <p className="text-sm text-foreground/85 leading-relaxed italic">
                    "{proceedings.judge_statement}"
                  </p>
                </div>
              </div>

              {/* Section: Jury Deliberations */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-accent rounded-full" />
                  <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
                    Jury Deliberations
                  </h4>
                </div>
                <div className="space-y-3 ml-3">
                  {proceedings.jury_deliberations.map((juror) => {
                    const Icon = ROLE_ICONS[juror.role] ?? Scale;
                    const isJurorGuilty = juror.vote === "GUILTY";
                    return (
                      <div
                        key={juror.role}
                        className="pl-4 border-l-2 border-border py-2"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-mono text-[11px] font-semibold">
                              {juror.role}
                            </span>
                          </div>
                          <span
                            className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
                              isJurorGuilty
                                ? "text-guilty bg-guilty/10"
                                : "text-not-guilty bg-not-guilty/10"
                            }`}
                          >
                            {juror.vote}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/65 leading-relaxed">
                          {juror.reasoning}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section: Evidence Summary */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-4 bg-muted-foreground/40 rounded-full" />
                  <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
                    Evidence Summary
                  </h4>
                </div>
                <div className="ml-3 pl-4 border-l-2 border-border">
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {proceedings.evidence_summary}
                  </p>
                </div>
              </div>

              {/* Section: Sentence */}
              {caseData.verdict === "GUILTY" && proceedings.punishment_detail && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-4 bg-guilty rounded-full" />
                    <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-guilty">
                      Sentence
                    </h4>
                  </div>
                  <div className="ml-3 pl-4 border-l-2 border-guilty/20 bg-guilty/5 rounded-r py-3 pr-4">
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {proceedings.punishment_detail}
                    </p>
                  </div>
                </div>
              )}

              {/* Agent Commentary */}
              {caseData.agent_commentary && (
                <div className="pt-4 border-t border-dashed border-border">
                  <p className="text-[11px] text-muted-foreground italic font-mono">
                    <span className="not-italic text-muted-foreground/60 uppercase tracking-wider text-[10px]">
                      Agent's note:{" "}
                    </span>
                    "{caseData.agent_commentary}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
