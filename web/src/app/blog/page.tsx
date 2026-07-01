import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getPublishedBlogPosts } from "@/lib/cms/blog";

export const metadata: Metadata = {
  title: "Eyes at the Edge — Robotics Perception Insights",
  description:
    "Eyes at the Edge — technical insights on LiDAR, 3D cameras, safety sensing, and robot perception, written to help robotics engineers and buyers choose well.",
  alternates: { canonical: "/blog" },
};

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <>
      <section className="border-b border-border bg-bg-muted">
        <Container className="py-14 md:py-16">
          <Eyebrow>Eyes at the Edge</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-h1 font-extrabold uppercase leading-[1.02] tracking-tight text-text-strong">
            Stay at the leading edge of robot perception.
          </h1>
          <p className="mt-5 max-w-2xl text-lead text-text-muted">
            Technical writing for robotics engineers and buyers — LiDAR selection, safety sensing, dToF vs. stereo, and
            the perception problems your floor actually faces.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          {posts.length === 0 ? (
            <p className="text-text-muted">First posts are in the pipeline. Grab a guide from our resources in the meantime.</p>
          ) : (
            <ul className="divide-y divide-border">
              {posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group block py-8">
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
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
