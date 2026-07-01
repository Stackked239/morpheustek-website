"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="fixed top-4 right-4 z-50 rounded-md bg-mt-navy px-4 py-2 font-display text-xs font-bold uppercase text-white print:hidden"
    >
      Print / Save PDF
    </button>
  );
}
