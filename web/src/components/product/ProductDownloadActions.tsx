"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import type { Product } from "@/lib/catalog";
import {
  specSheetAccess,
  specSheetIntent,
  softwareAccess,
  softwareIntent,
  type ProductDownloadKind,
} from "@/lib/product-downloads";
import { Button } from "@/components/ui/Button";
import { LeadForm } from "@/components/forms/LeadForm";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

type GateConfig = {
  kind: ProductDownloadKind;
  title: string;
  intent: string;
  submitLabel: string;
  downloadUrl?: string;
  openUrl?: string;
  openLabel?: string;
};

function gateFor(product: Product, kind: ProductDownloadKind): GateConfig {
  if (kind === "spec") {
    const access = specSheetAccess(product);
    return {
      kind,
      title: `${product.model} spec sheet`,
      intent: specSheetIntent(product.slug),
      submitLabel: "Download spec sheet",
      downloadUrl: access.downloadUrl,
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
      <Button
        type="button"
        variant="ghost"
        size="lg"
        onClick={(e) => open("spec", e.currentTarget)}
      >
        <Download className="size-4" /> Spec sheet
      </Button>
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
                Quick details, then instant access — no waiting on an email.
              </p>
              <LeadForm
                key={gate.intent}
                intent={gate.intent}
                submitLabel={gate.submitLabel}
                mode="download"
                downloadUrl={gate.downloadUrl}
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
