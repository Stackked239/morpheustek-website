import Link from "next/link";
import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import type { defaultBoothMode } from "@/lib/cms/home-defaults";

type BoothContent = typeof defaultBoothMode;

export function BoothModeBanner({ content }: { content: BoothContent }) {
  if (!content.enabled) return null;

  return (
    <section className="border-b border-border bg-accent">
      <Container className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-accent-text/80">
            Live at {content.showName}
            {content.boothNumber ? ` · Booth ${content.boothNumber}` : ""}
          </p>
          <h2 className="mt-1 font-display text-xl font-extrabold uppercase leading-tight tracking-tight text-accent-text md:text-2xl">
            {content.headline}
          </h2>
          {content.subheadline ? (
            <p className="mt-2 max-w-2xl text-sm text-accent-text/90">{content.subheadline}</p>
          ) : null}
          {content.location ? (
            <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-text/80">
              <MapPin className="size-3.5" aria-hidden />
              {content.location}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <Button href={content.cta.href} variant="secondary" size="lg" className="!bg-bg !text-text-strong">
            {content.cta.label}
          </Button>
          <Link
            href="/shows"
            className="self-center font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-accent-text underline-offset-4 hover:underline"
          >
            All shows →
          </Link>
        </div>
      </Container>
    </section>
  );
}
