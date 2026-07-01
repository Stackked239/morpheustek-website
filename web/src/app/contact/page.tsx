import { Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LeadForm } from "@/components/forms/LeadForm";
import { getRobotTypes, getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Contact MorpheusTEK",
  description: "Talk to MorpheusTEK about LiDAR, 3D cameras, safety sensing, and edge compute for your robotics application.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [site, robotTypes] = await Promise.all([getSiteSettings(), getRobotTypes()]);

  return (
    <section className="dark relative overflow-hidden bg-bg">
      <div className="circuit-motif pointer-events-none absolute inset-x-0 top-0 h-full opacity-50" aria-hidden />
      <Container className="relative">
        <Section>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div>
              <Eyebrow>Contact</Eyebrow>
              <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-text-strong">
                Let&apos;s talk perception.
              </h1>
              <p className="mt-5 text-lead text-text-muted">
                Tell us what your robot needs to sense and we&apos;ll point you to the right stack — or the right person.
              </p>
              <div className="mt-9 space-y-4">
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-text hover:text-brand-blue">
                  <span className="grid size-11 place-items-center rounded-md bg-bg-muted text-brand-blue">
                    <Mail className="size-5" />
                  </span>
                  <span>
                    <span className="block font-mono text-xs uppercase tracking-wide text-text-subtle">Email</span>
                    {site.email}
                  </span>
                </a>
                <a href={`tel:${site.phoneHref}`} className="flex items-center gap-3 text-text hover:text-brand-blue">
                  <span className="grid size-11 place-items-center rounded-md bg-bg-muted text-brand-blue">
                    <Phone className="size-5" />
                  </span>
                  <span>
                    <span className="block font-mono text-xs uppercase tracking-wide text-text-subtle">Phone</span>
                    {site.phone}
                  </span>
                </a>
              </div>
            </div>
            <div className="lg:pt-2">
              <LeadForm intent="contact" submitLabel="Send message" robotTypes={robotTypes} />
            </div>
          </div>
        </Section>
      </Container>
    </section>
  );
}
