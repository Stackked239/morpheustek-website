import { cn } from "@/lib/cn";

/**
 * The official MorpheusTEK "eye-con" (per the brand guide): an almond eye with
 * horizontal center bars running to the corners, an iris ring with top/bottom
 * segments, and a center pupil ring. Monochrome (currentColor) so it renders
 * navy on light / white on dark — never recolored, per brand rules.
 * `scanning` adds a subtle accent-yellow radar sweep for the hero only.
 */
export function EyeMark({
  size = 40,
  className,
  scanning = false,
  title = "MorpheusTEK",
}: {
  size?: number;
  className?: string;
  scanning?: boolean;
  title?: string;
}) {
  const w = size;
  const h = Math.round(size * 0.6);
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 100 60"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("shrink-0", className)}
    >
      {/* almond eye outline */}
      <path d="M3 30 C 22 6, 78 6, 97 30 C 78 54, 22 54, 3 30 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      {/* horizontal center bars flanking the iris */}
      <line x1="9" y1="30" x2="33" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line x1="67" y1="30" x2="91" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* iris ring + top/bottom segments */}
      <circle cx="50" cy="30" r="15" stroke="currentColor" strokeWidth="3" />
      <line x1="40" y1="23.5" x2="60" y2="23.5" stroke="currentColor" strokeWidth="2.4" />
      <line x1="40" y1="36.5" x2="60" y2="36.5" stroke="currentColor" strokeWidth="2.4" />
      {/* pupil */}
      <circle cx="50" cy="30" r="5.5" stroke="currentColor" strokeWidth="3" />
      {scanning ? (
        <g className="animate-scan" style={{ transformOrigin: "50px 30px" }}>
          <line x1="50" y1="16.5" x2="50" y2="43.5" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" opacity="0.9" />
        </g>
      ) : null}
    </svg>
  );
}
