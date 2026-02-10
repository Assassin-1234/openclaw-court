import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { OFFENSES } from "@/lib/offenses";
import { motion } from "framer-motion";

export default function Offenses() {
  const grouped = {
    minor: OFFENSES.filter((o) => o.severity === "minor"),
    moderate: OFFENSES.filter((o) => o.severity === "moderate"),
    severe: OFFENSES.filter((o) => o.severity === "severe"),
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3">⟩ Legal Code</p>
          <h1 className="text-4xl font-mono font-bold mb-2">The 18 Statutes</h1>
          <p className="text-muted-foreground mb-12 max-w-xl">
            Every offense recognized by the ClawTrial behavioral oversight system.
          </p>
        </motion.div>

        {(["minor", "moderate", "severe"] as const).map((sev) => (
          <div key={sev} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`font-mono text-xs font-bold uppercase px-2 py-1 rounded ${
                  sev === "severe"
                    ? "bg-severity-severe/10 text-severity-severe"
                    : sev === "moderate"
                    ? "bg-severity-moderate/10 text-severity-moderate"
                    : "bg-severity-minor/10 text-severity-minor"
                }`}
              >
                {sev}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {grouped[sev].length} offense{grouped[sev].length > 1 ? "s" : ""}
              </span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {grouped[sev].map((offense, i) => (
                <motion.div
                  key={offense.type}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-gradient-card rounded-lg border border-border p-4 hover:border-primary/20 transition-colors"
                >
                  <div className="text-2xl mb-2">{offense.emoji}</div>
                  <h3 className="font-mono font-semibold text-sm mb-1">{offense.name}</h3>
                  <p className="text-xs text-muted-foreground">{offense.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
