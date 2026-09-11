"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Download, X } from "lucide-react";
import type { Product } from "@/lib/catalog";
import {
  directSpecSheets,
  specSheetAccess,
  specSheetIntent,
  specSheetOptions,
  softwareAccess,
  softwareIntent,
  type ProductDownloadKind,
  type SpecSheetOption,
} from "@/lib/product-downloads";
import { Button } from "@/components/ui/Button";
import { LeadForm, type DownloadOption } from "@/components/forms/LeadForm";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

type GateConfig = {
  kind: ProductDownloadKind;
  title: string;
  intent: string;
  submitLabel: string;
  downloadUrl?: string;
  downloadOptions?: DownloadOption[];
  openUrl?: string;
  openLabel?: string;
};

function gateFor(product: Product, kind: ProductDownloadKind): GateConfig {
  if (kind === "spec") {
    const access = specSheetAccess(product);
    const sheets = specSheetOptions(product);
    return {
      kind,
      title: `${product.model} spec sheet${sheets.length > 1 ? "s" : ""}`,
      intent: specSheetIntent(product.slug),
      submitLabel: "Download spec sheet",
      downloadUrl: access.downloadUrl,
      downloadOptions:
        sheets.length > 1
          ? sheets.map((o) => ({ label: o.model, note: o.note, url: o.path, filename: o.filename }))
          : undefined,
      openUrl: access.openUrl,
      openLabel: "Open spec sheet",
    };
  }

  const access = softwareAccess(product);
  return {
    kind,
    title: `${product.model} software`,
    intent: softwareIntent(product.slug),
    submitLabel: "Get software",
    downloadUrl: access?.downloadUrl,
    openUrl: access?.openUrl,
    openLabel: "Open software download",
  };
}

/**
 * Ungated series page: one button, a menu of per-variant PDFs. Plain anchors
 * with `download`, so each sheet saves under its own model name.
 */
function DirectSpecSheetMenu({ sheets }: { sheets: SpecSheetOption[] }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="lg"
        onClick={() => setOpen((v) => !v)}
        ariaLabel={open ? "Close spec sheet menu" : "Choose a spec sheet"}
      >
        <Download className="size-4" /> Spec sheet <ChevronDown className="size-4" aria-hidden />
      </Button>
      {open ? (
        <ul
          id={menuId}
          role="menu"
          className="absolute left-0 top-full z-20 mt-2 min-w-64 max-w-[calc(100vw-2rem)] rounded-md border border-border bg-bg p-1.5 shadow-lg"
        >
          {sheets.map((o) => (
            <li key={o.path} role="none">
              <a
                role="menuitem"
                href={o.path}
                download={o.filename}
                onClick={() => setOpen(false)}
                className="block rounded px-3 py-2 hover:bg-bg-muted focus-visible:outline-2"
              >
                <span className="block font-display text-sm font-bold text-text-strong">{o.model}</span>
                {o.note ? <span className="block text-xs leading-relaxed text-text-muted">{o.note}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ProductDownloadActions({
  product,
  robotTypes,
}: {
  product: Product;
  robotTypes: string[];
}) {
  const [gate, setGate] = useState<GateConfig | null>(null);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const hasSoftware = Boolean(softwareAccess(product));
  const direct = directSpecSheets(product);

  const close = useCallback(() => {
    setGate(null);
    openerRef.current?.focus();
  }, []);

  const open = useCallback((kind: ProductDownloadKind, button: HTMLButtonElement) => {
    openerRef.current = button;
    setGate(gateFor(product, kind));
  }, [product]);

  useEffect(() => {
    document.body.style.overflow = gate ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [gate]);

  useEffect(() => {
    if (!gate) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [gate, close]);

  return (
    <>
      {direct.length > 1 ? (
        <DirectSpecSheetMenu sheets={direct} />
      ) : direct.length === 1 ? (
        <Button variant="ghost" size="lg" href={direct[0].path} download={direct[0].filename}>
          <Download className="size-4" /> Spec sheet
        </Button>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={(e) => open("spec", e.currentTarget)}
        >
          <Download className="size-4" /> Spec sheet
        </Button>
      )}
      {hasSoftware ? (
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={(e) => open("software", e.currentTarget)}
        >
          <Download className="size-4" /> Software
        </Button>
      ) : null}

      {gate ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
          <button
            type="button"
            className="absolute inset-0 bg-mt-navy/70 backdrop-blur-[2px]"
            aria-label="Close download form"
            onClick={close}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-xl border border-border bg-bg shadow-2xl sm:rounded-xl"
          >
            <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-border bg-bg px-5 py-4">
              <h2 id={titleId} className="font-display text-h4 font-bold text-text-strong">
                {gate.title}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-md text-text-muted hover:bg-bg-muted focus-visible:outline-2"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="mb-4 text-sm text-text-muted">
                {gate.downloadOptions
                  ? "Pick the model, add quick details, then instant access — no waiting on an email."
                  : "Quick details, then instant access — no waiting on an email."}
              </p>
              <LeadForm
                key={gate.intent}
                intent={gate.intent}
                submitLabel={gate.submitLabel}
                mode="download"
                downloadUrl={gate.downloadUrl}
                downloadOptions={gate.downloadOptions}
                openUrl={gate.openUrl}
                openLabel={gate.openLabel}
                robotTypes={robotTypes}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
