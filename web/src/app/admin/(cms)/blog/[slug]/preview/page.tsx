import { notFound } from "next/navigation";
import { getBlogPostAdmin } from "@/lib/cms/blog";
import { BlogArticle } from "@/components/blog/BlogArticle";

type Params = { params: Promise<{ slug: string }> };

export default async function AdminBlogPreviewPage({ params }: Params) {
  const { slug } = await params;
  const post = await getBlogPostAdmin(slug);
  if (!post) notFound();

  return (
    <div className="-mx-6 -mt-8 border-t border-border bg-bg">
      <BlogArticle post={post} draft previewHref={`/admin/blog/${encodeURIComponent(slug)}`} />
    </div>
  );
}
