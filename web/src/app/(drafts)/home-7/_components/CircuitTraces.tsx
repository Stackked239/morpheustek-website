/**
 * The backwall print: one composed circuit that enters at the top-left (under
 * the OLEI lockup), runs the width of the wall on a 40px grid with 45° elbows,
 * and exits toward the demo area. Three stroke weights give it print depth;
 * pads are square (PCB), red nodes are rationed to two (OLEI accents, never
 * louder than the CTAs).
 */
export function CircuitTraces({ className = "", light = false }: { className?: string; light?: boolean }) {
  const heavy = light ? "rgba(255,255,255,0.50)" : "rgba(15,50,108,0.40)";
  const mid = light ? "rgba(255,255,255,0.34)" : "rgba(15,50,108,0.26)";
  const faint = light ? "rgba(255,255,255,0.20)" : "rgba(15,50,108,0.14)";
  const node = light ? "rgba(255,255,255,0.85)" : "#e2231a";

  return (
    <svg viewBox="0 0 1200 360" aria-hidden className={className} fill="none" preserveAspectRatio="xMaxYMin slice">
      {/* faint underlayer — long runs that bind the composition */}
      <g stroke={faint} strokeWidth="1.5">
        <path d="M0 300 H320 L400 220 H760 L840 300 H1200" />
        <path d="M120 360 V300 L200 220 V120 L280 40 H560" />
        <path d="M640 360 V280 L720 200 H1000 L1080 120 V0" />
      </g>
      {/* mid layer */}
      <g stroke={mid} strokeWidth="2.5">
        <path d="M0 80 H240 L320 160 H640 L720 80 H1040" />
        <path d="M880 360 V240 L960 160 H1200" />
      </g>
      {/* heavy layer — the main run, lockup → demo wall */}
      <g stroke={heavy} strokeWidth="4">
        <path d="M0 160 H160 L240 240 H520 L600 160 H900 L980 240 H1200" />
      </g>
      {/* square pads on the grid */}
      <g fill={mid}>
        <rect x="234" y="74" width="12" height="12" />
        <rect x="634" y="154" width="12" height="12" />
        <rect x="954" y="154" width="12" height="12" />
        <rect x="394" y="214" width="12" height="12" />
      </g>
      {/* two red nodes only — quieter than the CTAs */}
      <g>
        <circle cx="160" cy="160" r="6" fill={node} />
        <circle cx="160" cy="160" r="11" stroke={heavy} strokeWidth="2" />
        <circle cx="1040" cy="80" r="6" fill={node} />
        <circle cx="1040" cy="80" r="11" stroke={mid} strokeWidth="2" />
      </g>
    </svg>
  );
}
