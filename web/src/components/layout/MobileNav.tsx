"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { ThemeControls } from "./ThemeControls";

type Item = { label: string; href: string };
type Cat = { slug: string; label: string };

export function MobileNav({ nav, categories }: { nav: Item[]; categories: Cat[] }) {
  const [open, setOpen] = useState(false);
  const [prodOpen, setProdOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="grid size-10 place-items-center rounded-md text-text hover:bg-bg-muted focus-visible:outline-2"
      >
        <Menu className="size-5" />
      </button>

      <div
        className={cn("fixed inset-0 z-[60] transition-opacity duration-200", open ? "visible opacity-100" : "invisible opacity-0")}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-mt-navy-900/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-bg shadow-[var(--shadow-xl)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <ThemeControls />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-10 place-items-center rounded-md hover:bg-bg-muted focus-visible:outline-2">
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            <button
              type="button"
              onClick={() => setProdOpen((v) => !v)}
              aria-expanded={prodOpen}
              className="flex w-full items-center justify-between rounded-md px-3 py-3 text-left font-display text-lg font-bold text-text-strong hover:bg-bg-muted"
            >
              Products
              <ChevronDown className={cn("size-5 transition-transform", prodOpen && "rotate-180")} />
            </button>
            {prodOpen ? (
              <div className="mb-1 ml-3 border-l border-border pl-3">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/${c.slug}`} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm text-text-muted hover:bg-bg-muted hover:text-text">
                    {c.label}
                  </Link>
                ))}
              </div>
            ) : null}
            {nav
              .filter((n) => n.label !== "Products")
              .map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 font-display text-lg font-bold text-text-strong hover:bg-bg-muted">
                  {n.label}
                </Link>
              ))}
          </nav>

          <div className="grid gap-2 border-t border-border p-4">
            <Button href="/book-a-meeting?intent=trial" variant="primary" size="lg" className="w-full">
              Start a 90-day trial
            </Button>
            <Button href="/book-a-meeting?intent=engineer" variant="ghost" size="lg" className="w-full">
              Talk to an engineer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
