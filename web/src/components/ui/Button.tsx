import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-[background-color,box-shadow,transform,color] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 disabled:opacity-50 disabled:pointer-events-none";

const variantCls: Record<Variant, string> = {
  primary: "bg-accent text-accent-text hover:bg-accent-hover hover:shadow-md active:scale-[0.98]",
  secondary: "bg-brand-blue text-white hover:bg-brand-blue-hover hover:shadow-sm active:scale-[0.98]",
  ghost: "border border-border-strong text-brand-blue hover:bg-bg-muted active:scale-[0.98]",
  quiet: "text-brand-blue underline-offset-4 decoration-2 hover:underline",
};

const sizeCls: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  className,
  children,
  type = "button",
  onClick,
  target,
  rel,
  ariaLabel,
  disabled,
}: Props) {
  const cls = cn(base, variantCls[variant], sizeCls[size], className);
  if (href) {
    return (
      <Link href={href} className={cls} target={target} rel={rel} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  );
}
