# Blog Featured Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Each blog post can carry one featured image (stored as `image:`/`imageAlt:` keys in the post body's `::meta::` block) shown in the article header, on `/blog` index rows, and as the social-share image — with the current text-only layout as fallback.

**Architecture:** No DB migration and no admin-API change: the image URL rides inside the post body meta, parsed by `parseBlogMeta` and written by `serializeFormToBody`. Files upload to a new public Supabase Storage bucket `blog-images` through a new admin route cloned from the product-image route. The admin blog editor gains a featured-image section. The five live posts get generated sensor-view images staged via the existing publish script.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, Tailwind v4 semantic tokens, `next/image`, Supabase Storage (`@supabase/supabase-js`).

**Testing note:** This repo has **no test runner** (per `CLAUDE.md`: `pnpm build` is the only typecheck; never claim "tests pass"). Verification steps therefore use `pnpm build`, a `node` round-trip check of the parser, and rendered-HTML checks against the local dev server. All commands run from `web/` unless a full path is shown. Branch: `feat/blog-featured-images` (already created; spec committed).

**Spec:** `docs/superpowers/specs/2026-07-08-blog-featured-images-design.md`

---

### Task 1: Meta parse/serialize support for `image` / `imageAlt`

**Files:**
- Modify: `web/src/lib/cms/blog-template.ts` (the `BlogMeta` type ~line 6, `defaultNewArticleForm` ~line 86, `parseBlogMeta` ~line 247, `serializeFormToBody` ~line 375)

- [ ] **Step 1: Extend the `BlogMeta` type**

Replace:

```ts
export type BlogMeta = {
  category: string;
  readTime: string;
  series: string;
};
```

with:

```ts
export type BlogMeta = {
  category: string;
  readTime: string;
  series: string;
  /** Featured image public URL (Supabase storage). Empty string = no image. */
  image: string;
  imageAlt: string;
};
```

- [ ] **Step 2: Update `defaultNewArticleForm`**

In `defaultNewArticleForm()`, replace the `meta` object with:

```ts
    meta: {
      category: "",
      readTime: "8 min",
      series: "Eyes at the Edge",
      image: "",
      imageAlt: "",
    },
```

- [ ] **Step 3: Parse the new keys in `parseBlogMeta`**

Replace the function body's init line and key checks so it reads:

```ts
export function parseBlogMeta(body: string): BlogMeta {
  const match = body.match(/::meta::\n([\s\S]*?)\n::end::/);
  const meta = { category: "", readTime: "", series: "", image: "", imageAlt: "" };
  if (!match) return meta;
  for (const line of match[1].split("\n")) {
    const [key, ...rest] = line.split(":");
    if (key === "category") meta.category = rest.join(":").trim();
    if (key === "readTime") meta.readTime = rest.join(":").trim();
    if (key === "series") meta.series = rest.join(":").trim();
    if (key === "image") meta.image = rest.join(":").trim();
    if (key === "imageAlt") meta.imageAlt = rest.join(":").trim();
  }
  return meta;
}
```

(`split(":")` + `rest.join(":")` keeps `https://…` URLs intact — same mechanism the existing keys use.)

- [ ] **Step 4: Serialize the new keys in `serializeFormToBody`**

In `serializeFormToBody`, replace the initial `parts` array with:

```ts
  const parts: string[] = [
    "::meta::",
    `category:${form.meta.category.trim()}`,
    `readTime:${form.meta.readTime.trim()}`,
    `series:${form.meta.series.trim()}`,
  ];
  if (form.meta.image.trim()) parts.push(`image:${form.meta.image.trim()}`);
  if (form.meta.imageAlt.trim()) parts.push(`imageAlt:${form.meta.imageAlt.trim()}`);
  parts.push("::end::", "");
```

(Image lines are written only when set, so image-less bodies stay byte-identical to today's format.)

- [ ] **Step 5: Round-trip check**

Run from `web/`:

```bash
node --input-type=module -e '
import { parseBlogMeta, parseBodyToForm, serializeFormToBody } from "./src/lib/cms/blog-template.ts";
' 2>/dev/null || npx tsx -e '
import { parseBlogMeta, parseBodyToForm, serializeFormToBody } from "./src/lib/cms/blog-template";
const body = "::meta::\ncategory:Test\nreadTime:5 min\nseries:S\nimage:https://x.supabase.co/storage/v1/object/public/blog-images/a.webp\nimageAlt:Alt text\n::end::\n\nHello.\n";
const meta = parseBlogMeta(body);
if (!meta.image.startsWith("https://")) throw new Error("image lost: " + meta.image);
const round = serializeFormToBody(parseBodyToForm(body));
if (!round.includes("image:https://x.supabase.co")) throw new Error("serialize lost image");
if (!round.includes("imageAlt:Alt text")) throw new Error("serialize lost alt");
console.log("round-trip OK");
'
```

Expected: `round-trip OK` (if `tsx` is unavailable, defer this check to the Task 7 build + dev-server check — the build typechecks the same code).

- [ ] **Step 6: Commit**

```bash
git add src/lib/cms/blog-template.ts
git commit -m "feat(blog): parse and serialize featured-image meta keys"
```

---

### Task 2: `blog-images` bucket + admin upload route

**Files:**
- Create: `web/src/app/api/admin/upload/blog-image/route.ts`

- [ ] **Step 1: Create the storage bucket (one-off, idempotent)**

Run from `web/`:

```bash
node --env-file=.env.local --input-type=module -e '
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { error } = await sb.storage.createBucket("blog-images", { public: true, fileSizeLimit: "10MB" });
if (error && !/already exists/i.test(error.message)) throw error;
console.log(error ? "bucket already exists" : "bucket created");
'
```

Expected: `bucket created` (or `bucket already exists` on re-run).

- [ ] **Step 2: Write the upload route**

Create `web/src/app/api/admin/upload/blog-image/route.ts`:

```ts
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "blog-images";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const file = form.get("file");

  if (!slug) return NextResponse.json({ error: "Missing post slug" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  if (!ALLOWED.has(file.type)) return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
  const storagePath = `${slug}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const sb = createServiceClient();
  const { error: uploadError } = await sb.storage.from(BUCKET).upload(storagePath, bytes, {
    contentType: file.type,
    upsert: true,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: publicUrl } = sb.storage.from(BUCKET).getPublicUrl(storagePath);
  return NextResponse.json({ ok: true, path: publicUrl.publicUrl });
}
```

(Differences from the `product-image` route it's cloned from: no `product_images` DB upsert and no `revalidateCms` call — the URL lives in the post body, and saving the post already revalidates.)

- [ ] **Step 3: Commit**

```bash
git add src/app/api/admin/upload/blog-image/route.ts
git commit -m "feat(blog): admin upload route for featured images"
```

---

### Task 3: Featured image in the article header

**Files:**
- Modify: `web/src/components/blog/BlogArticle.tsx` (imports ~line 1, header `Container` ~lines 46–69)

- [ ] **Step 1: Add the `next/image` import**

At the top of `BlogArticle.tsx`, after `import Link from "next/link";` add:

```tsx
import Image from "next/image";
```

- [ ] **Step 2: Restructure the header `Container` into a conditional two-column grid**

Replace the header's `<Container className="relative py-14 md:py-20 lg:py-24">…</Container>` block with:

```tsx
        <Container className="relative py-14 md:py-20 lg:py-24">
          <div className={meta.image ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center" : undefined}>
            <div>
              <Eyebrow>
                <Link href="/blog" className="transition hover:text-brand-blue">
                  Eyes at the Edge
                </Link>
              </Eyebrow>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                {meta.category ? <span>{meta.category}</span> : null}
                {meta.readTime ? <span>{meta.readTime} read</span> : null}
                {meta.series ? <span className="text-brand-blue">{meta.series}</span> : null}
                {date ? <time>{date}</time> : draft ? <span className="text-accent">Draft</span> : null}
              </div>

              <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-extrabold uppercase leading-[1.02] tracking-tight text-text-strong">
                {post.title}
              </h1>

              {post.excerpt ? (
                <p className="mt-6 max-w-2xl border-l-2 border-l-accent pl-5 text-lg leading-relaxed text-text-muted md:text-xl">
                  {post.excerpt}
                </p>
              ) : null}
            </div>

            {meta.image ? (
              <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-lg border border-border lg:mt-0">
                <Image
                  src={meta.image}
                  alt={meta.imageAlt || post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 26rem, 100vw"
                />
              </div>
            ) : null}
          </div>
        </Container>
```

(The inner text markup is unchanged from today — it only gains the wrapping `div`s. With no image, the wrapper `div` has no class and layout is identical to current rendering. Point-cloud texture, draft banner, and everything outside the `Container` stay untouched.)

- [ ] **Step 3: Commit**

```bash
git add src/components/blog/BlogArticle.tsx
git commit -m "feat(blog): render featured image in article header"
```

---

### Task 4: Thumbnails on the blog index

**Files:**
- Modify: `web/src/app/blog/page.tsx` (imports ~lines 1–6, list rows ~lines 44–59)

- [ ] **Step 1: Add imports**

Add to the imports at the top:

```tsx
import Image from "next/image";
import { parseBlogMeta } from "@/lib/cms/blog-template";
```

- [ ] **Step 2: Render a right-aligned thumbnail per row when the post has an image**

Replace the `posts.map(...)` block with:

```tsx
              {posts.map((post) => {
                const meta = parseBlogMeta(post.body);
                return (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="group flex items-start gap-8 py-8">
                      <div className="min-w-0 flex-1">
                        <time className="font-mono text-[11px] uppercase tracking-[0.14em] text-text-subtle">
                          {formatDate(post.published_at)}
                        </time>
                        <h2 className="mt-2 font-display text-h3 font-bold uppercase text-text-strong transition group-hover:text-brand-blue">
                          {post.title}
                        </h2>
                        {post.excerpt ? <p className="mt-3 max-w-2xl text-text-muted">{post.excerpt}</p> : null}
                        <span className="mt-4 inline-block font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-brand-blue">
                          Read article →
                        </span>
                      </div>
                      {meta.image ? (
                        <div className="relative hidden aspect-[16/10] w-56 shrink-0 overflow-hidden rounded-lg border border-border sm:block">
                          <Image
                            src={meta.image}
                            alt={meta.imageAlt || post.title}
                            fill
                            className="object-cover transition duration-300 group-hover:scale-[1.03]"
                            sizes="14rem"
                          />
                        </div>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
```

(Per spec: thumbnail is hidden below `sm`; rows without an image keep the current full-width text layout at every size — `flex` with a lone `flex-1` child renders identically.)

- [ ] **Step 3: Commit**

```bash
git add src/app/blog/page.tsx
git commit -m "feat(blog): featured-image thumbnails on the blog index"
```

---

### Task 5: Open Graph / Twitter image in article metadata

**Files:**
- Modify: `web/src/app/blog/[slug]/page.tsx` (`generateMetadata`, lines 8–17)

- [ ] **Step 1: Wire the featured image into `generateMetadata`**

Add the import:

```tsx
import { parseBlogMeta } from "@/lib/cms/blog-template";
```

Replace `generateMetadata` with:

```tsx
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return { title: "Article not found" };
  const meta = parseBlogMeta(post.body);
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${slug}` },
    ...(meta.image
      ? {
          openGraph: { images: [{ url: meta.image, alt: meta.imageAlt || post.title }] },
          twitter: { card: "summary_large_image" as const, images: [meta.image] },
        }
      : {}),
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/blog/[slug]/page.tsx"
git commit -m "feat(blog): featured image as OG/Twitter card image"
```

---

### Task 6: Featured-image field in the admin editor

**Files:**
- Create: `web/src/components/admin/editors/BlogFeaturedImageField.tsx`
- Modify: `web/src/components/admin/editors/BlogArticleFormEditor.tsx` (props ~line 234, add an `AdminSection` after "Article labels" ~line 295)
- Modify: `web/src/components/admin/editors/BlogPostEditor.tsx` (line 84, pass `slug`)

- [ ] **Step 1: Create the upload field component**

Create `web/src/components/admin/editors/BlogFeaturedImageField.tsx`:

```tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AdminField, AdminInput } from "@/components/admin/forms/AdminField";

export function BlogFeaturedImageField({
  slug,
  image,
  imageAlt,
  onChange,
}: {
  slug: string;
  image: string;
  imageAlt: string;
  onChange: (v: { image: string; imageAlt: string }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("slug", slug);
      form.append("file", file);
      const res = await fetch("/api/admin/upload/blog-image", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      // Cache-bust: the bucket path is per-slug, so replacing an image keeps the same URL.
      onChange({ image: `${data.path}?v=${Date.now()}`, imageAlt });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="relative aspect-[16/10] w-full max-w-xs shrink-0 overflow-hidden rounded-lg border border-border bg-bg-muted">
        {image ? (
          <Image src={image} alt={imageAlt || "Featured image preview"} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-muted">No image yet</div>
        )}
      </div>
      <div className="flex-1 space-y-3">
        <AdminField label="Choose file" hint={slug ? "JPEG, PNG, WebP, or GIF — max 10 MB. Uploads immediately; save the post to keep it." : "Set the URL slug first, then upload."}>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            disabled={!slug || uploading}
            onChange={onPick}
            className="block w-full text-sm text-text file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:font-mono file:text-xs file:font-bold file:uppercase file:text-accent-text disabled:opacity-50"
          />
        </AdminField>
        <AdminField label="Image description (alt text)" hint="Describes the image for screen readers and SEO.">
          <AdminInput
            value={imageAlt}
            onChange={(e) => onChange({ image, imageAlt: e.target.value })}
            placeholder="LiDAR point cloud sweeping a warehouse aisle"
          />
        </AdminField>
        {uploading ? <p className="text-sm text-text-muted">Uploading…</p> : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        {image ? (
          <button type="button" onClick={() => onChange({ image: "", imageAlt: "" })} className="text-xs font-medium text-danger hover:underline">
            Remove image
          </button>
        ) : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add the section to `BlogArticleFormEditor`**

Add the import:

```tsx
import { BlogFeaturedImageField } from "@/components/admin/editors/BlogFeaturedImageField";
```

Change the component signature to accept the slug:

```tsx
export function BlogArticleFormEditor({
  form,
  onChange,
  slug,
}: {
  form: BlogArticleForm;
  onChange: (form: BlogArticleForm) => void;
  slug: string;
}) {
```

Insert a new `AdminSection` immediately after the closing tag of the "Article labels" `AdminSection` (before "Opening hook"):

```tsx
      <AdminSection
        title="Featured image"
        description="Shown large in the article header, as the thumbnail on the blog index, and as the social-share image. Optional — posts without one render text-only."
      >
        <BlogFeaturedImageField
          slug={slug}
          image={form.meta.image}
          imageAlt={form.meta.imageAlt}
          onChange={({ image, imageAlt }) => patch("meta", { ...form.meta, image, imageAlt })}
        />
      </AdminSection>
```

- [ ] **Step 3: Pass the slug from `BlogPostEditor`**

In `BlogPostEditor.tsx` line 84, change:

```tsx
      <BlogArticleFormEditor form={article} onChange={setArticle} />
```

to:

```tsx
      <BlogArticleFormEditor form={article} onChange={setArticle} slug={post.slug} />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/editors/BlogFeaturedImageField.tsx src/components/admin/editors/BlogArticleFormEditor.tsx src/components/admin/editors/BlogPostEditor.tsx
git commit -m "feat(blog): featured-image upload field in the admin editor"
```

---

### Task 7: Build + local render verification

**Files:** none (verification only)

- [ ] **Step 1: Production build (the repo's only typecheck)**

Run from `web/`:

```bash
pnpm build
```

Expected: build succeeds with no type errors. Fix anything it reports before continuing.

- [ ] **Step 2: Verify fallback rendering (no images staged yet)**

```bash
PORT=3100 pnpm dev &
sleep 8
curl -s http://localhost:3100/blog | grep -c "Read article"
curl -s http://localhost:3100/blog/lidar-dark-low-reflective-surfaces | grep -c "blog-takeaways"
```

Expected: both greps ≥ 1; pages render exactly as before (no image markup since no post has `image:` meta yet — confirm with `curl -s http://localhost:3100/blog | grep -c 'aspect-\[16/10\]'` → `0`). Leave the dev server running for Task 8.

- [ ] **Step 3: Commit is not needed** (no file changes) — proceed to Task 8.

---

### Task 8: Generate, upload, and stage the five featured images

**Files:**
- Modify: scratchpad `publish-posts.mjs` (add `image:`/`imageAlt:` meta lines — content-only, not part of the repo)

- [ ] **Step 1: Generate five 16:9 images (≥1600 px) in the sensor-view aesthetic**

Generate with the HiggsField MCP `generate_image` tool (or equivalent), one per motif, shared style language: *dark navy (#0B1D33-ish) industrial scene rendered as a LiDAR point cloud, depth-graded color ramp (cyan-near → deep-blue-far), fine scan-line structure, subtle speckle/dropout imperfection, no text, no logos, wide 16:9*.

| Post slug | Motif prompt focus | Alt text |
| --- | --- | --- |
| `how-depth-sensing-cameras-give-robots-3d-vision` | Depth-camera view frustum projecting a dot pattern onto warehouse boxes | Depth camera projecting a 3D point grid onto warehouse objects |
| `depth-cameras-lidar-3d-mapping-robot-navigation` | Top-down SLAM floorplan with concentric scan rings and a robot path | Top-down LiDAR SLAM map of a facility with scan rings and robot path |
| `depth-cameras-lidar-ai-smarter-robots` | Camera + LiDAR returns fusing into labeled bounding boxes | Camera and LiDAR data fusing into recognized objects in a point cloud |
| `lidar-dark-low-reflective-surfaces` | Dense point cloud with a conspicuous black void where a dark pallet sits | LiDAR point cloud with a void where a dark low-reflectivity pallet sits |
| `3d-vision-guided-depalletizing-engineering` | Overhead scan of a stacked pallet, top-layer boxes highlighted as pick targets | Overhead 3D scan of a pallet with top-layer pick targets highlighted |

Review each image before use; regenerate any that look mushy or off-brand. Convert/export to webp ≥1600 px wide, saved to the scratchpad as `<slug>.webp`.

- [ ] **Step 2: Upload to the bucket with the service key**

Run from `web/` (images in `$SCRATCH/blog-imgs/`):

```bash
node --env-file=.env.local --input-type=module -e '
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const dir = process.env.IMG_DIR;
const slugs = [
  "how-depth-sensing-cameras-give-robots-3d-vision",
  "depth-cameras-lidar-3d-mapping-robot-navigation",
  "depth-cameras-lidar-ai-smarter-robots",
  "lidar-dark-low-reflective-surfaces",
  "3d-vision-guided-depalletizing-engineering",
];
for (const slug of slugs) {
  const bytes = await readFile(`${dir}/${slug}.webp`);
  const { error } = await sb.storage.from("blog-images").upload(`${slug}.webp`, bytes, { contentType: "image/webp", upsert: true });
  if (error) throw new Error(`${slug}: ${error.message}`);
  console.log("uploaded", sb.storage.from("blog-images").getPublicUrl(`${slug}.webp`).data.publicUrl);
}
'
```

(Set `IMG_DIR` to the scratchpad image directory.) Expected: five `uploaded https://…/blog-images/<slug>.webp` lines.

- [ ] **Step 3: Add `image:`/`imageAlt:` meta to the five posts and re-publish**

In the scratchpad `publish-posts.mjs`, add two lines inside each post's `::meta::` block (after `series:`), using the public URLs from Step 2 and the alt texts from the Step 1 table, e.g.:

```
image:https://<project>.supabase.co/storage/v1/object/public/blog-images/lidar-dark-low-reflective-surfaces.webp
imageAlt:LiDAR point cloud with a void where a dark low-reflectivity pallet sits
```

Then re-run:

```bash
ADMIN_PASSWORD=<from web/.env.local> node $SCRATCH/publish-posts.mjs --status=published
```

Expected: five `OK [200]` lines. (Safe pre-deploy: the live parser ignores unknown meta keys, so production rendering is unchanged until the PR ships. The re-run re-upserts identical bodies + the new meta lines; `published_at` values are passed explicitly so dates don't shift.)

- [ ] **Step 4: Verify locally against the real CMS data**

With the Task 7 dev server still running:

```bash
curl -s http://localhost:3100/blog | grep -c "blog-images"
curl -s http://localhost:3100/blog/lidar-dark-low-reflective-surfaces | grep -c "blog-images"
```

Expected: index ≥ 5 (five thumbnails), article ≥ 1 (header image + OG tags). Then view `http://localhost:3100/blog` and one article in a browser (light + dark themes) and confirm the layouts match the spec. Kill the dev server when done.

---

### Task 9: Pull request

**Files:** none

- [ ] **Step 1: Push and open the PR**

```bash
git push -u origin feat/blog-featured-images
gh pr create --title "Blog featured images: header, index thumbnails, OG cards, admin upload" --body "$(cat <<'EOF'
## What

- Featured image per blog post, stored as `image:`/`imageAlt:` keys in the post body's `::meta::` block — no DB migration, no admin-API changes; posts without an image render exactly as before.
- Article header becomes a two-column band (text + framed 16:10 image) on desktop; image stacks below on mobile.
- `/blog` index rows get right-aligned thumbnails (hidden below `sm`).
- Featured image doubles as the OG / Twitter-card image.
- New `blog-images` Supabase bucket + admin upload route (clone of the product-image route) and a "Featured image" section in the admin blog editor (upload, alt text, remove).
- The five live posts already have generated sensor-view images staged in the CMS — they appear as soon as this deploys.

## Verification

- `pnpm build` passes.
- Local dev against production Supabase: index shows five thumbnails, article header renders the image, no-image posts unchanged, light/dark themes checked.

Spec: `docs/superpowers/specs/2026-07-08-blog-featured-images-design.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL printed. John reviews and merges; merge deploys to production and the staged images appear.

---

## Self-review notes

- **Spec coverage:** meta keys (Task 1), bucket + route (Task 2), header (Task 3), index (Task 4), OG (Task 5), editor (Task 6), `remotePatterns` — already present in `next.config.ts` (`*.supabase.co`), verified during planning, no task needed; five generated images (Task 8); build-only verification + PR flow (Tasks 7, 9). ✔
- **Types:** `BlogMeta.image`/`imageAlt` defined in Task 1 and used with those exact names in Tasks 3–6, 8. `BlogArticleFormEditor` gains `slug: string` (Task 6 Steps 2–3 agree). ✔
- **No test runner exists** in this repo; TDD steps are replaced by build + rendered-output checks per `CLAUDE.md`. ✔

## Errata (found in code review during execution)

- Task 6's `BlogFeaturedImageField` `onChange` contract was changed to a partial patch (`{ image?, imageAlt? }`) applied via a functional `setArticle` update, because the plan's original code let an in-flight upload completion clobber concurrent form edits (stale closure). `BlogArticleFormEditor.onChange` is now typed `React.Dispatch<React.SetStateAction<BlogArticleForm>>`.
- The upload size cap is 4 MB end-to-end (client pre-check + route `MAX_BYTES`), not the plan's 10 MB — Vercel's request-body limit (~4.5 MB) rejects larger uploads with a non-JSON 413 before the route runs. The client also parses non-JSON error responses defensively.
