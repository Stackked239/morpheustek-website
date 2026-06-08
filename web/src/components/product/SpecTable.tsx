import type { Spec } from "@/lib/catalog";
import { cn } from "@/lib/cn";

export function SpecTable({ specs, caption, className }: { specs: Spec[]; caption?: string; className?: string }) {
  return (
    <table className={cn("w-full border-collapse text-sm", className)}>
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <tbody>
        {specs.map((s, i) => (
          <tr key={s.label} className={i % 2 ? "bg-bg-muted/40" : undefined}>
            <th scope="row" className="w-2/5 py-2.5 pr-4 text-left align-top font-medium text-text-muted">
              {s.label}
            </th>
            <td className="tnum py-2.5 font-medium text-text">{s.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
