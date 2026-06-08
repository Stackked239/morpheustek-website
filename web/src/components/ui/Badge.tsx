import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "trial" | "safety" | "in-stock" | "pre-order" | "featured" | "new" | "neutral";

const toneCls: Record<Tone, string> = {
  trial: "bg-accent text-accent-text",
  safety: "bg-brand-blue text-white",
  "in-stock": "bg-success-soft text-success",
  "pre-order": "bg-warning-soft text-warning",
  featured: "border border-accent text-text-strong",
  new: "border border-eye text-eye",
  neutral: "bg-bg-muted text-text-muted",
};

export function Badge({
  tone = "neutral",
  children,
  icon: Icon,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        toneCls[tone],
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5" /> : null}
      {children}
    </span>
  );
}
