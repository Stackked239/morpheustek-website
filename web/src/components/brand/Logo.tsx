import Link from "next/link";
import { cn } from "@/lib/cn";
import { EyeMark } from "./EyeMark";

/**
 * Official lockup (per brand guide): stacked "morpheus" / "TEK" wordmark with the
 * eye-con to the RIGHT. Positive = PMS 3581 navy; reversed = all white. The whole
 * lockup is one color (currentColor inherited from the wrapper).
 */
export function Logo({
  href = "/",
  size = 30,
  showWordmark = true,
  scanning = false,
  className,
}: {
  href?: string | null;
  size?: number;
  showWordmark?: boolean;
  scanning?: boolean;
  className?: string;
}) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5 text-mt-navy dark:text-white sensor:text-white", className)}>
      {showWordmark ? (
        <span className="font-display leading-[0.82] tracking-tight">
          <span className="block text-[0.82rem] font-medium lowercase">morpheus</span>
          <span className="block text-[1.35rem] font-extrabold uppercase">TEK</span>
        </span>
      ) : null}
      <EyeMark size={Math.round(size * 1.7)} scanning={scanning} className="self-center" />
    </span>
  );
  if (href === null) return content;
  return (
    <Link href={href} aria-label="MorpheusTEK home" className="inline-flex rounded">
      {content}
    </Link>
  );
}
