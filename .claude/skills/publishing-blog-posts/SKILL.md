---
name: publishing-blog-posts
description: Use when asked to write, add, publish, edit, or remove a blog post or "Eyes at the Edge" article on the MorpheusTEK website — including "put this post on the site", "add my article", or "the blog post I wrote".
---

# Publishing Blog Posts

## Overview

Blog content lives in the production Supabase database, and the ONLY correct way to write it is the live site's admin API. A blog post exists when the API accepts it — never when a file is committed. The repo is code, not the CMS.

**A finished blog-post task is:** a draft created via the API → a preview link the author approves → a publish call → the live URL verified. Nothing is committed to git.

If you cannot complete the API flow (no network, no password), STOP and report that. Do not fall back to committing the article as a seed script, data file, SQL, or migration — a past session did exactly that and the post silently never appeared.

## Workflow

1. **Draft the article body** in the house format (below). Slug: lowercase words with hyphens, permanent once published.
2. **Ask the author for the admin password** (the same one used at `/admin`). Use it once to log in. Never store it, echo it, or write it to any file.
3. **Create as draft, share the preview link, wait for approval, then publish.**

```bash
BASE=https://www.morpheustek.com
JAR=$(mktemp)

# Login (sets a session cookie)
curl -s -c "$JAR" -X POST "$BASE/api/admin/login" \
  -H "Content-Type: application/json" -d '{"password":"<from author>"}'
# → {"ok":true}   (401 = wrong password)

# Create draft — write post.json first: {"slug":"...","title":"...","excerpt":"...","body":"...","status":"draft"}
curl -s -b "$JAR" -X POST "$BASE/api/admin/blog" \
  -H "Content-Type: application/json" -d @post.json

# Author reviews at:  $BASE/admin/blog/<slug>/preview

# Publish after approval — PUT overwrites ALL fields, so resend full title/excerpt/body
curl -s -b "$JAR" -X PUT "$BASE/api/admin/blog/<slug>" \
  -H "Content-Type: application/json" \
  -d @post-published.json   # same fields with "status":"published"

# Verify live (the API revalidates caches itself — no redeploy needed)
curl -s -o /dev/null -w "%{http_code}" "$BASE/blog/<slug>"   # expect 200
```

Editing an existing post: `GET $BASE/api/admin/blog/<slug>` (with cookie) → modify → `PUT` back. Removing: `DELETE` same URL.

## Article body format

The `body` field uses marker blocks plus markdown. Reference implementation: `web/src/lib/cms/blog-template.ts` (`serializeFormToBody`); full example: `web/src/lib/cms/sample-blog-post.ts`.

```
::meta::
category:Evaluation Method
readTime:9 min
series:Eyes at the Edge · Vol. 03
image:/blog/optional-image.jpg
imageAlt:Optional alt text
::end::

::lede::
One-paragraph opening hook, shown large under the title.
::end::

Plain paragraphs. Also: ## headings, ### subheadings, - bullets, > quotes, --- dividers.

::callout|Callout title::
Highlighted aside.
::end::

::specs::
Label | Value
::end::

::steps::
01|Step title|Step body
::end::

::takeaways::
- Closing bullet points
::end::

::cta::
Primary button label|/contact
Secondary label|/resources
::end::
```

`image:` takes a site-relative path or full URL; new images are uploaded through the `/admin` blog editor UI, not the API.

## Common mistakes

| Mistake | Reality |
|---|---|
| Committing the article as a `.ts` data file + seed script and opening a PR | The live site reads the database. The post never appears; the branch just sits there. |
| Writing SQL or a migration for content | Content is data, not schema. Use the admin API. |
| Writing to Supabase directly | Skips validation AND cache revalidation — the site keeps serving stale pages. |
| Publishing without the draft → preview → approval step | The author must see the preview link before it goes live. |
| Renaming the slug after publishing | The slug is the public URL and cannot change. |
| Saving the admin password anywhere | Ask each session, use once, never write it down. |
