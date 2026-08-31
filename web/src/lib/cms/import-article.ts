/**
 * Turn a pasted or uploaded article (Markdown, HTML, or plain text) into the
 * structured blog form the admin editor already understands.
 */

import {
  createSection,
  defaultNewArticleForm,
  parseBodyToForm,
  serializeFormToBody,
  type BlogArticleForm,
} from "@/lib/cms/blog-template";

export function slugifyTitle(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function estimateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 220))} min`;
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function normalizeListMarkers(markdown: string): string {
  return markdown
    .replace(/^\s*[•·]\s+/gm, "- ")
    .replace(/^\s*\*\s+/gm, "- ")
    .replace(/^\s*\d+[.)]\s+/gm, "- ");
}

/** Best-effort HTML → Markdown the existing blog parser can read. */
export function htmlToMarkdown(html: string): string {
  let s = html
    .replace(/\r\n/g, "\n")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n\n# ${stripTags(t)}\n\n`);
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${stripTags(t)}\n\n`);
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n\n### ${stripTags(t)}\n\n`);
  s = s.replace(/<h[4-6][^>]*>([\s\S]*?)<\/h[4-6]>/gi, (_, t) => `\n\n### ${stripTags(t)}\n\n`);

  s = s.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) => `\n\n> ${stripTags(t)}\n\n`);

  s = s.replace(/<(ul|ol)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _tag, inner: string) => {
    const items = [...inner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => `- ${stripTags(m[1])}`);
    return `\n\n${items.join("\n")}\n\n`;
  });

  s = s.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (_, inner: string) => {
    const cells = [...inner.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((m) => stripTags(m[1]));
    return cells.length ? `\n- ${cells.join(" | ")}\n` : "\n";
  });

  s = s.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _t, inner) => `*${stripTags(inner)}*`);
  s = s.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/gi, (_, _t, inner) => `*${stripTags(inner)}*`);
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");
  s = s.replace(/<\/(p|div|section|article)>/gi, "\n\n");
  s = s.replace(/<(p|div|section|article)[^>]*>/gi, "");
  s = s.replace(/<\/?[^>]+>/g, " ");

  return decodeEntities(s)
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export type ImportedArticle = {
  title: string;
  excerpt: string;
  slug: string;
  form: BlogArticleForm;
  body: string;
};

function firstMeaningfulLine(text: string): string | undefined {
  return text
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !/^[-*#>]/.test(l));
}

function extractTitle(markdown: string): { title: string; rest: string } {
  const trimmed = markdown.trim();
  const h1 = trimmed.match(/^#\s+(.+)$/m);
  if (h1) {
    return { title: h1[1].trim(), rest: trimmed.replace(h1[0], "").trim() };
  }

  const first = trimmed.split("\n")[0]?.trim() ?? "";
  if (first && first.length <= 120 && !first.startsWith("##") && !first.startsWith("- ") && !first.startsWith("> ")) {
    const after = trimmed.slice(first.length).trim();
    if (after) return { title: first.replace(/^#+\s*/, ""), rest: after };
  }

  return { title: first.replace(/^#+\s*/, "").slice(0, 120), rest: trimmed };
}

function formWordCount(form: BlogArticleForm): string {
  const chunks: string[] = [form.lede, ...form.takeaways];
  for (const section of form.sections) {
    if ("text" in section) chunks.push(section.text);
    if ("body" in section) chunks.push(section.body);
    if ("items" in section && Array.isArray(section.items)) {
      for (const item of section.items) {
        if (typeof item === "string") chunks.push(item);
        else chunks.push(item.title, item.body);
      }
    }
  }
  return estimateReadTime(chunks.join(" "));
}

export function importedTextToArticle(raw: string, existing?: BlogArticleForm): ImportedArticle {
  const looksLikeHtml = /<(h[1-6]|p|div|html|body|ul|ol|li|table|br|strong|em|blockquote)\b/i.test(raw);
  const markdown = normalizeListMarkers(looksLikeHtml ? htmlToMarkdown(raw) : raw.replace(/\r\n/g, "\n"));
  const { title, rest } = extractTitle(markdown);
  const withoutLoneH1 = rest.replace(/^#\s+/gm, "## ");

  const parsed = parseBodyToForm(withoutLoneH1);
  const defaults = existing ?? defaultNewArticleForm();

  let { lede, sections } = parsed;
  if (!lede.trim()) {
    const firstPara = sections.find((s) => s.type === "paragraph" && s.text.trim());
    if (firstPara && firstPara.type === "paragraph") {
      lede = firstPara.text;
      sections = sections.filter((s) => s !== firstPara);
    }
  }
  if (!sections.length) sections = [createSection("paragraph")];

  const excerptSource = lede || firstMeaningfulLine(withoutLoneH1) || title;
  const excerpt = excerptSource.replace(/\*([^*]+)\*/g, "$1").replace(/\s+/g, " ").trim().slice(0, 240);

  const form: BlogArticleForm = {
    ...defaults,
    meta: {
      ...defaults.meta,
      ...parsed.meta,
      image: defaults.meta.image,
      imageAlt: defaults.meta.imageAlt,
      series: parsed.meta.series || defaults.meta.series,
      category: parsed.meta.category || defaults.meta.category,
      readTime: formWordCount({ ...parsed, lede, sections }),
    },
    lede,
    sections,
    takeaways: parsed.takeaways.some((t) => t.trim()) ? parsed.takeaways : defaults.takeaways,
    cta: defaults.cta,
  };

  const resolvedTitle = title || "Untitled post";
  return {
    title: resolvedTitle,
    excerpt,
    slug: slugifyTitle(resolvedTitle),
    form,
    body: serializeFormToBody(form),
  };
}
