"use client";

import { cn } from "@/lib/cn";

export function AdminSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-surface p-6", className)}>
      <div className="mb-5 border-b border-border pb-4">
        <h3 className="font-display text-lg font-bold uppercase text-text-strong">{title}</h3>
        {description ? <p className="mt-1 text-sm text-text-muted">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function AdminField({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-text">{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-xs text-text-subtle">{hint}</span> : null}
    </label>
  );
}

const inputCls =
  "h-11 w-full rounded-md border border-border bg-bg px-3 text-sm text-text outline-none transition-colors placeholder:text-text-subtle focus:border-border-strong focus-visible:ring-2 focus-visible:ring-brand-blue/30";

const textareaCls =
  "min-h-[5rem] w-full rounded-md border border-border bg-bg px-3 py-2.5 text-sm leading-relaxed text-text outline-none transition-colors placeholder:text-text-subtle focus:border-border-strong focus-visible:ring-2 focus-visible:ring-brand-blue/30";

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(textareaCls, props.className)} />;
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(inputCls, props.className)}>
      {props.children}
    </select>
  );
}
