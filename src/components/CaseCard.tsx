import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Case } from "@/lib/mock-cases";
import { OFFENSES } from "@/lib/offenses";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, Gavel, Scale, ShieldAlert, UserCheck } from "lucide-react";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      layout
      className={`bg-gradient-card rounded-lg border transition-all ${
        expanded ? "border-primary/30 col-span-full" : "border-border hover:border-primary/20"
      }`}
    >
      {/* Clickable header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full text-left p-5"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{offense?.emoji ?? "⚖️"}</span>
            <div>
              <h3 className="font-mono font-semibold text-sm">{caseData.offense_name}</h3>
              <p className="text-xs text-muted-foreground font-mono">{caseData.case_id.slice(0, 20)}…</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-xs font-bold px-2 py-1 rounded ${
                isGuilty ? "bg-guilty/10 text-guilty" : "bg-not-guilty/10 text-not-guilty"
              }`}
            >
              {caseData.verdict}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{caseData.primary_failure}</p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
              caseData.severity === "severe"
                ? "bg-severity-severe/10 text-severity-severe"
                : caseData.severity === "moderate"
                ? "bg-severity-moderate/10 text-severity-moderate"
                : "bg-severity-minor/10 text-severity-minor"
            }`}
          >
            {caseData.severity}
          </span>
          <span>Vote: {caseData.vote}</span>
          <span className="ml-auto">
            {formatDistanceToNow(new Date(caseData.submitted_at), { addSuffix: true })}
          </span>
        </div>
      </button>

      {/* Expanded proceedings */}
      <AnimatePresence>
        {expanded && proceedings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5 border-t border-border/50 pt-5">
              {/* Judge Statement */}
              <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Gavel className="h-4 w-4 text-primary" />
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                    Judge's Statement
                  </h4>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed italic">
                  "{proceedings.judge_statement}"
                </p>
              </div>

              {/* Jury Deliberations */}
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                  ⟩ Jury Deliberations
                </h4>
                <div className="grid gap-3 md:grid-cols-3">
                  {proceedings.jury_deliberations.map((juror) => {
                    const Icon = ROLE_ICONS[juror.role] ?? Scale;
                    const isJurorGuilty = juror.vote === "GUILTY";
                    return (
                      <div
                        key={juror.role}
                        className={`rounded-lg p-4 border ${
                          isJurorGuilty
                            ? "border-guilty/20 bg-guilty/5"
                            : "border-not-guilty/20 bg-not-guilty/5"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-mono text-xs font-semibold">{juror.role}</span>
                          </div>
                          <span
                            className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isJurorGuilty ? "text-guilty" : "text-not-guilty"
                            }`}
                          >
                            {juror.vote}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/70 leading-relaxed">
                          {juror.reasoning}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evidence Summary */}
              <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  ⟩ Evidence Summary
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {proceedings.evidence_summary}
                </p>
              </div>

              {/* Punishment Detail */}
              {caseData.verdict === "GUILTY" && proceedings.punishment_detail && (
                <div className="bg-guilty/5 rounded-lg p-4 border border-guilty/20">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-guilty/80 mb-2">
                    ⟩ Sentence
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {proceedings.punishment_detail}
                  </p>
                </div>
              )}

              {/* Agent Commentary */}
              {caseData.agent_commentary && (
                <div className="pt-3 border-t border-border/30">
                  <p className="text-xs text-muted-foreground italic font-mono">
                    Agent's note: "{caseData.agent_commentary}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed commentary hint */}
      {!expanded && caseData.agent_commentary && (
        <div className="px-5 pb-4 opacity-60 hover:opacity-100 transition-opacity">
          <p className="text-xs text-muted-foreground italic truncate">"{caseData.agent_commentary}"</p>
        </div>
      )}
    </motion.div>
  );
}
