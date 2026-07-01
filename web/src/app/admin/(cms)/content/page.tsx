import Link from "next/link";
import { contentBlockRegistry } from "@/lib/cms/content-registry";

export default async function AdminContentIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group } = await searchParams;
  const blocks = group
    ? contentBlockRegistry.filter((b) => b.group === group)
    : contentBlockRegistry;

  const groups = [...new Set(contentBlockRegistry.map((b) => b.group))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-h3 font-bold uppercase text-text-strong">Pages & homepage</h2>
        <p className="mt-2 text-sm text-text-muted">
          Edit homepage sections, page copy, glossary, shows, forms, and global metadata.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterLink href="/admin/content" label="All" active={!group} />
        {groups.map((g) => (
          <FilterLink key={g} href={`/admin/content?group=${encodeURIComponent(g)}`} label={g} active={group === g} />
        ))}
      </div>

      <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
        {blocks.map((b) => (
          <li key={b.key}>
            <Link
              href={`/admin/content/${encodeURIComponent(b.key)}`}
              className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-bg-muted"
            >
              <span>
                <span className="block font-display text-sm font-bold uppercase text-text-strong">{b.label}</span>
                <span className="font-mono text-[10px] text-text-subtle">{b.key}</span>
              </span>
              <span className="font-mono text-xs text-brand-blue">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] ${
        active ? "border-brand-blue bg-brand-blue/10 text-brand-blue" : "border-border text-text-muted"
      }`}
    >
      {label}
    </Link>
  );
}
