import { notFound } from "next/navigation";
import { contentBlockRegistry } from "@/lib/cms/content-registry";
import { getContent } from "@/lib/cms";
import { pageContentFallback } from "@/lib/cms/page-defaults";
import { ContentBlockEditor } from "./ContentBlockEditor";

type Params = { params: Promise<{ key: string }> };

export default async function AdminContentBlockPage({ params }: Params) {
  const { key } = await params;
  const decoded = decodeURIComponent(key);
  const def = contentBlockRegistry.find((b) => b.key === decoded);
  if (!def) notFound();
  const data = await getContent(decoded, pageContentFallback(decoded) ?? def.defaultData ?? {});
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-h3 font-bold uppercase text-text-strong">{def.label}</h2>
        <p className="mt-1 font-mono text-xs text-text-subtle">{decoded}</p>
      </div>
      <ContentBlockEditor blockKey={decoded} label={def.label} group={def.group} initial={data} />
    </div>
  );
}
