import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("eyebrow flex items-center gap-2.5", className)}>
      <span className="inline-block h-px w-6 bg-accent" aria-hidden />
      {children}
    </p>
  );
}
