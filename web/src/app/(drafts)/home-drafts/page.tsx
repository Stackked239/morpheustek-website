import type { Metadata } from "next";
import Link from "next/link";

// Internal compare hub for the four homepage drafts. Lives in the disposable
// app/(drafts)/ group — delete the whole folder once a winner is promoted to /.

export const metadata: Metadata = {
  title: "Homepage drafts",
  robots: { index: false, follow: false },
};

const drafts = [
  { href: "/home-1", label: "Variant 1 · The Acceptance Test", owner: "John" },
  { href: "/home-2", label: "Variant 2", owner: "John" },
  { href: "/home-3", label: "Variant 3", owner: "Austin" },
  { href: "/home-4", label: "Variant 4", owner: "Austin" },
];

export default function HomeDraftsIndex() {
  return (
    <section className="mt-container py-24">
      <p className="eyebrow">Internal · not indexed</p>
      <h1 className="mt-3 font-display text-h1 font-bold text-text-strong">Homepage drafts</h1>
      <p className="mt-4 max-w-prose text-lead text-text-muted">
        Four homepage iterations. Pick the winner, copy its JSX into{" "}
        <code className="font-mono text-base text-text">app/page.tsx</code>, then delete{" "}
        <code className="font-mono text-base text-text">app/(drafts)/</code>.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {drafts.map((d) => (
          <li key={d.href}>
            <Link
              href={d.href}
              className="surface-card flex items-center justify-between p-6 transition hover:border-border-strong"
            >
              <span className="font-display text-h4 font-bold text-text-strong">{d.label}</span>
              <span className="font-mono text-xs uppercase tracking-wide text-text-muted">{d.owner}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
