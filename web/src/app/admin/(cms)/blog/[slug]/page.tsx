import { notFound } from "next/navigation";
import { getBlogPostAdmin } from "@/lib/cms/blog";
import { BlogPostEditor } from "@/components/admin/editors/BlogPostEditor";

type Params = { params: Promise<{ slug: string }> };

export default async function AdminBlogEditPage({ params }: Params) {
  const { slug } = await params;
  const post = await getBlogPostAdmin(slug);
  if (!post) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-h3 font-bold uppercase text-text-strong">Edit post</h2>
        <p className="mt-1 font-mono text-xs text-text-subtle">{slug}</p>
      </div>
      <BlogPostEditor initial={post} />
    </div>
  );
}
