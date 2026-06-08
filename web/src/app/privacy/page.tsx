import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MorpheusTEK collects, uses, and protects the information you share with us.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" lead="Placeholder — the final privacy policy will be reviewed and published before launch." />
      <Section>
        <Container>
          <div className="max-w-2xl space-y-4 text-text-muted">
            <p>
              MorpheusTEK collects the information you provide through our forms — such as your name, company, email, and
              the details of your application — solely to respond to your inquiry and support your evaluation.
            </p>
            <p>We do not sell your information. You can ask us to delete it at any time by emailing {site.email}.</p>
            <p className="font-mono text-xs text-text-subtle">This page is a Phase-1 placeholder pending legal review.</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
