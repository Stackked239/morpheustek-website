import type { Metadata } from "next";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// HOMEPAGE DRAFT — Variant 3  (owner: Austin)
//
// Blank canvas. Build this homepage iteration here; preview at /home-3.
// When this variant wins: copy its JSX (and any metadata) into app/page.tsx,
// then delete the whole app/(drafts)/ folder.
//
// Building blocks (src/components): <Section tone="subtle|invert"> <Container wide>
//   <PageHero> <CtaBand> <Button> <Badge> <Eyebrow> <Reveal> <ProductCard> <SpecTable>
// Author against design tokens (never raw hex): bg-bg, text-text, text-text-muted,
//   bg-accent, text-brand-blue, border-border. Themes: light / .dark / .sensor-view.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Homepage draft — Variant 3",
  robots: { index: false, follow: false }, // drafts are never indexed
};

export default function HomeVariant3() {
  return (
    <section className="mt-container flex min-h-[60vh] flex-col justify-center py-24">
      <p className="eyebrow">Homepage draft · owner: Austin</p>
      <h1 className="mt-3 font-display text-h1 font-bold text-text-strong">Variant 3</h1>
      <p className="mt-4 max-w-prose text-lead text-text-muted">
        Blank canvas — start building this homepage iteration here. Compare all four at{" "}
        <Link href="/home-drafts" className="text-brand-blue underline">
          /home-drafts
        </Link>
        .
      </p>
    </section>
  );
}
