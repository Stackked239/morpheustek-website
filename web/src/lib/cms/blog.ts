import { unstable_cache } from "next/cache";
import { createAnonClient, createServiceClient, isCmsEnabled } from "@/lib/supabase/server";
import { cmsRevalidateTag } from "@/lib/cms";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  updated_at: string;
};

const BLOG_TAG = "cms-blog";

async function fetchPublishedPosts(): Promise<BlogPost[]> {
  const sb = createAnonClient();
  const { data, error } = await sb
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

async function fetchPostBySlug(slug: string, publishedOnly: boolean): Promise<BlogPost | null> {
  const sb = createAnonClient();
  let q = sb.from("blog_posts").select("*").eq("slug", slug);
  if (publishedOnly) q = q.eq("status", "published");
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return (data as BlogPost | null) ?? null;
}

export const getPublishedBlogPosts = unstable_cache(
  async () => {
    if (!isCmsEnabled()) return [];
    try {
      return await fetchPublishedPosts();
    } catch {
      return [];
    }
  },
  ["cms-blog-posts"],
  { tags: [cmsRevalidateTag, BLOG_TAG] },
);

export async function getBlogPost(slug: string) {
  if (!isCmsEnabled()) return null;
  const cached = unstable_cache(
    async () => {
      try {
        return await fetchPostBySlug(slug, true);
      } catch {
        return null;
      }
    },
    [`cms-blog-post-${slug}`],
    { tags: [cmsRevalidateTag, BLOG_TAG, `cms-blog-post-${slug}`] },
  );
  return cached();
}

/** Admin: list all posts including drafts. */
export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const sb = createServiceClient();
  const { data, error } = await sb.from("blog_posts").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function getBlogPostAdmin(slug: string): Promise<BlogPost | null> {
  const sb = createServiceClient();
  const { data, error } = await sb.from("blog_posts").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return (data as BlogPost | null) ?? null;
}

export const blogRevalidateTag = BLOG_TAG;
