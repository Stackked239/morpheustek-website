import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { primaryCta } from "@/lib/site";
import { ClauseHeader } from "./ClauseHeader";

/* §06 — The Acceptance Test (conversion)
   The 90-day trial written as the formal test procedure it actually is.
   The airiest section on the page — deceleration before the ask. The yellow
   CTA sits exactly where the sign-off stamp would. */

const clauses = [
  {
    num: "1.0",
    head: "Scope",
    body: "Mount the unit on your robot, beside the incumbent if you like.",
  },
  {
    num: "2.0",
    head: "Duration",
    body: "90 days. In your facility, on your stack. $0.",
  },
  {
    num: "3.0",
    head: "Procedure",
    body: "Validate the point cloud, the protective fields, and the interfaces against your own requirements.",
  },
  {
    num: "4.0",
    head: "Pass / fail",
    body: "Your data decides. If it fails your test, send it back. No commitment.",
  },
] as const;

export function AcceptanceTest() {
  return (
    <section className="bg-bg py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-6">
        <ClauseHeader
          index="06"
          eyebrow="The acceptance test"
          title="Run the acceptance test."
          lead="Every claim above is certified, priced, or linked. The last variable is performance on your robot — so verify that too."
        />

        <dl className="mt-12">
          {clauses.map((c) => (
            <div key={c.num} className="grid grid-cols-[3.5rem_7rem_1fr] items-baseline gap-4 border-b border-border py-4 max-sm:grid-cols-[3.5rem_1fr]">
              <dt className="tnum font-mono text-anno text-brand-blue">{c.num}</dt>
              <dt className="font-mono text-anno-sm uppercase text-text-strong max-sm:hidden">{c.head}</dt>
              <dd className="text-base text-text max-sm:col-start-2">
                <span className="mr-2 font-mono text-anno-sm uppercase text-text-strong sm:hidden">{c.head} — </span>
                {c.body}
              </dd>
            </div>
          ))}
        </dl>

        {/* the signature line */}
        <div className="mt-14 grid grid-cols-[2fr_1fr] gap-8 font-mono text-anno-sm uppercase text-text-muted">
          <div className="border-b border-text-muted pb-1">Approved by</div>
          <div className="border-b border-text-muted pb-1">Date</div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Button href={primaryCta.trial.href} variant="primary" size="lg" className="rounded-sm">
            Start the 90-day acceptance test
          </Button>
          <Link
            href={primaryCta.quote.href}
            className="font-semibold text-brand-blue underline-offset-4 hover:underline"
          >
            {primaryCta.quote.label} →
          </Link>
        </div>
      </div>

      {/* end of document */}
      <div className="mx-auto mt-24 max-w-[100rem] border-t border-border px-6">
        <p className="py-4 text-center font-mono text-anno-sm uppercase text-text-subtle">
          End of document · MT-HP-01 · Rev A
        </p>
      </div>
    </section>
  );
}
