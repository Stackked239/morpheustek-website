import type { Metadata } from "next";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Meet Us at the Booth",
  description: "Reserve a slot to meet MorpheusTEK on the show floor. Tell us what you're building and we'll have a demo ready.",
  alternates: { canonical: "/shows/meet-us-at-the-booth" },
};

export default function BoothPage() {
  return (
    <section className="dark relative overflow-hidden bg-bg">
      <div className="circuit-motif pointer-events-none absolute inset-x-0 top-0 h-full opacity-50" aria-hidden />
      <Container className="relative">
        <Section>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div>
              <Eyebrow>Meet us at the booth</Eyebrow>
              <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-text-strong">
                We&apos;ll save you a slot.
              </h1>
              <p className="mt-5 text-lead text-text-muted">
                Trade shows move fast. Tell us you&apos;re coming and what your robot needs to sense — we&apos;ll have the
                right demo ready and the right person waiting, so you get value in five minutes, not fifty.
              </p>
              <ul className="mt-9 grid gap-2.5 border-t border-border pt-8">
                {[
                  "See LiDAR, 3D cameras, and safety sensing live",
                  "Get a straight answer on your application",
                  "Line up a 90-day trial unit on the spot",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:pt-2">
              <LeadForm intent="booth" submitLabel="Save me a slot" />
            </div>
          </div>
        </Section>
      </Container>
    </section>
  );
}
