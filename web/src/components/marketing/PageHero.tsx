import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";

type Crumb = { label: string; href: string };

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  align = "left",
  breadcrumbs,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  breadcrumbs?: Crumb[];
}) {
  return (
    <section className="dark relative overflow-hidden bg-bg">
      <div className="circuit-motif pointer-events-none absolute inset-x-0 top-0 h-full opacity-70" aria-hidden />
      <Container className={cn("relative py-14 md:py-20", align === "center" && "text-center")}>
        {breadcrumbs ? (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1 font-mono text-xs text-text-muted">
              {breadcrumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-1">
                  {i > 0 ? <ChevronRight className="size-3 text-text-subtle" /> : null}
                  <Link href={c.href} className="hover:text-text">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        <div className={cn("max-w-3xl", align === "center" && "mx-auto")}>
          {eyebrow ? <Eyebrow className={align === "center" ? "justify-center" : undefined}>{eyebrow}</Eyebrow> : null}
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] font-extrabold leading-[1.05] tracking-[-0.02em] text-text-strong">
            {title}
          </h1>
          {lead ? <p className="mt-5 text-lead text-text-muted">{lead}</p> : null}
          {children ? <div className={cn("mt-8 flex flex-wrap gap-3", align === "center" && "justify-center")}>{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
