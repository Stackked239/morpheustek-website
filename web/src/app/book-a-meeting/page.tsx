import type { Metadata } from "next";
import { CalendarCheck, Check, FlaskConical, MessagesSquare } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { LeadForm } from "@/components/forms/LeadForm";
import { getContent, getRobotTypes } from "@/lib/cms";
import { bookMeetingPageDefaults } from "@/lib/cms/page-defaults";

const stepIcons = [MessagesSquare, FlaskConical, CalendarCheck] as const;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContent("page.book_meeting", bookMeetingPageDefaults);
  return {
    title: page.meta.title,
    description: page.meta.description,
    alternates: { canonical: "/book-a-meeting" },
  };
}

export default async function BookMeetingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [sp, page, robotTypes] = await Promise.all([
    searchParams,
    getContent("page.book_meeting", bookMeetingPageDefaults),
    getRobotTypes(),
  ]);

  const key = typeof sp.intent === "string" && page.intents[sp.intent] ? sp.intent : "meeting";
  const cfg = page.intents[key];
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
                {page.steps.map((s, i) => {
                  const Icon = stepIcons[i] ?? MessagesSquare;
                  return (
                    <div key={s.title} className="flex items-start gap-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-md bg-bg-muted text-brand-blue">
                        <Icon className="size-5" />
                      </span>
                      <div>
                        <h2 className="font-display text-h5 font-bold text-text-strong">{s.title}</h2>
                        <p className="mt-0.5 text-sm leading-relaxed text-text-muted">{s.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <ul className="mt-10 grid gap-2.5 border-t border-border pt-8">
                {page.trustBullets.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:pt-2">
              <LeadForm
                intent={product ? `${key}:${product}` : key}
                submitLabel={cfg.submit}
                robotTypes={robotTypes}
              />
            </div>
          </div>
        </Section>
      </Container>
    </section>
  );
}
