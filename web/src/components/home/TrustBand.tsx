import Link from "next/link";
import { ArrowRight, Globe, ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getProduct } from "@/lib/catalog";
import type { HomeCatalog } from "@/lib/cms/home-catalog";
import { homeProduct } from "@/lib/cms/home-catalog";
import { defaultTrustBandContent } from "@/lib/cms/home-defaults";

type Stat = { value: string; label: string };

export function TrustBand({
  catalog,
  content = defaultTrustBandContent,
}: {
  catalog?: HomeCatalog;
  content?: typeof defaultTrustBandContent;
}) {
  const gs15 = homeProduct(catalog, "gs1-5-safety-lidar", getProduct);
  const safetyRating =
    gs15?.keySpecs?.find((s) => s.label === "Safety rating")?.value ?? "Type 3 · SIL2 · PL d";

  const stats: Stat[] = [
    { value: "30 yr", label: "Instrument heritage" },
    { value: safetyRating, label: "Functional safety · GS1-5" },
    { value: "90 day", label: "Trial on your floor" },
    { value: "OLEI", label: "Exclusive NA distributor" },
  ];

  return (
    <Section
      tone="subtle"
      className="relative isolate overflow-hidden border-t border-border !py-14 md:!py-20 !bg-bg-muted"
      id="trust"
    >
      <div className="pointcloud-texture pointer-events-none absolute inset-0 opacity-[0.4]" aria-hidden />

      <Container className="relative grid gap-x-12 gap-y-10 md:grid-cols-[1.25fr_1fr] md:items-center">
        <div>
          <Eyebrow>{content.eyebrow}</Eyebrow>

          <h2 className="mt-5 max-w-2xl font-display text-h2 font-extrabold uppercase leading-[1.04] tracking-tight text-text-strong">
            {content.title}{" "}
            <span className="text-brand-blue">{content.titleAccent}</span>
          </h2>

          <p className="mt-5 max-w-xl text-lead text-text-muted">{content.body}</p>

          <Link
            href={content.compareLink.href}
            className="group mt-7 inline-flex items-center gap-2 font-mono text-anno-sm uppercase tracking-[0.14em] text-brand-blue transition-colors hover:text-brand-blue-hover focus-visible:outline-2"
          >
            {content.compareLink.label}
            <ArrowRight
              className="size-4 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>

        <dl
          className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border"
          aria-label="MorpheusTEK credibility facts"
        >
          {stats.map((s, i) => (
            <div key={s.label} className="relative flex flex-col gap-1.5 bg-bg px-4 py-5">
              {i === 1 && (
                <ShieldCheck className="absolute right-3 top-4 size-4 text-accent" aria-hidden />
              )}
              <dt className="font-mono text-h4 font-bold leading-none tracking-tight text-text-strong">{s.value}</dt>
              <dd className="font-mono text-anno-sm uppercase tracking-[0.14em] text-text-muted">{s.label}</dd>
            </div>
          ))}
        </dl>

        <div className="relative flex flex-col gap-3 rounded-r-md border-l-2 border-l-accent bg-bg px-5 py-5 sm:flex-row sm:items-center sm:gap-6 md:col-span-2">
          <p className="flex shrink-0 items-center gap-2 font-mono text-anno-sm uppercase tracking-[0.14em] text-brand-blue">
            <Globe className="size-4" aria-hidden />
            {content.supplyEyebrow}
          </p>
          <p className="text-text">{content.supplyBody}</p>
        </div>
      </Container>
    </Section>
  );
}
