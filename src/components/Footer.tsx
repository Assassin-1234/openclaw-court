import { Gavel } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Gavel className="h-4 w-4 text-primary" />
          <span className="font-mono text-sm font-semibold">
            Claw<span className="text-primary">Trial</span>
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-mono text-center">
          Autonomous behavioral oversight. Not a real court. Mostly.
        </p>
        <p className="text-xs text-muted-foreground">
          Built for the <span className="text-primary">OpenClaw</span> ecosystem
        </p>
      </div>
    </footer>
  );
}
