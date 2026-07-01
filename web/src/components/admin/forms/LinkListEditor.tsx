"use client";

import { Plus, Trash2 } from "lucide-react";
import { AdminField, AdminInput, AdminTextarea } from "./AdminField";
import { PageLinkPicker } from "./PageLinkPicker";

export type NavLink = { label: string; href: string; description?: string };

export function LinkListEditor({
  items,
  onChange,
  showDescription = false,
  addLabel = "Add link",
}: {
  items: NavLink[];
  onChange: (items: NavLink[]) => void;
  showDescription?: boolean;
  addLabel?: string;
}) {
  function update(i: number, patch: Partial<NavLink>) {
    onChange(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function add() {
    onChange([...items, { label: "", href: "" }]);
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-border bg-bg-muted/50 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Link text">
              <AdminInput value={item.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="e.g. Products" />
            </AdminField>
            <AdminField label="Page" hint="Search by page name or path, or type a custom URL.">
              <PageLinkPicker value={item.href} onChange={(href) => update(i, { href })} />
            </AdminField>
          </div>
          {showDescription ? (
            <AdminField label="Short description (optional)" className="mt-3">
              <AdminTextarea
                rows={2}
                value={item.description ?? ""}
                onChange={(e) => update(i, { description: e.target.value })}
                placeholder="Shown in dropdown menus"
              />
            </AdminField>
          ) : null}
          <button
            type="button"
            onClick={() => remove(i)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-danger hover:underline"
          >
            <Trash2 className="size-3.5" /> Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-2 text-sm font-medium text-brand-blue hover:bg-bg-muted"
      >
        <Plus className="size-4" /> {addLabel}
      </button>
    </div>
  );
}

export function FooterColumnsEditor({
  columns,
  onChange,
}: {
  columns: { heading: string; links: NavLink[] }[];
  onChange: (columns: { heading: string; links: NavLink[] }[]) => void;
}) {
  function updateHeading(i: number, heading: string) {
    onChange(columns.map((col, idx) => (idx === i ? { ...col, heading } : col)));
  }

  function updateLinks(i: number, links: NavLink[]) {
    onChange(columns.map((col, idx) => (idx === i ? { ...col, links } : col)));
  }

  return (
    <div className="space-y-6">
      {columns.map((col, i) => (
        <div key={i} className="rounded-lg border border-border p-4">
          <AdminField label={`Column ${i + 1} heading`}>
            <AdminInput value={col.heading} onChange={(e) => updateHeading(i, e.target.value)} />
          </AdminField>
          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Links in this column</p>
            <LinkListEditor items={col.links} onChange={(links) => updateLinks(i, links)} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function StringListEditor({
  items,
  onChange,
  label,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholder?: string;
}) {
  const text = items.join("\n");

  return (
    <AdminField label={label} hint="One item per line.">
      <AdminTextarea
        rows={5}
        value={text}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
      />
    </AdminField>
  );
}

export function KeyValueListEditor({
  items,
  onChange,
  label,
}: {
  items: { label: string; value: string }[];
  onChange: (items: { label: string; value: string }[]) => void;
  label: string;
}) {
  function update(i: number, patch: Partial<{ label: string; value: string }>) {
    onChange(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function add() {
    onChange([...items, { label: "", value: "" }]);
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-text">{label}</p>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <AdminInput value={item.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Spec name" />
            <AdminInput value={item.value} onChange={(e) => update(i, { value: e.target.value })} placeholder="Value" />
            <button type="button" onClick={() => remove(i)} className="text-danger hover:underline text-xs self-center">
              Remove
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-2 text-sm font-medium text-brand-blue hover:underline">
        + Add row
      </button>
    </div>
  );
}

export function SpecListEditor({
  items,
  onChange,
  label,
  hint,
}: {
  items: { label: string; value: string; visible?: boolean; highlight?: boolean }[];
  onChange: (items: { label: string; value: string; visible?: boolean; highlight?: boolean }[]) => void;
  label: string;
  hint?: string;
}) {
  function update(i: number, patch: Partial<(typeof items)[number]>) {
    onChange(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function add() {
    onChange([...items, { label: "", value: "", visible: true, highlight: false }]);
  }

  return (
    <div>
      <p className="mb-1 text-sm font-medium text-text">{label}</p>
      {hint ? <p className="mb-3 text-xs text-text-muted">{hint}</p> : null}
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-bg-muted/40 p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <AdminInput value={item.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Spec name" />
              <AdminInput value={item.value} onChange={(e) => update(i, { value: e.target.value })} placeholder="Value" />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={item.visible !== false}
                  onChange={(e) => update(i, { visible: e.target.checked })}
                />
                Show on site
              </label>
              <label className="flex items-center gap-2 text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={Boolean(item.highlight)}
                  onChange={(e) => update(i, { highlight: e.target.checked })}
                />
                Highlight (star spec)
              </label>
              <button type="button" onClick={() => remove(i)} className="text-xs text-danger hover:underline">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-3 text-sm font-medium text-brand-blue hover:underline">
        + Add spec
      </button>
    </div>
  );
}
