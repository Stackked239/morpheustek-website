/**
 * Inserts the canonical sample blog post as a draft.
 * Run: pnpm cms:seed-blog
 */
import { sampleBlogPost } from "../src/lib/cms/sample-blog-post";
import { createServiceClient } from "../src/lib/supabase/server";

async function main() {
  const sb = createServiceClient();
  const row = {
    ...sampleBlogPost,
    updated_at: new Date().toISOString(),
  };

  const { error } = await sb.from("blog_posts").upsert(row, { onConflict: "slug" });
  if (error) throw error;

  console.log("Sample blog draft seeded:", sampleBlogPost.slug);
  console.log("Preview at: /admin/blog/" + sampleBlogPost.slug + "/preview");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
