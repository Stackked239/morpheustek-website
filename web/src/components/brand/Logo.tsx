import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Official MorpheusTEK lockup (brand guide, MT01_D1) — the real artwork extracted
 * from the brand guide. Positive = PMS 3581 navy on light; reversed = all white on
 * dark / sensor. The eye always stays with the wordmark (never the wordmark alone).
 */
export function Logo({
  href = "/",
  className,
}: {
  href?: string | null;
  className?: string;
}) {
  const content = (
    <span className={cn("inline-flex items-center", className)}>
      {/* Positive (navy) — light theme */}
      <Image
        src="/brand/morpheustek-logo.png"
        alt="MorpheusTEK"
        width={1761}
        height={439}
        priority
        className="h-8 w-auto md:h-9 dark:hidden sensor:hidden"
      />
      {/* Reversed (white) — dark + sensor themes */}
      <Image
        src="/brand/morpheustek-logo-white.png"
        alt=""
        width={1724}
        height={429}
        priority
        aria-hidden
        className="hidden h-8 w-auto md:h-9 dark:block sensor:block"
      />
    </span>
  );
  if (href === null) return content;
  return (
    <Link href={href} aria-label="MorpheusTEK home" className="inline-flex rounded">
      {content}
    </Link>
  );
}
