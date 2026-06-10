import type { ReactNode } from "react";

/* Shared section header DNA — every clause opens identically:
   full-width top rule → mono clause index + eyebrow → uppercase display H2 → lead. */
export function ClauseHeader({
  index,
  eyebrow,
  title,
  lead,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <header>
      {/* the section rule draws in on scroll — SSR/no-JS renders it complete */}
      <div aria-hidden data-draw className="h-px w-full bg-border" />
      <div className="mt-6 flex items-baseline gap-4">
        <span className="tnum font-mono text-anno-sm font-medium uppercase text-brand-blue">
          §{index}
        </span>
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="mt-6 max-w-4xl font-display-industrial text-h2 font-bold uppercase text-text-strong md:text-h1">
        {title}
      </h2>
      {lead ? <p className="mt-5 max-w-2xl text-lead text-text-muted">{lead}</p> : null}
    </header>
  );
}
