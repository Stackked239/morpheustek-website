"use client";

import { BlogBody } from "@/components/blog/BlogBody";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { BlogPost } from "@/lib/cms/blog";
import { parseBlogMeta } from "@/lib/cms/blog-template";

export function BlogLivePreview({ post, body }: { post: Pick<BlogPost, "title" | "excerpt">; body: string }) {
  const meta = parseBlogMeta(body);

  return (
    <div className="dark bg-bg text-text">
      <header className="relative isolate overflow-hidden border-b border-border">
        <div className="pointcloud-texture pointer-events-none absolute inset-0 opacity-[0.18]" aria-hidden />
        <Container className="relative py-10 md:py-12">
          <Eyebrow>Eyes at the Edge</Eyebrow>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            {meta.category ? <span>{meta.category}</span> : null}
            {meta.readTime ? <span>{meta.readTime} read</span> : null}
            {meta.series ? <span className="text-brand-blue">{meta.series}</span> : null}
            <span className="text-accent">Draft preview</span>
          </div>
          <h1 className="mt-5 font-display text-[clamp(1.5rem,4vw,2.5rem)] font-extrabold uppercase leading-tight text-text-strong">
            {post.title || "Article title"}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 max-w-xl border-l-2 border-l-accent pl-4 text-base leading-relaxed text-text-muted">{post.excerpt}</p>
          ) : null}
        </Container>
      </header>
      <Container className="max-w-[42rem] py-8 md:py-10">
        <BlogBody body={body} />
      </Container>
    </div>
  );
}
