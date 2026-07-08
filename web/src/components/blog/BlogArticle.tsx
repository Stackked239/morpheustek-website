import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BlogBody } from "@/components/blog/BlogBody";
import { parseBlogMeta, stripBlogMeta } from "@/lib/cms/blog-template";
import type { BlogPost } from "@/lib/cms/blog";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function BlogArticle({
  post,
  draft = false,
  previewHref,
}: {
  post: BlogPost;
  draft?: boolean;
  previewHref?: string;
}) {
  const meta = parseBlogMeta(post.body);
  const body = stripBlogMeta(post.body);
  const date = formatDate(post.published_at);

  return (
    <>
      {draft ? (
        <div className="border-b border-accent/40 bg-accent/10">
          <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-text">
              Draft preview — not visible on the public blog
            </p>
            {previewHref ? (
              <Link href={previewHref} className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-brand-blue hover:underline">
                ← Back to editor
              </Link>
            ) : null}
          </Container>
        </div>
      ) : null}

      <header className="dark relative isolate overflow-hidden border-b border-border bg-bg">
        <div className="pointcloud-texture pointer-events-none absolute inset-0 opacity-[0.22]" aria-hidden />
        <div className="draft-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />
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
      </header>

      <div className="border-b border-border bg-bg">
        <Container className="max-w-[42rem] py-12 md:py-16 lg:py-20">
          <BlogBody body={body} />
        </Container>
      </div>
    </>
  );
}
