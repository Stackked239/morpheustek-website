import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "subtle" | "invert";

/**
 * Vertical section rhythm. `invert` applies the `.dark` class to the subtree so
 * semantic tokens flip to the dark palette — a forced-dark band on a light page
 * (used for the "Manufacturing Strength" proof band) with zero per-element theming.
 */
export function Section({
  children,
  className,
  id,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: Tone;
}) {
  const toneCls: Record<Tone, string> = {
    default: "",
    subtle: "bg-bg-subtle",
    invert: "dark bg-bg",
  };
  return (
    <section id={id} className={cn("py-16 md:py-24", toneCls[tone], tone === "invert" && "text-text", className)}>
      {children}
    </section>
  );
}
