"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AdminInput } from "@/components/admin/forms/AdminField";
import { cn } from "@/lib/cn";
import type { SitePageOption } from "@/lib/admin/site-pages";

let cache: SitePageOption[] | null = null;
let inflight: Promise<SitePageOption[]> | null = null;

async function loadSitePages(): Promise<SitePageOption[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch("/api/admin/site-pages")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load pages");
        return r.json() as Promise<SitePageOption[]>;
      })
      .then((pages) => {
        cache = pages;
        return pages;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/**
 * Searchable combobox for internal page links.
 * Type to filter by page name or path; pick from the list or paste any custom URL.
 */
export function PageLinkPicker({
  value,
  onChange,
  placeholder = "/products",
  className,
}: {
  value: string;
  onChange: (href: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<SitePageOption[]>(cache ?? []);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);

  useEffect(() => {
    loadSitePages().then(setPages).catch(() => {});
  }, []);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pages;
    return pages.filter(
      (p) =>
        p.href.toLowerCase().includes(q) ||
        p.label.toLowerCase().includes(q) ||
        p.group.toLowerCase().includes(q),
    );
  }, [pages, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, SitePageOption[]>();
    for (const p of filtered.slice(0, 80)) {
      const list = map.get(p.group) ?? [];
      list.push(p);
      map.set(p.group, list);
    }
    return [...map.entries()];
  }, [filtered]);

  function pick(href: string) {
    onChange(href);
    setQuery(href);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <AdminInput
        value={query}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "Enter" && filtered[0]) {
            e.preventDefault();
            pick(filtered[0].href);
          }
        }}
      />
      {open && grouped.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-64 w-full min-w-[18rem] overflow-auto rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          {grouped.map(([group, items]) => (
            <li key={group}>
              <p className="sticky top-0 bg-surface px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-text-subtle">
                {group}
              </p>
              <ul>
                {items.map((p) => (
                  <li key={p.href}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={p.href === value}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(p.href)}
                      className={cn(
                        "flex w-full flex-col gap-0.5 px-3 py-2 text-left transition hover:bg-bg-muted",
                        p.href === value && "bg-bg-muted",
                      )}
                    >
                      <span className="text-sm font-medium text-text-strong">{p.label}</span>
                      <span className="font-mono text-[10px] text-brand-blue">{p.href}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : open && query.trim() && filtered.length === 0 ? (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-xs text-text-muted shadow-lg">
          No matching pages — press Enter to use your custom link.
        </div>
      ) : null}
    </div>
  );
}
