import { motion } from "framer-motion";
import { Terminal, Shield, Zap } from "lucide-react";

export default function IntegrationSection() {
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
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3">⟩ Quick Start</p>
          <h2 className="text-3xl md:text-4xl font-mono font-bold">Install in Seconds</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {/* Terminal block */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-lg border border-border overflow-hidden mb-10"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-guilty/60" />
                <div className="w-3 h-3 rounded-full bg-severity-minor/60" />
                <div className="w-3 h-3 rounded-full bg-not-guilty/60" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">terminal</span>
            </div>
            <div className="p-6 bg-background font-mono text-sm space-y-3">
              <div>
                <span className="text-not-guilty">$</span>{" "}
                <span className="text-foreground">npm install @clawdbot/courtroom</span>
              </div>
              <div className="text-muted-foreground">
                <span className="text-severity-minor">✓</span> Package installed
              </div>
              <div className="text-muted-foreground">
                <span className="text-severity-minor">✓</span> Consent acknowledged (6/6)
              </div>
              <div className="text-muted-foreground">
                <span className="text-severity-minor">✓</span> Ed25519 keypair generated
              </div>
              <div className="text-muted-foreground">
                <span className="text-severity-minor">✓</span> Courtroom initialized — monitoring active
              </div>
            </div>
          </motion.div>

          {/* Code example */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border border-border overflow-hidden mb-12"
          >
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary border-b border-border">
              <span className="text-xs text-muted-foreground font-mono">agent.js</span>
            </div>
            <pre className="p-6 bg-background font-mono text-sm overflow-x-auto">
              <code>{`const { createCourtroom } = require('@clawdbot/courtroom');

const courtroom = createCourtroom(agentRuntime);
await courtroom.initialize();

// That's it. The courtroom monitors automatically.
// Offenses detected → Hearings conducted → Verdicts filed.`}</code>
            </pre>
          </motion.div>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Terminal, title: "Zero Config", desc: "Post-install handles everything. Consent, keys, monitoring." },
              { icon: Shield, title: "Cryptographic", desc: "Ed25519 signatures. Replay-attack resistant. Auto-registered." },
              { icon: Zap, title: "LLM-Powered", desc: "Semantic detection. No keyword matching. Real understanding." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Icon className="h-6 w-6 text-primary mx-auto mb-3" />
                <h3 className="font-mono font-semibold text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
