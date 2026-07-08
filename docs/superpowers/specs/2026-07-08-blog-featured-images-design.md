# Blog featured images — design

**Date:** 2026-07-08
**Status:** Approved by Austin
**Goal:** The blog (`/blog`, "Eyes at the Edge") renders text-only and looks stale. Add a featured image per post — shown in the article header, on the blog index cards, and as the social-share image — with a graceful fallback to today's text-only layout when a post has no image.

## Scope

- One featured image per post. No inline body-image blocks (explicitly deferred).
- The five live posts get generated images in the site's sensor-view aesthetic (dark navy, point-cloud depth ramps, scan-line geometry; one motif per topic). The client can replace any of them later through the admin editor.

## Storage: meta-block field (no migration)

The featured image is stored in the post body's existing `::meta::` block as two new keys:

```
::meta::
category:Safety LiDAR
readTime:7 min
series:Eyes at the Edge
image:https://<supabase>/storage/v1/object/public/blog-images/<slug>.webp
imageAlt:LiDAR point cloud with a void where a dark object sits
::end::
```

- `web/src/lib/cms/blog-template.ts`: `BlogMeta` gains `image` and `imageAlt` (strings, empty when unset). `parseBlogMeta` reads the new keys; `serializeFormToBody` writes them. **Constraint:** meta values are parsed with `line.split(":")` and rejoined, so URLs containing `:` survive — keep that behavior covered by the parse/serialize round-trip.
- No change to the `blog_posts` table, `BlogPost` type, or the admin blog API. The current parser ignores unknown meta keys, so content can be staged in the CMS before the code deploys.
- Rejected alternatives: a `hero_image` column on `blog_posts` (migration + API churn, no functional gain today; Phase 2 may formalize it) and a separate `blog_images` table (most moving parts, no benefit at this scale).

## Upload plumbing

- New Supabase Storage bucket `blog-images` (public read), created once via service key.
- New route `web/src/app/api/admin/upload/blog-image/route.ts` — a near-copy of the existing `product-image` upload route: `requireAdmin()`, multipart form (`slug`, `file`), allowed types jpeg/png/webp/gif, 10 MB cap, upsert to `blog-images/<slug>.<ext>`, returns the public URL. No DB row (the URL lives in post meta), so it skips the `product_images`-style upsert and the CMS revalidate call (saving the post already revalidates).
- Admin editor (`BlogArticleFormEditor.tsx`): the meta section gains a "Featured image" control — file picker that POSTs to the new route and writes the returned URL into `form.meta.image`, a thumbnail preview when set, an alt-text input bound to `form.meta.imageAlt`, and a clear button. Follow the editor's existing field/label styling.

## Rendering

All rendering falls back to exactly the current layout when `meta.image` is empty.

- **Article header** (`BlogArticle.tsx`): with an image, the dark header band becomes a two-column grid on `lg` — eyebrow/meta/title/excerpt left, featured image right in a bordered frame (16:10, `next/image`, `object-cover`); below `lg` the image stacks under the text. Point-cloud texture and draft banner behavior unchanged.
- **Blog index** (`app/blog/page.tsx`): each list row gets a right-aligned thumbnail (bordered, 16:10, fixed width ~14–16 rem) from the `sm` breakpoint up; below `sm` the thumbnail is hidden and the row keeps today's text-only layout. Rows without images keep the current full-width text layout at every size.
- **Social/SEO** (`app/blog/[slug]/page.tsx` `generateMetadata`): when set, the featured image becomes the `openGraph.images` and `twitter` card image.
- **Alt text:** use `meta.imageAlt`, falling back to the post title.
- **Config:** ensure `next.config` `images.remotePatterns` allows the Supabase storage hostname (verify whether it's already present; add if not).

## Content for the five live posts

Generate five 16:9 images (≥1600 px wide, exported as webp) in the sensor-view aesthetic, one motif each:

| Post slug | Motif |
| --- | --- |
| `how-depth-sensing-cameras-give-robots-3d-vision` | Depth-camera frustum projecting a point-cloud onto warehouse objects |
| `depth-cameras-lidar-3d-mapping-robot-navigation` | Top-down SLAM map / scan rings sweeping a facility floorplan |
| `depth-cameras-lidar-ai-smarter-robots` | Layered fusion stack — camera + LiDAR returns resolving into labeled objects |
| `lidar-dark-low-reflective-surfaces` | Point cloud with a conspicuous void where a dark pallet sits |
| `3d-vision-guided-depalletizing-engineering` | Overhead scan of a pallet with top-layer pick boxes highlighted |

Upload each to `blog-images/<slug>.webp` with the service key, then update each post's `::meta::` via the prod admin API (safe pre-deploy; images appear when the PR ships).

## Verification & delivery

- `pnpm build` (the only typecheck), plus local render check of `/blog` and one article with and without an image, and a round-trip check of the editor form (parse → edit → serialize preserves the image URL).
- Feature branch → PR for John to review. No pushes to `main` (auto-deploys production).

## Error handling

- Upload route returns JSON errors (bad type, too large, missing file/slug); editor surfaces them inline like existing upload flows.
- A broken/missing image URL degrades to the no-image layout only at authoring time (editor preview shows the failure); at render time `next/image` will show alt text — acceptable, matches product-image behavior.
