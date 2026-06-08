import type { Metadata } from "next";
import { CalendarCheck, Check, FlaskConical, MessagesSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Book a Meeting — Talk to a Perception Engineer",
  description:
    "Tell us what your robot needs to sense. A MorpheusTEK engineer will map the right LiDAR, camera, safety, and compute stack — and line up a 90-day risk-free trial.",
  alternates: { canonical: "/book-a-meeting" },
};

type IntentConfig = { eyebrow: string; title: string; lead: string; submit: string };

const intents: Record<string, IntentConfig> = {
  trial: {
    eyebrow: "90-day risk-free trial",
    title: "Put a unit on your robot — risk-free for 90 days.",
    lead: "Tell us the application and we'll match the right trial unit, agree what success looks like, and get it shipping. No commitment.",
    submit: "Request a trial unit",
  },
  engineer: {
    eyebrow: "Talk to an engineer",
    title: "Get a straight answer from a perception engineer.",
    lead: "Range, FOV, environment, safety, integration — bring the hard questions. We'll map the right sensing stack for your application.",
    submit: "Talk to an engineer",
  },
  quote: {
    eyebrow: "Get a quote",
    title: "Price the right stack for your build.",
    lead: "Share your application and quantities and we'll put together a quote — sensor, edge compute, cameras, and support, where it fits.",
    submit: "Request a quote",
  },
  meeting: {
    eyebrow: "Giving sight to robotics",
    title: "Let's get your robot seeing.",
    lead: "Tell us what you're building. We'll map the right perception stack and, if it fits, put a 90-day trial unit in your hands.",
    submit: "Book a meeting",
  },
};

const steps = [
  { icon: MessagesSquare, t: "Discovery", b: "We learn the application — what it must detect, at what range, in what environment." },
  { icon: FlaskConical, t: "90-day trial", b: "We ship the right unit and agree what “it works” means in your environment." },
  { icon: CalendarCheck, t: "Deploy", b: "Prototype to production with U.S.-based support, stocking, and customization." },
];

export default async function BookMeetingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const key = typeof sp.intent === "string" && intents[sp.intent] ? sp.intent : "meeting";
  const cfg = intents[key];
  const product = typeof sp.product === "string" ? sp.product : undefined;

  return (
    <section className="dark relative overflow-hidden bg-bg">
      <div className="circuit-motif pointer-events-none absolute inset-x-0 top-0 h-full opacity-50" aria-hidden />
      <Container className="relative">
        <Section>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div>
              <Eyebrow>{cfg.eyebrow}</Eyebrow>
              <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-text-strong">
                {cfg.title}
              </h1>
              <p className="mt-5 text-lead text-text-muted">{cfg.lead}</p>

              <div className="mt-10 grid gap-4">
                {steps.map((s) => (
                  <div key={s.t} className="flex items-start gap-4">
                    <span className="grid size-11 shrink-0 place-items-center rounded-md bg-bg-muted text-brand-blue">
                      <s.icon className="size-5" />
                    </span>
                    <div>
                      <h2 className="font-display text-h5 font-bold text-text-strong">{s.t}</h2>
                      <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{s.b}</p>
                    </div>
                  </div>
                ))}
              </div>

              <ul className="mt-10 grid gap-2.5 border-t border-border pt-8">
                {["No spam — just a conversation about your application", "We sell the whole solution, not just a sensor", "North American support behind every deployment"].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:pt-2">
              <LeadForm intent={product ? `${key}:${product}` : key} submitLabel={cfg.submit} />
            </div>
          </div>
        </Section>
      </Container>
    </section>
  );
}
