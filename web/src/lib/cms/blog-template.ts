/**
 * Structured blog article form ↔ stored body format.
 * Shared by the admin editor and the public BlogBody renderer.
 */

export type BlogMeta = {
  category: string;
  readTime: string;
  series: string;
  /** Featured image public URL (Supabase storage). Empty string = no image. */
  image: string;
  imageAlt: string;
};

export type BlogCta = {
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

export type BlogSectionType =
  | "paragraph"
  | "heading2"
  | "heading3"
  | "quote"
  | "divider"
  | "bullets"
  | "specs"
  | "callout"
  | "steps";

export type BlogSection =
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "heading2"; text: string }
  | { id: string; type: "heading3"; text: string }
  | { id: string; type: "quote"; text: string; attribution: string }
  | { id: string; type: "divider" }
  | { id: string; type: "bullets"; items: string[] }
  | { id: string; type: "specs"; rows: { label: string; value: string }[] }
  | { id: string; type: "callout"; title: string; body: string }
  | { id: string; type: "steps"; items: { num: string; title: string; body: string }[] };

export type BlogArticleForm = {
  meta: BlogMeta;
  lede: string;
  sections: BlogSection[];
  takeaways: string[];
  cta: BlogCta;
};

export const BLOG_SECTION_LABELS: Record<BlogSectionType, string> = {
  paragraph: "Paragraph",
  heading2: "Major section heading",
  heading3: "Subsection heading",
  quote: "Pull quote",
  divider: "Section divider",
  bullets: "Bullet list",
  specs: "Spec table",
  callout: "Highlight box",
  steps: "Numbered steps",
};

export function newSectionId() {
  return `sec-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createSection(type: BlogSectionType): BlogSection {
  const id = newSectionId();
  switch (type) {
    case "paragraph":
      return { id, type, text: "" };
    case "heading2":
    case "heading3":
      return { id, type, text: "" };
    case "quote":
      return { id, type, text: "", attribution: "" };
    case "divider":
      return { id, type };
    case "bullets":
      return { id, type, items: [""] };
    case "specs":
      return { id, type, rows: [{ label: "", value: "" }] };
    case "callout":
      return { id, type, title: "", body: "" };
    case "steps":
      return { id, type, items: [{ num: "01", title: "", body: "" }] };
  }
}

export function defaultNewArticleForm(): BlogArticleForm {
  return {
    meta: {
      category: "",
      readTime: "8 min",
      series: "Eyes at the Edge",
      image: "",
      imageAlt: "",
    },
    lede: "",
    sections: [createSection("paragraph")],
    takeaways: [""],
    cta: {
      primary: { label: "Start a 90-day trial", href: "/book-a-meeting?intent=trial" },
      secondary: { label: "Browse products", href: "/products" },
    },
  };
}

type ParsedBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; lines: string[] }
  | { type: "hr" }
  | { type: "ul"; items: string[] }
  | { type: "lede"; text: string }
  | { type: "callout"; title: string; body: string }
  | { type: "specs"; rows: { label: string; value: string }[] }
  | { type: "steps"; items: { num: string; title: string; body: string }[] }
  | { type: "takeaways"; items: string[] }
  | { type: "cta"; primary: { label: string; href: string }; secondary?: { label: string; href: string } };

function parseBlocks(body: string): ParsedBlock[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: ParsedBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed === "---") {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", text: trimmed.slice(3) });
      i++;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", text: trimmed.slice(4) });
      i++;
      continue;
    }

    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "quote", lines: quoteLines });
      continue;
    }

    if (trimmed.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (trimmed.startsWith("::") && trimmed.endsWith("::")) {
      const tag = trimmed.slice(2, -2);
      const inner: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "::end::") {
        inner.push(lines[i]);
        i++;
      }
      i++;

      if (tag === "lede") {
        blocks.push({ type: "lede", text: inner.join("\n").trim() });
        continue;
      }
      if (tag.startsWith("callout|")) {
        blocks.push({ type: "callout", title: tag.slice("callout|".length), body: inner.join("\n").trim() });
        continue;
      }
      if (tag === "specs") {
        blocks.push({
          type: "specs",
          rows: inner
            .map((l) => l.trim())
            .filter(Boolean)
            .map((l) => {
              const [label, ...rest] = l.split("|");
              return { label: label.trim(), value: rest.join("|").trim() };
            }),
        });
        continue;
      }
      if (tag === "steps") {
        blocks.push({
          type: "steps",
          items: inner
            .map((l) => l.trim())
            .filter(Boolean)
            .map((l) => {
              const [num, title, ...rest] = l.split("|");
              return { num: num.trim(), title: title.trim(), body: rest.join("|").trim() };
            }),
        });
        continue;
      }
      if (tag === "takeaways") {
        blocks.push({
          type: "takeaways",
          items: inner.map((l) => l.trim()).filter((l) => l.startsWith("- ")).map((l) => l.slice(2)),
        });
        continue;
      }
      if (tag === "cta") {
        const lines2 = inner.map((l) => l.trim()).filter(Boolean);
        const parseCta = (s: string) => {
          const [label, href] = s.split("|");
          return { label: label.trim(), href: href.trim() };
        };
        blocks.push({
          type: "cta",
          primary: parseCta(lines2[0]),
          secondary: lines2[1] ? parseCta(lines2[1]) : undefined,
        });
        continue;
      }
      continue;
    }

    const para: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t || t.startsWith("## ") || t.startsWith("### ") || t.startsWith("> ") || t.startsWith("- ") || t === "---" || (t.startsWith("::") && t.endsWith("::"))) break;
      para.push(lines[i]);
      i++;
    }
    if (para.length) blocks.push({ type: "p", text: para.join(" ").trim() });
  }

  return blocks;
}

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

export function stripBlogMeta(body: string) {
  return body.replace(/::meta::\n[\s\S]*?\n::end::\n*/, "").trim();
}

function stripMeta(body: string) {
  return stripBlogMeta(body);
}

function blockToSection(block: ParsedBlock): BlogSection | null {
  const id = newSectionId();
  switch (block.type) {
    case "p":
      return { id, type: "paragraph", text: block.text };
    case "h2":
      return { id, type: "heading2", text: block.text };
    case "h3":
      return { id, type: "heading3", text: block.text };
    case "quote":
      return { id, type: "quote", text: block.lines[0] ?? "", attribution: block.lines.slice(1).join("\n") };
    case "hr":
      return { id, type: "divider" };
    case "ul":
      return { id, type: "bullets", items: block.items.length ? block.items : [""] };
    case "callout":
      return { id, type: "callout", title: block.title, body: block.body };
    case "specs":
      return { id, type: "specs", rows: block.rows.length ? block.rows : [{ label: "", value: "" }] };
    case "steps":
      return { id, type: "steps", items: block.items.length ? block.items : [{ num: "01", title: "", body: "" }] };
    default:
      return null;
  }
}

export function parseBodyToForm(body: string): BlogArticleForm {
  if (!body.trim()) return defaultNewArticleForm();

  const meta = parseBlogMeta(body);
  const blocks = parseBlocks(stripMeta(body));

  let lede = "";
  let takeaways: string[] = [""];
  let cta: BlogCta = defaultNewArticleForm().cta;
  const sections: BlogSection[] = [];

  const firstLedeIdx = blocks.findIndex((b) => b.type === "lede");
  if (firstLedeIdx >= 0 && blocks[firstLedeIdx].type === "lede") {
    lede = blocks[firstLedeIdx].text;
  }

  const lastCtaIdx = blocks.findLastIndex((b) => b.type === "cta");
  if (lastCtaIdx >= 0 && blocks[lastCtaIdx].type === "cta") {
    cta = {
      primary: blocks[lastCtaIdx].primary,
      secondary: blocks[lastCtaIdx].secondary ?? { label: "", href: "" },
    };
  }

  const lastTakeIdx = blocks.findLastIndex((b) => b.type === "takeaways");
  if (lastTakeIdx >= 0 && blocks[lastTakeIdx].type === "takeaways") {
    takeaways = blocks[lastTakeIdx].items.length ? blocks[lastTakeIdx].items : [""];
  }

  blocks.forEach((block, idx) => {
    if (block.type === "lede" && idx === firstLedeIdx) return;
    if (block.type === "cta" && idx === lastCtaIdx) return;
    if (block.type === "takeaways" && idx === lastTakeIdx) return;
    const section = blockToSection(block);
    if (section) sections.push(section);
  });

  return {
    meta,
    lede,
    sections: sections.length ? sections : [createSection("paragraph")],
    takeaways,
    cta,
  };
}

function serializeSection(section: BlogSection): string {
  switch (section.type) {
    case "paragraph":
      return section.text.trim() ? `${section.text.trim()}\n\n` : "";
    case "heading2":
      return section.text.trim() ? `## ${section.text.trim()}\n\n` : "";
    case "heading3":
      return section.text.trim() ? `### ${section.text.trim()}\n\n` : "";
    case "quote": {
      const lines = [section.text.trim(), section.attribution.trim()].filter(Boolean);
      return lines.length ? `${lines.map((l) => `> ${l}`).join("\n")}\n\n` : "";
    }
    case "divider":
      return "---\n\n";
    case "bullets": {
      const items = section.items.map((s) => s.trim()).filter(Boolean);
      return items.length ? `${items.map((i) => `- ${i}`).join("\n")}\n\n` : "";
    }
    case "callout":
      return section.title.trim() || section.body.trim()
        ? `::callout|${section.title.trim()}::\n${section.body.trim()}\n::end::\n\n`
        : "";
    case "specs": {
      const rows = section.rows.filter((r) => r.label.trim() || r.value.trim());
      return rows.length ? `::specs::\n${rows.map((r) => `${r.label.trim()} | ${r.value.trim()}`).join("\n")}\n::end::\n\n` : "";
    }
    case "steps": {
      const items = section.items.filter((s) => s.title.trim() || s.body.trim());
      return items.length
        ? `::steps::\n${items.map((s) => `${s.num.trim()}|${s.title.trim()}|${s.body.trim()}`).join("\n")}\n::end::\n\n`
        : "";
    }
  }
}

export function serializeFormToBody(form: BlogArticleForm): string {
  const parts: string[] = [
    "::meta::",
    `category:${form.meta.category.trim()}`,
    `readTime:${form.meta.readTime.trim()}`,
    `series:${form.meta.series.trim()}`,
  ];
  if (form.meta.image.trim()) parts.push(`image:${form.meta.image.trim()}`);
  if (form.meta.imageAlt.trim()) parts.push(`imageAlt:${form.meta.imageAlt.trim()}`);
  parts.push("::end::", "");

  if (form.lede.trim()) {
    parts.push("::lede::", form.lede.trim(), "::end::", "");
  }

  for (const section of form.sections) {
    const chunk = serializeSection(section);
    if (chunk) parts.push(chunk.replace(/\n\n$/, ""), "");
  }

  const takeItems = form.takeaways.map((t) => t.trim()).filter(Boolean);
  if (takeItems.length) {
    parts.push("::takeaways::", ...takeItems.map((t) => `- ${t}`), "::end::", "");
  }

  if (form.cta.primary.label.trim() && form.cta.primary.href.trim()) {
    parts.push(
      "::cta::",
      `${form.cta.primary.label.trim()}|${form.cta.primary.href.trim()}`,
      form.cta.secondary.label.trim() && form.cta.secondary.href.trim()
        ? `${form.cta.secondary.label.trim()}|${form.cta.secondary.href.trim()}`
        : "",
      "::end::",
    );
  }

  return parts.filter((p, i, arr) => !(p === "" && i === arr.length - 1)).join("\n").trim() + "\n";
}
