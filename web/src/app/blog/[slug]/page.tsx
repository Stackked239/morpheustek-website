import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/BlogArticle";
import { getBlogPost } from "@/lib/cms/blog";
import { isRenderableImageUrl, parseBlogMeta } from "@/lib/cms/blog-template";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article not found" };
  const meta = parseBlogMeta(post.body);
  const image = meta.image && isRenderableImageUrl(meta.image) ? meta.image : "";
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
    ...(image
      ? {
          openGraph: {
            type: "article" as const,
            siteName: site.name,
            url: `/blog/${slug}`,
            images: [{ url: image, alt: meta.imageAlt || post.title }],
          },
          twitter: {
            card: "summary_large_image" as const,
            images: [{ url: image, alt: meta.imageAlt || post.title }],
          },
        }
      : {}),
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return <BlogArticle post={post} />;
}
