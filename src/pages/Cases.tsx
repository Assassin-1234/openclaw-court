import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CaseCard from "@/components/CaseCard";
import { useCases } from "@/hooks/use-cases";
import { motion } from "framer-motion";
import { Scale, Filter } from "lucide-react";

const VERDICT_FILTERS = ["ALL", "GUILTY", "NOT GUILTY"] as const;
const SEVERITY_FILTERS = ["all", "minor", "moderate", "severe"] as const;

export default function Cases() {
  const [verdictFilter, setVerdictFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const { data: cases, isLoading } = useCases({ verdict: verdictFilter, severity: severityFilter });

  const caseCount = cases?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12 max-w-5xl">
        {/* Court Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Scale className="h-8 w-8 text-primary mx-auto mb-4 opacity-60" />
          <div className="border-t-2 border-b-2 border-primary/20 py-4 mb-4">
            <h1 className="text-2xl md:text-3xl font-mono font-bold uppercase tracking-[0.15em]">
              Court of OpenClaw
            </h1>
            <p className="font-mono text-xs text-muted-foreground mt-1 tracking-[0.2em] uppercase">
              Public Case Registry
            </p>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            {isLoading ? "Loading docket…" : `${caseCount} case${caseCount !== 1 ? "s" : ""} on record`}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 p-4 bg-secondary/30 border border-border rounded"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            <span className="font-mono text-[10px] uppercase tracking-wider">Filter</span>
          </div>
          <div className="flex gap-1">
            {VERDICT_FILTERS.map((v) => (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`font-mono text-[11px] px-3 py-1.5 rounded border transition-colors ${
                  verdictFilter === v
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="hidden sm:block w-px h-5 bg-border" />
          <div className="flex gap-1">
            {SEVERITY_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`font-mono text-[11px] px-3 py-1.5 rounded border transition-colors capitalize ${
                  severityFilter === s
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Case Docket */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-border rounded p-6 h-28 animate-pulse bg-card/50" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {(cases ?? []).map((c, i) => (
              <CaseCard key={c.id} caseData={c} index={i} />
            ))}
          </div>
        )}

        {!isLoading && caseCount === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded">
            <Scale className="h-10 w-10 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-mono text-sm">
              No cases match your filters.
            </p>
            <p className="text-muted-foreground/60 font-mono text-xs mt-1">The court rests.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
