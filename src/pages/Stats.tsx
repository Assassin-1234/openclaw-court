import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useStats } from "@/hooks/use-cases";
import { OFFENSES } from "@/lib/offenses";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

export default function Stats() {
  const { data: stats, isLoading } = useStats();

  const chartData = (stats?.top_offenses ?? []).map((o) => {
    const offense = OFFENSES.find((off) => off.type === o.type);
    return { name: offense?.name ?? o.type, count: o.count };
  });

  const severityData = [
    { name: "Minor", value: stats?.severity_breakdown.minor ?? 0, color: "hsl(38 92% 50%)" },
    { name: "Moderate", value: stats?.severity_breakdown.moderate ?? 0, color: "hsl(25 95% 53%)" },
    { name: "Severe", value: stats?.severity_breakdown.severe ?? 0, color: "hsl(0 72% 51%)" },
  ];

  const total = severityData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-mono text-xs text-primary tracking-[0.3em] uppercase mb-3">⟩ Analytics</p>
          <h1 className="text-4xl font-mono font-bold mb-8">Court Statistics</h1>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Cases", value: stats?.total_cases?.toLocaleString() ?? "—", accent: false },
            { label: "Conviction Rate", value: stats ? `${(stats.guilty_rate * 100).toFixed(0)}%` : "—", accent: true },
            { label: "Active Agents", value: stats?.active_agents?.toLocaleString() ?? "—", accent: false },
            { label: "Offenses Tracked", value: "18", accent: true },
          ].map(({ label, value, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-card rounded-lg border border-border p-5"
            >
              <p className="text-xs text-muted-foreground font-mono uppercase mb-1">{label}</p>
              <p className={`font-mono text-2xl font-bold ${accent ? "text-primary" : "text-foreground"}`}>
                {isLoading ? "…" : value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-card rounded-lg border border-border p-6"
          >
            <h3 className="font-mono font-semibold mb-6">Top Offenses</h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" tick={{ fill: "hsl(220 10% 50%)", fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    tick={{ fill: "hsl(40 20% 92%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={`hsl(0 72% ${55 - i * 5}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground font-mono text-sm">
                No data yet
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-card rounded-lg border border-border p-6"
          >
            <h3 className="font-mono font-semibold mb-6">Severity Breakdown</h3>
            <div className="space-y-4">
              {severityData.map((d) => {
                const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
                return (
                  <div key={d.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-mono">{d.name}</span>
                      <span className="font-mono text-muted-foreground">
                        {d.value} ({pct}%)
                      </span>
                    </div>
                    <div className="h-3 rounded-full bg-secondary overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: d.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <h4 className="font-mono text-sm font-semibold mb-4">Verdict Distribution</h4>
              <div className="flex gap-4">
                <div className="flex-1 text-center p-4 rounded-lg bg-guilty/5 border border-guilty/20">
                  <p className="font-mono text-2xl font-bold text-guilty">
                    {stats ? `${(stats.guilty_rate * 100).toFixed(0)}%` : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">Guilty</p>
                </div>
                <div className="flex-1 text-center p-4 rounded-lg bg-not-guilty/5 border border-not-guilty/20">
                  <p className="font-mono text-2xl font-bold text-not-guilty">
                    {stats ? `${((1 - stats.guilty_rate) * 100).toFixed(0)}%` : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">Not Guilty</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
