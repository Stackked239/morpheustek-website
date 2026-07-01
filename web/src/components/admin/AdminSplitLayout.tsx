"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type Mode = "edit" | "preview" | "split";

export function AdminSplitLayout({
  editor,
  preview,
  previewTitle = "Live preview",
}: {
  editor: React.ReactNode;
  preview: React.ReactNode;
  previewTitle?: string;
}) {
  const [mode, setMode] = useState<Mode>("split");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 lg:hidden">
        {(["edit", "preview"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em]",
              mode === m ? "border-brand-blue bg-brand-blue/10 text-brand-blue" : "border-border text-text-muted",
            )}
          >
            {m === "edit" ? "Edit" : "Preview"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        <div className={cn(mode === "preview" && "hidden xl:block")}>{editor}</div>
        <div className={cn("xl:sticky xl:top-4", mode === "edit" && "hidden xl:block")}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-brand-blue">{previewTitle}</p>
            <span className="text-xs text-text-subtle">Updates as you type</span>
          </div>
          <div className="admin-live-preview max-h-[min(72vh,56rem)] overflow-auto rounded-xl border border-border bg-bg shadow-lg ring-1 ring-border/60">
            {preview}
          </div>
        </div>
      </div>
    </div>
  );
}
