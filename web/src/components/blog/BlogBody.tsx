import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  isFigureCaption,
  isMarkdownDividerRow,
  parsePipeRow,
  stripBlogMeta,
  tableFromPipeBullets,
  tableFromRows,
} from "@/lib/cms/blog-template";

type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "quote"; lines: string[] }
  | { type: "hr" }
  | { type: "ul"; items: string[] }
  | { type: "lede"; text: string }
  | { type: "callout"; title: string; body: string }
  | { type: "specs"; rows: { label: string; value: string }[] }
  | { type: "table"; caption: string; headers: string[]; rows: string[][] }
  | { type: "steps"; items: { num: string; title: string; body: string }[] }
  | { type: "takeaways"; items: string[] }
  | { type: "cta"; primary: { label: string; href: string }; secondary?: { label: string; href: string } };

function parseInline(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="text-text-strong not-italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

function parseBlocks(body: string): Block[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

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
      const recovered = tableFromPipeBullets(items);
      if (recovered) {
        blocks.push({ type: "table", ...recovered });
      } else {
        blocks.push({ type: "ul", items });
      }
      continue;
    }

    if (trimmed.includes("|") && !trimmed.startsWith("- ") && parsePipeRow(trimmed).length >= 2) {
      const start = i;
      const raw: string[][] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (!t || !t.includes("|")) break;
        if (t.startsWith("## ") || t.startsWith("### ") || t.startsWith("> ") || t.startsWith("- ") || t === "---") break;
        if (t.startsWith("::") && t.endsWith("::")) break;
        const cells = parsePipeRow(t);
        if (isMarkdownDividerRow(cells)) {
          i++;
          continue;
        }
        raw.push(cells);
        i++;
      }
      const table = tableFromRows(raw);
      if (table && raw.length >= 2) {
        blocks.push({ type: "table", ...table });
        continue;
      }
      i = start;
    }

    if (trimmed.startsWith("::") && trimmed.endsWith("::")) {
      const tag = trimmed.slice(2, -2);
      const inner: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "::end::") {
        inner.push(lines[i]);
        i++;
      }
      i++; // skip ::end::

      if (tag === "lede") {
        blocks.push({ type: "lede", text: inner.join("\n").trim() });
        continue;
      }

      if (tag.startsWith("callout|")) {
        const title = tag.slice("callout|".length);
        blocks.push({ type: "callout", title, body: inner.join("\n").trim() });
        continue;
      }

      if (tag === "specs") {
        const rows = inner
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const [label, ...rest] = l.split("|");
            return { label: label.trim(), value: rest.join("|").trim() };
          });
        blocks.push({ type: "specs", rows });
        continue;
      }

      if (tag === "table" || tag.startsWith("table|")) {
        const caption = tag.startsWith("table|") ? tag.slice("table|".length) : "";
        const table = tableFromRows(
          inner.map((l) => l.trim()).filter(Boolean).map(parsePipeRow),
          caption,
        );
        if (table) blocks.push({ type: "table", ...table });
        continue;
      }

      if (tag === "steps") {
        const items = inner
          .map((l) => l.trim())
          .filter(Boolean)
          .map((l) => {
            const [num, title, ...rest] = l.split("|");
            return { num: num.trim(), title: title.trim(), body: rest.join("|").trim() };
          });
        blocks.push({ type: "steps", items });
        continue;
      }

      if (tag === "takeaways") {
        const items = inner.map((l) => l.trim()).filter((l) => l.startsWith("- ")).map((l) => l.slice(2));
        blocks.push({ type: "takeaways", items });
        continue;
      }

      if (tag === "cta") {
        const [primaryLine, secondaryLine] = inner.map((l) => l.trim()).filter(Boolean);
        const parseCta = (s: string) => {
          const [label, href] = s.split("|");
          return { label: label.trim(), href: href.trim() };
        };
        blocks.push({
          type: "cta",
          primary: parseCta(primaryLine),
          secondary: secondaryLine ? parseCta(secondaryLine) : undefined,
        });
        continue;
      }

      continue;
    }

    const para: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (
        !t ||
        t.startsWith("## ") ||
        t.startsWith("### ") ||
        t.startsWith("> ") ||
        t.startsWith("- ") ||
        t === "---" ||
        (t.startsWith("::") && t.endsWith("::")) ||
        (t.includes("|") && parsePipeRow(t).length >= 2)
      )
        break;
      para.push(lines[i]);
      i++;
    }
    if (para.length) blocks.push({ type: "p", text: para.join(" ").trim() });
  }

  const out: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const before = blocks[i - 1];
    const after = blocks[i + 1];
    if (block.type === "p" && isFigureCaption(block.text) && after?.type === "table" && !after.caption) continue;
    if (block.type === "table" && !block.caption && before?.type === "p" && isFigureCaption(before.text)) {
      out.push({ ...block, caption: before.text });
      continue;
    }
    if (block.type === "table" && !block.caption && after?.type === "p" && isFigureCaption(after.text)) {
      out.push({ ...block, caption: after.text });
      i++;
      continue;
    }
    out.push(block);
  }
  return out;
}

export function BlogBody({ body }: { body: string }) {
  const blocks = parseBlocks(stripBlogMeta(body));

  return (
    <article className="blog-article">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "lede":
            return (
              <p key={i} className="blog-lede">
                {parseInline(block.text)}
              </p>
            );
          case "h2":
            return (
              <h2 key={i} className="blog-h2">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="blog-h3">
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="blog-p">
                {parseInline(block.text)}
              </p>
            );
          case "quote":
            return (
              <blockquote key={i} className="blog-quote">
                {block.lines.map((l, j) => (
                  <p key={j} className={j === 0 ? "blog-quote-lead" : "blog-quote-attr"}>
                    {parseInline(l)}
                  </p>
                ))}
              </blockquote>
            );
          case "hr":
            return <hr key={i} className="blog-hr" />;
          case "ul":
            return (
              <ul key={i} className="blog-ul">
                {block.items.map((item) => (
                  <li key={item}>{parseInline(item)}</li>
                ))}
              </ul>
            );
          case "callout":
            return (
              <aside key={i} className="blog-callout">
                <p className="blog-callout-label">{block.title}</p>
                <p className="blog-callout-body">{parseInline(block.body)}</p>
              </aside>
            );
          case "specs":
            return (
              <dl key={i} className="blog-specs">
                {block.rows.map((row) => (
                  <div key={row.label} className="blog-spec-row">
                    <dt>{row.label}</dt>
                    <dd className="tnum">{row.value}</dd>
                  </div>
                ))}
              </dl>
            );
          case "table":
            return (
              <figure key={i} className="blog-table-wrap">
                {block.caption ? <figcaption className="blog-table-caption">{block.caption}</figcaption> : null}
                <div className="blog-table-scroll">
                  <table className="blog-table">
                    <thead>
                      <tr>
                        {block.headers.map((cell, ci) => (
                          <th key={ci} scope="col">
                            {parseInline(cell)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, ri) => (
                        <tr key={ri}>
                          {row.map((cell, ci) => (
                            <td key={ci} className="tnum">
                              {parseInline(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </figure>
            );
          case "steps":
            return (
              <ol key={i} className="blog-steps">
                {block.items.map((step) => (
                  <li key={step.num}>
                    <span className="blog-step-num" aria-hidden>
                      {step.num}
                    </span>
                    <div>
                      <p className="blog-step-title">{step.title}</p>
                      <p className="blog-step-body">{parseInline(step.body)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            );
          case "takeaways":
            return (
              <aside key={i} className="blog-takeaways">
                <p className="blog-takeaways-label">Key takeaways</p>
                <ul>
                  {block.items.map((item) => (
                    <li key={item}>{parseInline(item)}</li>
                  ))}
                </ul>
              </aside>
            );
          case "cta":
            return (
              <div key={i} className="blog-cta">
                <Link href={block.primary.href} className="blog-cta-primary">
                  {block.primary.label}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                {block.secondary ? (
                  <Link href={block.secondary.href} className="blog-cta-secondary">
                    {block.secondary.label}
                  </Link>
                ) : null}
              </div>
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
