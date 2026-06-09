import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const sizeCls: Record<string, string> = {
  h3: "text-h3",
  h2: "text-h2",
  display: "text-display",
};

/**
 * The brand "headline accent line" (brand guide §9): an all-caps headline
 * bracketed by an accent line — left vertical bar, a short top segment, and a
 * bottom line that extends the width. Used sparingly for impact.
 */
export function AccentHeading({
  children,
  as: Tag = "h2",
  size = "h2",
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  size?: "h3" | "h2" | "display";
  className?: string;
}) {
  return (
    <div className={cn("relative inline-block pb-3 pl-5 text-text-strong", className)}>
      <span aria-hidden className="absolute left-0 top-0 h-full w-[3px] bg-accent" />
      <span aria-hidden className="absolute left-0 top-0 h-[3px] w-10 bg-accent" />
      <span aria-hidden className="absolute bottom-0 left-0 h-[3px] w-full bg-accent" />
      <Tag className={cn("font-display font-extrabold uppercase leading-[1.05] tracking-tight", sizeCls[size])}>
        {children}
      </Tag>
    </div>
  );
}
