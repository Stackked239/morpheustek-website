import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * The official MorpheusTEK circuit-eye, using the real brand-guide artwork
 * (navy on light / white on dark + sensor). `scanning` overlays an accent-yellow
 * sweep masked to the eye's strokes — a subtle "sensor coming online" effect used
 * on the 404 and placeholder pages. Eye-only mark; never shown as a logo lock-up.
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
  const h = Math.round(size * 0.66); // native artwork ratio 665:439 (left tip reconstructed)
  const mask = "url(/brand/morpheustek-eye.png)";
  return (
    <span
      role="img"
      aria-label={title}
      className={cn("relative inline-block shrink-0 align-middle", className)}
      style={{ width: w, height: h }}
    >
      {/* Positive (navy) — light theme */}
      <Image
        src="/brand/morpheustek-eye.png"
        alt=""
        fill
        sizes={`${w}px`}
        className="object-contain dark:hidden sensor:hidden"
      />
      {/* Reversed (white) — dark + sensor themes */}
      <Image
        src="/brand/morpheustek-eye-white.png"
        alt=""
        fill
        sizes={`${w}px`}
        className="hidden object-contain dark:block sensor:block"
      />
      {scanning ? (
        <span
          aria-hidden
          className="eye-scan pointer-events-none absolute inset-0"
          style={{
            WebkitMaskImage: mask,
            maskImage: mask,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      ) : null}
    </span>
  );
}
