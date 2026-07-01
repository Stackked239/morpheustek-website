import Link from "next/link";
import { isCmsEnabled } from "@/lib/supabase/server";
import { contentBlockRegistry } from "@/lib/cms/content-registry";

export default function AdminDashboard() {
  const cmsOn = isCmsEnabled();
  const groups = [...new Set(contentBlockRegistry.map((b) => b.group))];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-h3 font-bold uppercase text-text-strong">Dashboard</h2>
        <p className="mt-2 max-w-2xl text-sm text-text-muted">
          Edit products, navigation, homepage sections, and page copy. Changes publish immediately after save.
        </p>
        {!cmsOn ? (
          <p className="mt-4 rounded-lg border border-warning/40 bg-warning-soft px-4 py-3 text-sm text-text">
            Supabase is not configured — the live site still reads from <code className="font-mono">catalog.ts</code>.
            Add env vars from <code className="font-mono">.env.example</code>, run the SQL migration, then{" "}
            <code className="font-mono">pnpm cms:seed</code>.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashCard href="/admin/site" title="Site & navigation" body="Company facts, phone, nav, footer, CTAs" />
        <DashCard href="/admin/products" title="Products" body="19 SKUs — specs, pricing, photos" />
        <DashCard href="/admin/merch" title="Merchandising" body="Booth mode + product of the month" />
        <DashCard href="/admin/blog" title="Blog" body="Draft → publish articles" />
        <DashCard href="/admin/catalog/categories" title="Categories" body="8 SEO pillar pages" />
        <DashCard href="/admin/catalog/applications" title="Applications" body="8 robot-outcome verticals" />
        <DashCard href="/admin/catalog/resources" title="Resources" body="Lead magnets & gated downloads" />
        <DashCard href="/admin/content" title="Pages & homepage" body={`${contentBlockRegistry.length} content blocks`} />
      </div>

      <div>
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-text-muted">Content groups</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {groups.map((g) => (
            <li key={g}>
              <Link
                href={`/admin/content?group=${encodeURIComponent(g)}`}
                className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-brand-blue"
              >
                {g}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function DashCard({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-border bg-surface p-5 transition hover:border-border-strong hover:shadow-md">
      <h3 className="font-display text-lg font-bold uppercase text-text-strong">{title}</h3>
      <p className="mt-2 text-sm text-text-muted">{body}</p>
    </Link>
  );
}
