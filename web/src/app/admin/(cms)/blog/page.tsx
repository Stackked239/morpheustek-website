import Link from "next/link";
import { getAllBlogPostsAdmin } from "@/lib/cms/blog";

export default async function AdminBlogListPage() {
  const posts = await getAllBlogPostsAdmin().catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-h3 font-bold uppercase text-text-strong">Blog</h2>
          <p className="mt-2 text-sm text-text-muted">Draft posts stay hidden until you publish them.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-md bg-brand-blue px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-bg"
        >
          New post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-text-muted">No posts yet. Create your first article.</p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {posts.map((p) => (
            <li key={p.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-bg-muted">
              <Link href={`/admin/blog/${encodeURIComponent(p.slug)}`} className="min-w-0 flex-1">
                <p className="font-semibold text-text-strong">{p.title}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-subtle">{p.slug}</p>
              </Link>
              <div className="flex items-center gap-3">
                {p.status === "draft" ? (
                  <Link
                    href={`/admin/blog/${encodeURIComponent(p.slug)}/preview`}
                    className="font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-blue hover:underline"
                  >
                    Preview
                  </Link>
                ) : null}
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] ${
                    p.status === "published" ? "bg-success-soft text-success" : "bg-bg-muted text-text-muted"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
