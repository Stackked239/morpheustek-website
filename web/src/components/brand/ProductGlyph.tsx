import { cn } from "@/lib/cn";

/**
 * Branded placeholder for a product image: a sensor scanning a point cloud —
 * FOV arcs + depth-ramp dots fanning from an origin, with the eye. Looks
 * intentional (not a broken image) and gets swapped for real product
 * photography once MorpheusTEK supplies it.
 */
const ramp = ["var(--pc-near)", "var(--pc-1)", "var(--pc-2)", "var(--pc-3)", "var(--pc-4)", "var(--pc-5)", "var(--pc-far)"];

export function ProductGlyph({ label, className }: { label?: string; className?: string }) {
  const ox = 100;
  const oy = 132;
  const dots = Array.from({ length: 30 }, (_, i) => {
    const deg = -62 + (i * 124) / 29;
    const a = (deg * Math.PI) / 180;
    const r = 34 + ((i * 13) % 64);
    return {
      x: ox + r * Math.sin(a),
      y: oy - r * Math.cos(a),
      c: ramp[Math.min(ramp.length - 1, Math.floor(r / 16))],
      s: 1.4 + (i % 3) * 0.5,
    };
  });

  return (
    <div className={cn("relative overflow-hidden rounded-md bg-mt-navy-900", className)}>
      <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        {[44, 70, 96].map((r, i) => (
          <path
            key={r}
            d={`M ${ox - r * Math.sin((62 * Math.PI) / 180)} ${oy - r * Math.cos((62 * Math.PI) / 180)} A ${r} ${r} 0 0 1 ${ox + r * Math.sin((62 * Math.PI) / 180)} ${oy - r * Math.cos((62 * Math.PI) / 180)}`}
            fill="none"
            stroke="var(--pc-4)"
            strokeWidth="0.6"
            opacity={0.28 - i * 0.06}
          />
        ))}
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.s} fill={d.c} opacity="0.85" />
        ))}
        <circle cx={ox} cy={oy} r="6.5" fill="none" stroke="var(--pc-4)" strokeWidth="1.4" opacity="0.8" />
        <circle cx={ox} cy={oy} r="2.4" fill="var(--mt-red, #e2231a)" />
      </svg>
      {label ? (
        <span className="absolute bottom-2 left-3 font-mono text-[10px] uppercase tracking-wider text-pc-4/80">{label}</span>
      ) : null}
    </div>
  );
}
