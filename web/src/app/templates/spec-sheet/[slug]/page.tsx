import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, visibleSpecs } from "@/lib/cms";
import { formatPrice } from "@/lib/catalog";
import { PrintButton } from "@/components/templates/PrintButton";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return { title: `${product.model} Spec Sheet`, robots: { index: false, follow: false } };
}

export default async function SpecSheetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const price = product.price !== undefined ? formatPrice(product.price) : "Contact for pricing";
  const keySpecs = visibleSpecs(product.keySpecs);
  const specs = visibleSpecs(product.specs);

  return (
    <div className="spec-sheet-print bg-white text-mt-navy">
      <PrintButton />
      <div className="mx-auto max-w-[8in]">
        <div className="flex items-end justify-between gap-3 bg-accent px-5 py-4 text-accent-text">
          <div className="font-display text-2xl font-extrabold uppercase">MorpheusTEK</div>
          <div className="font-mono text-[8pt] uppercase tracking-widest">Giving sight to robotics</div>
        </div>

        <div className="border-b-[3px] border-mt-navy px-5 py-6">
          <h1 className="font-display text-[24pt] font-extrabold uppercase leading-tight">
            {product.brand} {product.model}
          </h1>
          <p className="mt-2 max-w-xl text-[11pt] text-text-muted">{product.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[8.5pt] uppercase tracking-wide text-text-muted">
            <span>{product.name}</span>
            <span>{price}</span>
            {product.certifications?.map((c) => (
              <span key={c} className="rounded bg-mt-navy px-2 py-0.5 text-white">
                {c}
              </span>
            ))}
            {product.trial ? <span>90-day risk-free trial</span> : null}
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <div className="rounded border border-border p-4">
            <h2 className="mb-2 font-display text-[10pt] font-bold uppercase tracking-wide">Key specs</h2>
            <table className="w-full text-[9.5pt]">
              <tbody>
                {keySpecs.map((s) => (
                  <tr key={s.label} className="border-b border-border">
                    <th className="w-[42%] py-1.5 pr-3 text-left font-bold text-text-muted">{s.label}</th>
                    <td className="py-1.5">{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded border border-border p-4">
            <h2 className="mb-2 font-display text-[10pt] font-bold uppercase tracking-wide">Best for</h2>
            <ul className="list-disc pl-5 text-[9.5pt]">
              {product.bestFor.map((b) => (
                <li key={b} className="my-1">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mx-5 mb-5 rounded border border-border p-4">
          <h2 className="mb-2 font-display text-[10pt] font-bold uppercase tracking-wide">Full specifications</h2>
          <table className="w-full text-[9.5pt]">
            <tbody>
              {specs.map((s) => (
                <tr key={s.label} className="border-b border-border">
                  <th className="w-[42%] py-1.5 pr-3 text-left font-bold text-text-muted">{s.label}</th>
                  <td className="py-1.5">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mx-5 mb-4 text-[9pt] text-text-muted">{product.summary}</p>

        <div className="flex justify-between gap-4 border-t-2 border-accent px-5 py-4 text-[8.5pt] text-text-muted">
          <div>
            <strong className="block text-[9pt] uppercase text-mt-navy">MorpheusTEK</strong>
            morpheustek.com · Exclusive North American distributor for OLEI LiDAR
          </div>
          <div className="text-right">
            <strong className="block text-[9pt] uppercase text-mt-navy">Contact</strong>
            morpheustek.com/book-a-meeting
          </div>
        </div>
      </div>
    </div>
  );
}
