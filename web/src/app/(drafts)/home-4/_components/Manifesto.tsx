import { site } from "@/lib/site";

/**
 * The three pillars as numbered proclamations — alternating ink blocks at
 * poster scale. Copy comes verbatim from site.pillars.
 */
const blocks = [
  "bg-mt-yellow text-mt-navy",
  "bg-bg text-mt-navy",
  "bg-mt-navy text-white",
] as const;

export function Manifesto() {
  return (
    <section aria-label="Why MorpheusTEK" className="border-y-2 border-mt-navy">
      {site.pillars.map((pillar, i) => (
        <div key={i} className={`${blocks[i]} ${i > 0 ? "border-t-2 border-mt-navy" : ""}`}>
          <div className="mt-container mt-container-wide grid gap-6 py-12 md:grid-cols-[auto_1fr] md:items-start md:py-16">
            <span className="font-display text-[clamp(3rem,8vw,6rem)] font-bold leading-none tabular-nums opacity-30">
              {`0${i + 1}`}
            </span>
            <p className="max-w-4xl font-display text-[clamp(1.75rem,4vw,3.25rem)] font-bold uppercase leading-[1.05] tracking-[-0.01em]">
              {pillar}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
