import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, FileText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LeadForm } from "@/components/forms/LeadForm";
import { getLeadMagnet, leadMagnets } from "@/lib/catalog";

export function generateStaticParams() {
  return leadMagnets.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getLeadMagnet(slug);
  if (!m) return {};
  return { title: m.title, description: m.blurb, alternates: { canonical: `/resources/${m.slug}` } };
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const magnet = getLeadMagnet(slug);
  if (!magnet) notFound();

  return (
    <section className="dark relative overflow-hidden bg-bg">
      <div className="circuit-motif pointer-events-none absolute inset-x-0 top-0 h-full opacity-50" aria-hidden />
      <Container className="relative">
        <Section>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <Eyebrow>Free resource · {magnet.icp}</Eyebrow>
              <h1 className="mt-4 font-display text-[clamp(1.9rem,4vw,3rem)] font-extrabold leading-tight tracking-[-0.02em] text-text-strong">
                {magnet.title}
              </h1>
              <p className="mt-5 text-lead text-text-muted">{magnet.blurb}</p>

              <div className="mt-9 rounded-lg border border-border bg-surface p-6">
                <div className="flex items-center gap-2 text-text-strong">
                  <FileText className="size-5 text-brand-blue" />
                  <span className="font-display font-bold">What&apos;s inside</span>
                </div>
                <ul className="mt-4 grid gap-2.5">
                  {magnet.contents.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm text-text-muted">
                      <Check className="mt-0.5 size-4 shrink-0 text-success" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:pt-10">
              <p className="mb-4 font-display text-h4 font-bold text-text-strong">Get your copy</p>
              <LeadForm intent={`download:${magnet.slug}`} submitLabel="Email me the guide" />
            </div>
          </div>
        </Section>
      </Container>
    </section>
  );
}
