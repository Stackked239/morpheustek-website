import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { Configurator } from "./_components/Configurator";

/* =============================================================================
   HOME-9 — "Spec Your Robot" (the homepage is a tool)

   No brochure. The visitor answers the three questions a MorpheusTEK engineer
   would ask on a call — environment, people, perception job — and a real
   stack assembles itself on the build sheet, live, from catalog.ts. The page
   converts by being useful: the CTA is "quote this exact stack."

   Discipline:
   - every recommendation rule maps to a true catalog fact (sunlight immunity,
     ATEX cert, safety class, dToF/dual-mode depth, Jetson edge)
   - no price totals (June-8 client directive: pricing off the site)
   - the default answers render a complete stack server-side, so no-JS and
     crawlers get a full page, not an empty tool
   - one yellow CTA per viewport (the quote button on the sheet)
   ========================================================================== */

export const metadata: Metadata = {
  title: "Homepage draft — Variant 9 · Spec Your Robot",
  robots: { index: false, follow: false }, // drafts are never indexed
};

export default function HomeVariant9() {
  return (
    <>
      <section className="dark relative isolate overflow-hidden bg-bg py-14 text-text md:py-18">
        {/* the intake desk: a faint grid floor under a navy band */}
        <div aria-hidden className="grid-floor absolute inset-x-[-20%] bottom-0 -z-10 h-[36vh]" />
        <Container>
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-3 font-mono text-anno-sm uppercase tracking-[0.18em] text-text-subtle">
            <span>Intake · doc MT-Q3 · rev live</span>
            <span>{site.distributor}</span>
          </div>
          <h1 className="mt-8 max-w-3xl font-display text-display-xl font-bold text-text-strong">
            Spec your robot.
          </h1>
          <p className="mt-5 max-w-xl text-lead text-text-muted">
            Three questions — the same ones our engineers ask. Answer them and watch your
            perception stack assemble from parts we stock and support.
          </p>
          <div className="mt-8 flex items-center gap-3 font-mono text-anno-sm uppercase tracking-[0.14em] text-text-subtle">
            {["Environment", "People", "Job"].map((s, i) => (
              <span key={s} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="h-px w-8 bg-border" />}
                <span className="flex items-center gap-1.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full border border-brand-blue text-[10px] text-brand-blue">
                    {i + 1}
                  </span>
                  {s}
                </span>
              </span>
            ))}
            <span aria-hidden className="h-px w-8 bg-border" />
            <span className="text-accent">→ build sheet</span>
          </div>
        </Container>
      </section>

      <Configurator />
    </>
  );
}
