/* §00b — Document-control strip
   The "revision history" of the document: the three deal pillars compressed to
   mono fragments in a single hairline-ruled row. Pure typography — no boxes. */

const entries = [
  { index: "01", text: "SIL2 / PL d certified — same class as SICK" },
  { index: "02", text: "90-day trial · your environment · $0" },
  { index: "03", text: "Full stack + North American support" },
] as const;

export function DocControlStrip() {
  return (
    <div className="mx-4 border-b border-border md:mx-6">
      <ul className="mx-auto grid max-w-[100rem] divide-y divide-border font-mono text-anno-sm uppercase text-text-muted md:grid-cols-3 md:divide-x md:divide-y-0">
        {entries.map((e) => (
          <li key={e.index} className="flex items-baseline gap-3 px-5 py-4 md:px-8">
            <span className="text-brand-blue">{e.index}</span>
            <span>{e.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
