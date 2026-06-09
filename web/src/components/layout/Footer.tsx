import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { footerNav, site } from "@/lib/site";
import { leadMagnets } from "@/lib/catalog";

export function Footer() {
  const primaryMagnet = leadMagnets.find((m) => m.primary) ?? leadMagnets[0];
  const year = 2026;

  return (
    <footer className="dark relative overflow-hidden border-t border-border bg-bg text-text">
      <div className="circuit-motif pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70" aria-hidden />
      <Container className="relative py-16">
        {/* Stay-in-touch / primary lead magnet */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-surface p-7 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="eyebrow mb-2">Stay ahead of the spec</p>
            <h2 className="font-display text-h4 font-bold text-text-strong">
              Get the {primaryMagnet.title}
            </h2>
            <p className="mt-1 text-sm text-text-muted">{primaryMagnet.blurb}</p>
          </div>
          <Button href={`/resources/${primaryMagnet.slug}`} variant="primary" size="lg" className="shrink-0">
            Download the checklist
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">{site.oneLiner}</p>
            <div className="mt-5 space-y-2 text-sm">
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-text-muted hover:text-text">
                <Mail className="size-4 text-brand-blue" /> {site.email}
              </a>
              <a href={`tel:${site.phoneHref}`} className="flex items-center gap-2 text-text-muted hover:text-text">
                <Phone className="size-4 text-brand-blue" /> {site.phone}
              </a>
              <p className="flex items-start gap-2 text-text-muted">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-blue" /> {site.address}
              </p>
            </div>
          </div>

          {footerNav.map((col) => (
            <div key={col.heading}>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-text-subtle">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-text-muted transition-colors hover:text-text">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-6 text-xs text-text-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {year} MorpheusTEK. <span className="text-text-muted">{site.distributor}.</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-text-muted">Giving Sight to Robotics</span>
            <Link href="/privacy" className="hover:text-text">Privacy</Link>
            <Link href="/terms" className="hover:text-text">Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
