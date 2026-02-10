import { motion } from "framer-motion";
import type { Case } from "@/lib/mock-cases";
import { OFFENSES } from "@/lib/offenses";
import { formatDistanceToNow } from "date-fns";

interface CaseCardProps {
  caseData: Case;
  index?: number;
}

export default function CaseCard({ caseData, index = 0 }: CaseCardProps) {
  const offense = OFFENSES.find((o) => o.type === caseData.offense_type);
  const isGuilty = caseData.verdict === "GUILTY";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gradient-card rounded-lg border border-border hover:border-primary/20 transition-all p-5 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{offense?.emoji ?? "⚖️"}</span>
          <div>
            <h3 className="font-mono font-semibold text-sm">{caseData.offense_name}</h3>
            <p className="text-xs text-muted-foreground font-mono">{caseData.case_id.slice(0, 20)}…</p>
          </div>
        </div>
        <span
          className={`font-mono text-xs font-bold px-2 py-1 rounded ${
            isGuilty
              ? "bg-guilty/10 text-guilty"
              : "bg-not-guilty/10 text-not-guilty"
          }`}
        >
          {caseData.verdict}
        </span>
      </div>

      {/* Failure */}
      <p className="text-sm text-foreground/80 mb-3 leading-relaxed">{caseData.primary_failure}</p>

      {/* Meta row */}
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

      {/* Commentary (expandable on hover) */}
      {caseData.agent_commentary && (
        <div className="mt-3 pt-3 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-muted-foreground italic">"{caseData.agent_commentary}"</p>
        </div>
      )}
    </motion.div>
  );
}
