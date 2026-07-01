"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SiteSettings } from "@/lib/cms";

// Resources dropdown — a small hover/focus menu (same 120ms-grace interaction as the
// Products MegaMenu) holding the library, glossary, blog, and shows so each keeps its
// full clever name without crowding the top bar. Narrow panel, left-aligned to the
// trigger — it sits well within the viewport, so no R04-style centering is needed.
export function ResourcesMenu({ links }: { links: SiteSettings["resourcesNav"] }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openNow = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onFocusCapture={openNow}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        href="/resources"
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex h-9 items-center gap-1 whitespace-nowrap rounded-md px-3 text-sm font-medium text-text-muted transition-colors hover:bg-bg-muted hover:text-text"
      >
        Resources
        <ChevronDown className={cn("size-4 transition-transform duration-200", open && "rotate-180")} />
      </Link>

      <div
        className={cn(
          "absolute left-0 top-full z-50 pt-3 transition-all duration-200",
          open ? "visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="w-80 overflow-hidden rounded-xl border border-border border-t-2 border-t-accent bg-surface p-2 shadow-[var(--shadow-md)]">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group block rounded-md p-3 transition-colors hover:bg-bg-muted">
              <div className="font-display text-sm font-bold text-text-strong group-hover:text-brand-blue">{l.label}</div>
              {l.description ? <div className="mt-0.5 text-xs leading-snug text-text-muted">{l.description}</div> : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
