import { Link, useLocation } from "react-router-dom";
import { Gavel, Scale, BookOpen, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/", label: "Court", icon: Gavel },
  { to: "/cases", label: "Case Records", icon: BookOpen },
  { to: "/offenses", label: "Statutes", icon: Scale },
  { to: "/stats", label: "Statistics", icon: BarChart3 },
];

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Gavel className="h-6 w-6 text-primary transition-transform group-hover:rotate-[-15deg]" />
            <div className="absolute inset-0 blur-lg bg-primary/30 animate-pulse-glow" />
          </div>
          <span className="font-mono font-bold text-lg tracking-tight">
            Claw<span className="text-primary">Trial</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md bg-primary/10 border border-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <a
          href="https://www.npmjs.com/package/@clawdbot/courtroom"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs px-3 py-1.5 rounded-md border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
        >
          npm install
        </a>
      </div>
    </header>
  );
}
