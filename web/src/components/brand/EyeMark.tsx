import { cn } from "@/lib/cn";

/**
 * The MorpheusTEK eye — the brand's most recognizable asset.
 * Almond eye outline (currentColor), blue iris ring, red pupil, and a
 * yellow scan arc that sweeps when `scanning` is on (hero only).
 * Placeholder mark until the canonical vector ships from MorpheusTEK.
 */
export function EyeMark({
  size = 32,
  className,
  scanning = false,
  title = "MorpheusTEK",
}: {
  size?: number;
  className?: string;
  scanning?: boolean;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("shrink-0", className)}
    >
      <path
        d="M3 24C9 14 16 9 24 9C32 9 39 14 45 24C39 34 32 39 24 39C16 39 9 34 3 24Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="10.5" stroke="var(--brand-blue)" strokeWidth="1.8" />
      <g className={scanning ? "animate-scan" : undefined} style={{ transformOrigin: "24px 24px" }}>
        <path
          d="M24 14.5 A 9.5 9.5 0 0 1 33.5 24"
          stroke="var(--accent)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>
      <circle cx="24" cy="24" r="4.2" fill="var(--eye)" />
      <circle cx="22.3" cy="22.3" r="1.15" fill="#fff" opacity="0.85" />
    </svg>
  );
}
