import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { EyeMark } from "@/components/brand/EyeMark";

/**
 * On-brand stub for routes whose full template lands in a later build phase.
 * Keeps navigation from dead-ending and still looks designed.
 */
export function PlaceholderPage({
  eyebrow = "In progress",
  title,
  body,
  bullets,
  cta = { label: "Book a meeting", href: "/book-a-meeting" },
}: {
  eyebrow?: string;
  title: string;
  body: ReactNode;
  bullets?: string[];
  cta?: { label: string; href: string };
}) {
  return (
    <section className="dark relative isolate overflow-hidden bg-bg">
      <div className="circuit-motif pointer-events-none absolute inset-x-0 top-0 h-full opacity-60" aria-hidden />
      <Container className="relative grid min-h-[70vh] items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-text-strong">
            {title}
          </h1>
          <p className="mt-5 text-lead text-text-muted">{body}</p>
          {bullets ? (
            <ul className="mt-6 grid gap-2.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-text-muted">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
          ) : null}
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={cta.href} variant="primary" size="lg">
              {cta.label}
            </Button>
            <Button href="/products" variant="ghost" size="lg">
              Browse products
            </Button>
          </div>
        </div>
        <div className="relative mx-auto grid aspect-square w-full max-w-sm place-items-center">
          <div className="absolute inset-[10%] rounded-full border border-border opacity-30" />
          <div className="absolute inset-[28%] rounded-full border border-border opacity-25" />
          <EyeMark size={140} scanning className="text-text-strong" />
        </div>
      </Container>
    </section>
  );
}
