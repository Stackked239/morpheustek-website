import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms governing your use of the MorpheusTEK website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of use" lead="Placeholder — the final terms of use will be reviewed and published before launch." />
      <Section>
        <Container>
          <div className="max-w-2xl space-y-4 text-text-muted">
            <p>
              This website and its content are provided for general information about MorpheusTEK products and services.
              Specifications are subject to change; certifications apply to specific products as noted.
            </p>
            <p className="font-mono text-xs text-text-subtle">This page is a Phase-1 placeholder pending legal review.</p>
          </div>
        </Container>
      </Section>
    </>
  );
}
