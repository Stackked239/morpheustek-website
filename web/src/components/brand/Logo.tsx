import Link from "next/link";
import { cn } from "@/lib/cn";
import { EyeMark } from "./EyeMark";

/** Eye + morpheusTEK wordmark lockup. Wordmark blue on light, white on dark. */
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
    <span className={cn("inline-flex items-center gap-2.5 text-text-strong", className)}>
      <EyeMark size={size} scanning={scanning} />
      {showWordmark && (
        <span className="font-display text-[1.3rem] font-extrabold leading-none tracking-[-0.02em] text-mt-blue dark:text-white sensor:text-white">
          morpheus<span className="font-black">TEK</span>
        </span>
      )}
    </span>
  );
  if (href === null) return content;
  return (
    <Link href={href} aria-label="MorpheusTEK home" className="inline-flex rounded">
      {content}
    </Link>
  );
}
