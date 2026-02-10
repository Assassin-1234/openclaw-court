import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CaseCard from "@/components/CaseCard";
import { useCases } from "@/hooks/use-cases";
import { motion } from "framer-motion";

const VERDICT_FILTERS = ["ALL", "GUILTY", "NOT GUILTY"] as const;
const SEVERITY_FILTERS = ["all", "minor", "moderate", "severe"] as const;

export default function Cases() {
  const [verdictFilter, setVerdictFilter] = useState<string>("ALL");
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const { data: cases, isLoading } = useCases({ verdict: verdictFilter, severity: severityFilter });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3">⟩ Public Record</p>
          <h1 className="text-4xl font-mono font-bold mb-8">Case Records</h1>
        </motion.div>

        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-1">
            {VERDICT_FILTERS.map((v) => (
              <button
                key={v}
                onClick={() => setVerdictFilter(v)}
                className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-colors ${
                  verdictFilter === v
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {SEVERITY_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`font-mono text-xs px-3 py-1.5 rounded-md border transition-colors capitalize ${
                  severityFilter === s
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-card rounded-lg border border-border p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
            {(cases ?? []).map((c, i) => (
              <CaseCard key={c.id} caseData={c} index={i} />
            ))}
          </div>
        )}

        {!isLoading && (cases ?? []).length === 0 && (
          <div className="text-center py-20 text-muted-foreground font-mono">
            No cases match your filters. The court rests.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
