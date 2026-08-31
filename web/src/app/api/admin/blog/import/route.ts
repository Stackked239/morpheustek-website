import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { requireAdmin } from "@/lib/admin-api";
import { importedTextToArticle } from "@/lib/cms/import-article";

const MAX_BYTES = 4 * 1024 * 1024;

function isDocx(name: string, type: string) {
  return (
    name.endsWith(".docx") ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a file to import." }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 4 MB)." }, { status: 400 });

  const name = file.name.toLowerCase();
  const type = file.type;

  if (name.endsWith(".doc") && !name.endsWith(".docx")) {
    return NextResponse.json(
      { error: "Old .doc files aren't supported. Save as .docx, or export from Google Docs as .docx or .html." },
      { status: 400 },
    );
  }

  let text = "";
  try {
    if (isDocx(name, type)) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await mammoth.convertToHtml({ buffer });
      text = result.value;
    } else if (name.endsWith(".html") || name.endsWith(".htm") || type === "text/html") {
      text = await file.text();
    } else if (
      name.endsWith(".md") ||
      name.endsWith(".markdown") ||
      name.endsWith(".txt") ||
      type.startsWith("text/") ||
      type === "application/octet-stream"
    ) {
      text = await file.text();
    } else {
      return NextResponse.json(
        { error: "Use a Word (.docx), Markdown, HTML, or plain text file." },
        { status: 400 },
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not read that file.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (!text.trim()) {
    return NextResponse.json({ error: "That file looks empty." }, { status: 400 });
  }

  const imported = importedTextToArticle(text);
  return NextResponse.json({
    ok: true,
    title: imported.title,
    excerpt: imported.excerpt,
    slug: imported.slug,
    body: imported.body,
  });
}
