/**
 * Inserts the "Designing a 90-Day LiDAR Acceptance Test" article as a draft.
 * Run: pnpm cms:seed-acceptance-test-post
 */
import { acceptanceTestBlogPost } from "../src/lib/cms/acceptance-test-blog-post";
import { createServiceClient } from "../src/lib/supabase/server";

async function main() {
  const sb = createServiceClient();
  const row = {
    ...acceptanceTestBlogPost,
    updated_at: new Date().toISOString(),
  };

  const { error } = await sb.from("blog_posts").upsert(row, { onConflict: "slug" });
  if (error) throw error;

  console.log("Draft seeded:", acceptanceTestBlogPost.slug);
  console.log("Preview at: /admin/blog/" + acceptanceTestBlogPost.slug + "/preview");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
