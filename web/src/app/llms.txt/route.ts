import {
  getApplications,
  getCategories,
  getLeadMagnets,
  getProducts,
  getSiteSettings,
} from "@/lib/cms";
import { getPublishedBlogPosts } from "@/lib/cms/blog";
import { site } from "@/lib/site";

/**
 * /llms.txt — a plain-text map of the site for LLM/AI answer engines (GEO),
 * following the llmstxt.org convention. Every fact here is derived from the
 * real CMS/catalog data and site config — nothing is invented.
 */

function canonicalBase(rawUrl: string | undefined): string {
  const base = (rawUrl || site.url).replace(/\/+$/, "");
  return base.replace(/^https?:\/\/morpheustek\.com/i, "https://www.morpheustek.com");
}

export async function GET() {
  const [settings, categories, products, applications, leadMagnets, posts] = await Promise.all([
    getSiteSettings(),
    getCategories(),
    getProducts(),
    getApplications(),
    getLeadMagnets(),
    getPublishedBlogPosts(),
  ]);

  const base = canonicalBase(settings.url);
  const url = (path: string) => `${base}${path}`;

  const lines: string[] = [];

  lines.push(`# ${settings.name} — ${settings.tagline}`);
  lines.push("");
  lines.push(`> ${settings.oneLiner}`);
  lines.push("");
  lines.push(settings.differentiator);
  lines.push("");
  lines.push(`${settings.distributor}.`);
  lines.push("");

  lines.push("## Why MorpheusTEK");
  for (const pillar of settings.pillars) lines.push(`- ${pillar}`);
  lines.push("");

  lines.push("## Contact");
  lines.push(`- Email: ${settings.email}`);
  lines.push(`- Phone: ${settings.phone}`);
  lines.push(`- Address: ${settings.address}`);
  lines.push(`- Book a meeting: ${url("/book-a-meeting")}`);
  lines.push(`- Contact form: ${url("/contact")}`);
  lines.push("");

  lines.push("## Product categories");
  for (const c of categories) {
    lines.push(`- [${c.label}](${url(`/${c.slug}`)}): ${c.blurb}`);
  }
  lines.push("");

  lines.push("## Products");
  for (const p of products) {
    lines.push(`- [${p.name}](${url(`/products/${p.slug}`)}): ${p.summary}`);
  }
  lines.push("");

  lines.push("## Applications");
  for (const a of applications) {
    lines.push(`- [${a.title}](${url(`/applications/${a.slug}`)}): ${a.pain}`);
  }
  lines.push("");

  lines.push("## Compare");
  lines.push(`- [LiDAR alternative to SICK](${url("/compare/sick-alternative-lidar")})`);
  lines.push(`- [LiDAR alternative to Hokuyo](${url("/compare/hokuyo-alternative-lidar")})`);
  lines.push("");

  lines.push("## Resources");
  lines.push(`- [Technical resource library](${url("/resources")})`);
  lines.push(`- [Robotics glossary](${url("/resources/glossary")})`);
  for (const m of leadMagnets) {
    lines.push(`- [${m.title}](${url(`/resources/${m.slug}`)}): ${m.blurb}`);
  }
  lines.push("");

  if (posts.length > 0) {
    lines.push("## Blog — Eyes at the Edge");
    lines.push(`- [Blog index](${url("/blog")})`);
    for (const post of posts) {
      const summary = post.excerpt ? `: ${post.excerpt}` : "";
      lines.push(`- [${post.title}](${url(`/blog/${post.slug}`)})${summary}`);
    }
    lines.push("");
  }

  const body = lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
    },
  });
}
