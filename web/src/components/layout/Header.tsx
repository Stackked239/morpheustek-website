import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import type { SiteSettings } from "@/lib/cms";
import { MegaMenu } from "./MegaMenu";
import { ResourcesMenu } from "./ResourcesMenu";
import { MobileNav } from "./MobileNav";
import { ThemeControls } from "./ThemeControls";

type NavItem = SiteSettings["mainNav"][number];
type PrimaryCta = SiteSettings["primaryCta"];

export function Header({
  mainNav,
  primaryCta,
  categories,
  navCategories,
  featured,
  resourcesNav,
}: {
  mainNav: NavItem[];
  primaryCta: PrimaryCta;
  categories: { slug: string; label: string; blurb: string }[];
  navCategories: { slug: string; label: string }[];
  resourcesNav: SiteSettings["resourcesNav"];
  featured?: { slug: string; name: string; tagline: string; image?: string };
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {mainNav.map((n) => {
              if (n.label === "Products" && featured)
                return (
                  <MegaMenu
                    key={n.href}
                    categories={categories}
                    featured={{
                      slug: featured.slug,
                      name: featured.name,
                      tagline: featured.tagline,
                      image: featured.image,
                    }}
                  />
                );
              if (n.label === "Resources") return <ResourcesMenu key={n.href} links={resourcesNav} />;
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
          <Button href={primaryCta.trial.href} variant="ghost" size="sm" className="hidden md:inline-flex">
            Start a 90-day trial
          </Button>
          <MobileNav nav={mainNav} categories={navCategories} resources={resourcesNav} />
        </div>
      </Container>
    </header>
  );
}
