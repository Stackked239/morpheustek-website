import type { ComponentType } from "react";
import { cn } from "@/lib/cn";

/**
 * Brand "eye-con" (per brand guide §13): a service icon framed by the eye shape.
 * The eye outline is currentColor (navy/white); the inner icon is brand blue.
 */
export function EyeIcon({
  icon: Icon,
  size = 76,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn("relative inline-grid shrink-0 place-items-center text-mt-navy dark:text-white sensor:text-white", className)}
      style={{ width: size, height: Math.round(size * 0.62) }}
      aria-hidden
    >
      <svg viewBox="0 0 100 60" fill="none" className="absolute inset-0 size-full">
        <path d="M3 30 C 22 6, 78 6, 97 30 C 78 54, 22 54, 3 30 Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      </svg>
      <Icon className="relative size-[34%] text-brand-blue" />
    </span>
  );
}
