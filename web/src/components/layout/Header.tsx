import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { mainNav, primaryCta, resourcesNav } from "@/lib/site";
import { categories, featuredProduct, productImage } from "@/lib/catalog";
import { MegaMenu } from "./MegaMenu";
import { ResourcesMenu } from "./ResourcesMenu";
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
            {/* Render in order; Products + Resources are dropdowns, the rest plain tabs. */}
            {mainNav.map((n) => {
              if (n.label === "Products")
                return (
                  <MegaMenu
                    key={n.href}
                    categories={menuCategories}
                    featured={{ slug: featured.slug, name: featured.name, tagline: featured.tagline, image: productImage(featured.slug) }}
                  />
                );
              if (n.label === "Resources") return <ResourcesMenu key={n.href} />;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="inline-flex h-9 items-center whitespace-nowrap rounded-md px-3 text-sm font-medium text-text-muted transition-colors hover:bg-bg-muted hover:text-text"
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeControls className="hidden sm:flex" />
          <Button href={primaryCta.engineer.href} variant="ghost" size="sm" className="hidden xl:inline-flex">
            Talk to an engineer
          </Button>
          {/* Outline, not yellow: brand rule = one yellow CTA per viewport, and the page hero
              owns it. ghost reads correctly in all three themes (secondary's white-on-light-blue
              fails AA contrast in dark). */}
          <Button href={primaryCta.trial.href} variant="ghost" size="sm" className="hidden md:inline-flex">
            Start a 90-day trial
          </Button>
          <MobileNav nav={mainNav} categories={navCategories} resources={resourcesNav} />
        </div>
      </Container>
    </header>
  );
}
