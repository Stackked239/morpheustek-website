import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { mainNav, primaryCta } from "@/lib/site";
import { categories, featuredProduct, productImage } from "@/lib/catalog";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { ThemeControls } from "./ThemeControls";

export function Header() {
  const featured = featuredProduct();
  const menuCategories = categories.map((c) => ({ slug: c.slug, label: c.label, blurb: c.blurb }));
  const navCategories = categories.map((c) => ({ slug: c.slug, label: c.label }));

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            <MegaMenu
              categories={menuCategories}
              featured={{ slug: featured.slug, name: featured.name, tagline: featured.tagline, image: productImage(featured.slug) }}
            />
            {mainNav
              .filter((n) => n.label !== "Products")
              .map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="inline-flex h-9 items-center whitespace-nowrap rounded-md px-3 text-sm font-medium text-text-muted transition-colors hover:bg-bg-muted hover:text-text"
                >
                  {n.label}
                </Link>
              ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeControls className="hidden sm:flex" />
          {/* Header carries only the primary trial CTA — "Talk to an engineer" was pulled
              out to make room for the full "Robotics glossary" nav tab (it still appears in
              every page hero). Outline, not yellow: brand rule = one yellow CTA per viewport,
              and the page hero owns it. ghost reads correctly in all three themes (secondary's
              white-on-light-blue fails AA contrast in dark). */}
          <Button href={primaryCta.trial.href} variant="ghost" size="sm" className="hidden md:inline-flex">
            Start a 90-day trial
          </Button>
          <MobileNav nav={mainNav} categories={navCategories} />
        </div>
      </Container>
    </header>
  );
}
