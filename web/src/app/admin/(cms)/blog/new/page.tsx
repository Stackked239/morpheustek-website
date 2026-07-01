import { BlogPostEditor } from "@/components/admin/editors/BlogPostEditor";

export default function AdminBlogNewPage() {
  const draft = {
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    status: "draft" as const,
    published_at: null,
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-h3 font-bold uppercase text-text-strong">New blog post</h2>
        <p className="mt-1 text-sm text-text-muted">Fill in each section below — no code or formatting tags needed.</p>
      </div>
      <BlogPostEditor initial={draft} isNew />
    </div>
  );
}
