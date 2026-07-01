"use client";

import { Bold, Italic } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

function wrapSelection(el: HTMLTextAreaElement, wrap: string) {
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const text = el.value;
  const selected = text.slice(start, end) || "text";
  const newVal = text.slice(0, start) + wrap + selected + wrap + text.slice(end);
  const cursor = start + wrap.length + selected.length + wrap.length;
  return { newVal, cursor, selectionStart: start + wrap.length, selectionEnd: start + wrap.length + selected.length };
}

export function RichTextField({
  value,
  onChange,
  rows = 4,
  placeholder,
  className,
  hint,
}: {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
  hint?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function apply(wrap: string) {
    const el = ref.current;
    if (!el) return;
    const { newVal, selectionStart, selectionEnd } = wrapSelection(el, wrap);
    onChange(newVal);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart, selectionEnd);
    });
  }

  return (
    <div className={cn("overflow-hidden rounded-md border border-border bg-bg", className)}>
      <div className="flex items-center gap-1 border-b border-border bg-bg-muted/60 px-2 py-1.5">
        <button
          type="button"
          title="Bold — wraps selection in asterisks"
          onClick={() => apply("*")}
          className="grid size-8 place-items-center rounded text-text-muted transition hover:bg-bg hover:text-text"
        >
          <Bold className="size-4" />
        </button>
        <button
          type="button"
          title="Italic emphasis — same asterisk style on site"
          onClick={() => apply("*")}
          className="grid size-8 place-items-center rounded text-text-muted transition hover:bg-bg hover:text-text"
        >
          <Italic className="size-4" />
        </button>
        <span className="ml-2 hidden text-xs text-text-subtle sm:inline">Select text, then click to emphasize</span>
      </div>
      <textarea
        ref={ref}
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[5rem] w-full resize-y bg-transparent px-3 py-2.5 text-sm leading-relaxed text-text outline-none placeholder:text-text-subtle"
      />
      {hint ? <p className="border-t border-border px-3 py-1.5 text-xs text-text-subtle">{hint}</p> : null}
    </div>
  );
}
