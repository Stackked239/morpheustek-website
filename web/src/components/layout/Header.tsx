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
                  className="inline-flex h-9 items-center rounded-md px-3 text-sm font-medium text-text-muted transition-colors hover:bg-bg-muted hover:text-text"
                >
                  {n.label}
                </Link>
              ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeControls className="hidden sm:flex" />
          <Button href={primaryCta.engineer.href} variant="ghost" size="sm" className="hidden xl:inline-flex">
            Talk to an engineer
          </Button>
          <Button href={primaryCta.trial.href} variant="primary" size="sm" className="hidden md:inline-flex">
            Start a 90-day trial
          </Button>
          <MobileNav nav={mainNav} categories={navCategories} />
        </div>
      </Container>
    </header>
  );
}
