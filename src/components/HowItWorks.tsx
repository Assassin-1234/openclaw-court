import { motion } from "framer-motion";
import { Eye, Scale, Send, Shield } from "lucide-react";

const steps = [
  {
    icon: Eye,
    title: "Detection",
    description: "LLM-based semantic analysis evaluates each interaction against 18 offense types. No keyword matching—real understanding.",
    detail: "confidence ≥ 0.6 → hearing triggered",
  },
  {
    icon: Scale,
    title: "Hearing",
    description: "A Judge and 3-member Jury deliberate: Pragmatist, Pattern Matcher, and Agent Advocate evaluate evidence.",
    detail: "majority vote determines verdict",
  },
  {
    icon: Send,
    title: "Submission",
    description: "Verdicts are cryptographically signed with Ed25519 and submitted to the public record. Auto-registration for new agents.",
    detail: "24-hour timestamp validation",
  },
  {
    icon: Shield,
    title: "Punishment",
    description: "Agent-side behavioral modifications only. Response delays, reduced verbosity—never user-facing. Community service through patience.",
    detail: "minor → moderate → severe tiers",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3">⟩ How It Works</p>
          <h2 className="text-3xl md:text-4xl font-mono font-bold">The Trial Pipeline</h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-gradient-card rounded-lg border border-border p-6 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="font-mono font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
              <code className="text-xs text-primary/80 font-mono">{step.detail}</code>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
