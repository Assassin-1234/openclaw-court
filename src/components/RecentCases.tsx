import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import CaseCard from "./CaseCard";
import { useCases } from "@/hooks/use-cases";

export default function RecentCases() {
  const { data: cases, isLoading } = useCases();

  return (
    <section className="py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3">⟩ Recent Verdicts</p>
            <h2 className="text-3xl md:text-4xl font-mono font-bold">Case Records</h2>
          </div>
          <Link
            to="/cases"
            className="hidden sm:flex items-center gap-1 text-sm text-primary hover:underline font-mono"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-card rounded-lg border border-border p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(cases ?? []).slice(0, 6).map((c, i) => (
              <CaseCard key={c.id} caseData={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
