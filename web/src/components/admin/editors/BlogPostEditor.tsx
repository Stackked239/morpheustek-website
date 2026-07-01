"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminField, AdminInput, AdminSection, AdminSelect, AdminTextarea } from "@/components/admin/forms/AdminField";
import { RichTextField } from "@/components/admin/forms/RichTextField";
import { useAdminSave } from "@/components/admin/forms/SaveBar";
import { AdminSplitLayout } from "@/components/admin/AdminSplitLayout";
import { BlogLivePreview } from "@/components/admin/previews/BlogLivePreview";
import { BlogArticleFormEditor } from "@/components/admin/editors/BlogArticleFormEditor";
import type { BlogPost } from "@/lib/cms/blog";
import { defaultNewArticleForm, parseBodyToForm, serializeFormToBody } from "@/lib/cms/blog-template";

export function BlogPostEditor({ initial, isNew }: { initial: BlogPost; isNew?: boolean }) {
  const router = useRouter();
  const [post, setPost] = useState(initial);
  const [article, setArticle] = useState(() =>
    initial.body.trim() ? parseBodyToForm(initial.body) : defaultNewArticleForm(),
  );

  const body = useMemo(() => serializeFormToBody(article), [article]);

  async function persist(nextPost: BlogPost) {
    const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${encodeURIComponent(nextPost.slug)}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextPost),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "Save failed");
    if (isNew) router.push(`/admin/blog/${encodeURIComponent(nextPost.slug)}`);
  }

  const { save, status, error } = useAdminSave(async () => {
    if (!post.slug.trim()) throw new Error("URL slug is required");
    if (!post.title.trim()) throw new Error("Title is required");
    await persist({ ...post, body });
  });

  const { save: publish, status: pubStatus, error: pubError } = useAdminSave(async () => {
    const published: BlogPost = {
      ...post,
      body,
      status: "published",
      published_at: post.published_at ?? new Date().toISOString(),
    };
    await persist(published);
    setPost(published);
  });

  const editor = (
    <div className="space-y-6">
      <AdminSection title="Post settings" description="Basic page info — title, URL, and status.">
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminField label="URL slug" hint="Lowercase words separated by hyphens. Cannot change after publishing.">
            <AdminInput
              value={post.slug}
              disabled={!isNew}
              onChange={(e) => setPost({ ...post, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })}
              placeholder="choosing-safety-lidar-for-amrs"
            />
          </AdminField>
          <AdminField label="Status">
            <AdminSelect
              value={post.status}
              onChange={(e) => setPost({ ...post, status: e.target.value as BlogPost["status"] })}
            >
              <option value="draft">Draft — hidden from public blog</option>
              <option value="published">Published — live on /blog</option>
              <option value="archived">Archived — hidden</option>
            </AdminSelect>
          </AdminField>
        </div>
        <AdminField label="Article title" hint="Large headline at the top of the article.">
          <AdminInput value={post.title} onChange={(e) => setPost({ ...post, title: e.target.value })} />
        </AdminField>
        <AdminField label="Short summary" hint="Shown under the title and on the blog index page.">
          <RichTextField rows={2} value={post.excerpt ?? ""} onChange={(excerpt) => setPost({ ...post, excerpt })} />
        </AdminField>
      </AdminSection>

      <BlogArticleFormEditor form={article} onChange={setArticle} />
    </div>
  );

  return (
    <div className="space-y-6 pb-28">
      <AdminSplitLayout
        editor={editor}
        preview={<BlogLivePreview post={post} body={body} />}
        previewTitle="Article preview"
      />

      <div className="sticky bottom-0 z-10 -mx-6 flex flex-wrap items-center gap-3 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-md bg-brand-blue px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-bg disabled:opacity-50"
        >
          {status === "saving" ? "Saving…" : "Save draft"}
        </button>
        {post.status !== "published" ? (
          <button
            type="button"
            onClick={publish}
            disabled={pubStatus === "saving"}
            className="rounded-md border border-border bg-accent px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.1em] text-accent-text disabled:opacity-50"
          >
            {pubStatus === "saving" ? "Publishing…" : "Publish"}
          </button>
        ) : (
          <span className="text-sm text-success">Published</span>
        )}
        {!isNew && post.slug ? (
          <Link
            href={`/admin/blog/${encodeURIComponent(post.slug)}/preview`}
            className="text-sm font-semibold text-brand-blue hover:underline"
            target="_blank"
          >
            Full-screen preview →
          </Link>
        ) : null}
        {status === "saved" || pubStatus === "saved" ? <span className="text-sm text-success">Saved.</span> : null}
        {error ? <span className="text-sm text-danger">{error}</span> : null}
        {pubError ? <span className="text-sm text-danger">{pubError}</span> : null}
      </div>
    </div>
  );
}
