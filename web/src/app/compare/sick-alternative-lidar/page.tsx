import type { Metadata } from "next";
import { BadgeCheck, Check, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/marketing/PageHero";
import { CtaBand } from "@/components/marketing/CtaBand";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The LiDAR Alternative to SICK — Safety LiDAR at a Fraction of the Price",
  description:
    "The OLEI GS1-5 carries the same safety class as SICK (Type 3 / SIL2 / PL d) at a fraction of the price, and beats the nanoScan3 on protective range — backed by a 90-day risk-free trial.",
  alternates: { canonical: "/compare/sick-alternative-lidar" },
};

const rows: { spec: string; mt: string; nano: string; micro: string }[] = [
  { spec: "Scanning angle", mt: "270°", nano: "275°", micro: "275°" },
  { spec: "Safety rating", mt: "Type 3 · SIL2 · PL d", nano: "Type 3 · SIL2 · PL d", micro: "Type 3 · SIL2 · PL d" },
  { spec: "Protective range", mt: "5 m", nano: "3 m", micro: "up to 9 m" },
  { spec: "90-day risk-free trial", mt: "Yes", nano: "—", micro: "—" },
  { spec: "North American stocking & support", mt: "Yes", nano: "Channel", micro: "Channel" },
];

export default function SickAlternativePage() {
  return (
    <>
      <PageHero
        eyebrow="The honest comparison"
        title="The LiDAR alternative to SICK."
        lead="SICK is excellent — nobody gets fired for buying it. The real question is whether your application needs to pay the SICK premium. For most commercial robotics, it doesn't."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare/sick-alternative-lidar" },
        ]}
      >
        <Button href="/book-a-meeting?intent=trial" variant="primary" size="lg">
          Start a 90-day trial
        </Button>
        <Button href="/safety-lidar" variant="ghost" size="lg">
          Explore safety LiDAR
        </Button>
      </PageHero>

      {/* The three lines */}
      <Section>
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: "Same safety class", b: "The GS1-5 is certified to Type 3 / SIL2 / PL d — the same safety class as the nanoScan3 and microScan3." },
              { icon: Check, t: "Better on protective range", b: "5 m protective range beats the nanoScan3's 3 m — lead with that on smaller AGVs where the nanoScan3 is the default." },
              { icon: BadgeCheck, t: "Risk-free to prove", b: "Put it on your AGV next to the SICK and see the data yourself for 90 days — no commitment." },
            ].map((c) => (
              <div key={c.t} className="surface-card p-6">
                <span className="grid size-11 place-items-center rounded-md bg-bg-muted text-brand-blue">
                  <c.icon className="size-5" />
                </span>
                <h2 className="mt-4 font-display text-h5 font-bold text-text-strong">{c.t}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-muted">{c.b}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Comparison table */}
      <Section tone="subtle">
        <Container>
          <Eyebrow>GS1-5 vs SICK safety scanners</Eyebrow>
          <h2 className="mt-3 font-display text-h2 font-extrabold text-text-strong">Same class. Different math.</h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse overflow-hidden rounded-lg">
              <caption className="sr-only">OLEI GS1-5 compared with SICK nanoScan3 and microScan3</caption>
              <thead>
                <tr className="bg-bg-muted text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                  <th scope="col" className="p-4">Spec</th>
                  <th scope="col" className="border-l border-border bg-accent/15 p-4 text-text-strong">OLEI GS1-5</th>
                  <th scope="col" className="border-l border-border p-4">SICK nanoScan3</th>
                  <th scope="col" className="border-l border-border p-4">SICK microScan3</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.spec} className={i % 2 ? "bg-bg-muted/40" : "bg-surface"}>
                    <th scope="row" className="p-4 text-left font-medium text-text-muted">{r.spec}</th>
                    <td className="tnum border-l border-border bg-accent/10 p-4 font-semibold text-text-strong">{r.mt}</td>
                    <td className="tnum border-l border-border p-4 text-text-muted">{r.nano}</td>
                    <td className="tnum border-l border-border p-4 text-text-muted">{r.micro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-sm text-text-muted">
            Where a deal genuinely needs 9 m protective range or 128 fields, that&apos;s microScan3 territory — we won&apos;t
            oversell. There, the conversation is total cost across a fleet, plus the rest of the stack: 3D LiDAR, cameras,
            and edge compute.
          </p>
        </Container>
      </Section>

      {/* Fleet economics */}
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>Fleet economics</Eyebrow>
              <h2 className="mt-3 font-display text-h2 font-extrabold text-text-strong">
                Multiply the per-unit delta by your unit count.
              </h2>
              <p className="mt-5 text-lead text-text-muted">
                On a 50-AGV build, the difference between a premium safety scanner and the GS1-5 — at the same safety
                class — is frequently the customer&apos;s whole project margin. That&apos;s the number worth running.
              </p>
              <ul className="mt-6 grid gap-2.5">
                {site.pillars.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-text-muted">
                    <Check className="mt-0.5 size-5 shrink-0 text-success" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="surface-card p-7">
              <p className="eyebrow">Free download</p>
              <h3 className="mt-2 font-display text-h4 font-bold text-text-strong">SICK / Hokuyo Alternative Comparison Checklist</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Evaluate lower-cost, more flexible alternatives to legacy safety scanners — without increasing technical
                risk. Range, FOV, certification, lead time, support, and total cost across a fleet.
              </p>
              <Button
                href="/resources/sick-hokuyo-alternative-comparison-checklist"
                variant="primary"
                size="lg"
                className="mt-6"
              >
                Download the checklist
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <CtaBand
        title="See the GS1-5 in your own environment."
        body="Put it on your AGV next to the SICK and validate the data for 90 days. No commitment."
        primary={{ label: "Request a trial unit", href: "/book-a-meeting?intent=trial" }}
        secondary={{ label: "LiDAR alternative to Hokuyo", href: "/compare/hokuyo-alternative-lidar" }}
      />
    </>
  );
}
