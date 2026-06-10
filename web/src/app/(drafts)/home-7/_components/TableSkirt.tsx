import Image from "next/image";
import { site } from "@/lib/site";
import { CircuitTraces } from "./CircuitTraces";

/**
 * The table skirt: the lit yellow drape with one white trace run and both
 * wordmarks, closing the page the way the fabric closes the booth. The lockup
 * stays below the headline's register — one display moment per page.
 */
export function TableSkirt() {
  return (
    <section>
      <div className="booth-light booth-grain relative overflow-hidden border-t border-mt-navy/15 px-8 py-5 text-mt-navy md:px-14">
        <CircuitTraces light className="absolute inset-x-0 -bottom-24 -z-0 h-auto w-full opacity-70" />

        <div className="relative flex flex-wrap items-center justify-between gap-8">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <p className="flex items-center gap-2 font-display text-h4 font-bold tracking-tight">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rotate-45 bg-mt-red" />
              OLEI
            </p>
            <span aria-hidden className="hidden h-8 w-px bg-mt-navy/30 sm:block" />
            <Image
              src="/brand/morpheustek-logo.png"
              alt="morpheusTEK"
              width={210}
              height={48}
              className="h-8 w-auto"
            />
          </div>
          <div className="text-right">
            <p className="font-mono text-anno-sm font-bold uppercase tracking-[0.16em]">
              {site.distributor}
            </p>
            <p className="mt-1 font-mono text-anno-sm uppercase tracking-[0.16em] opacity-75">
              {site.phone} · {site.email}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
