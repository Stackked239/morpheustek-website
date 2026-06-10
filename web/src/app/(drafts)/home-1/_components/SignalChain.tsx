import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";
import { ClauseHeader } from "./ClauseHeader";

/* §04 — The Signal Chain
   A block diagram of the perception pipeline, terminating at YOUR STACK —
   the visitor's system is the last node. Each stage is a real product and
   each interface label is a real port (catalog.ts / OLEI datasheet).
   Horizontal on desktop, vertical on mobile. Hairline boxes, mono labels. */

const chain = [
  { role: "Sense", model: "LR-1F", detail: "360° 2D LiDAR · navigation", port: "Ethernet" },
  { role: "Protect", model: "GS1-5", detail: "Safety stop function", port: "OSSD 1/2 · dual-channel" },
  { role: "Perceive", model: "S10", detail: "dToF RGBD · sees black + reflective", port: "Ethernet" },
  { role: "Compute", model: "iBOX-602P", detail: "Jetson Orin NX · IP66 fanless", port: "2× PoE + 2× GMSL-2" },
] as const;

export function SignalChain() {
  return (
    <section className="bg-bg py-24 md:py-28">
      <Container wide>
        <ClauseHeader
          index="04"
          eyebrow="Full-stack perception"
          title="One supplier. The whole signal chain."
          lead={site.differentiator}
        />

        <div className="mt-14 flex flex-col lg:flex-row lg:items-stretch">
          {chain.map((node) => (
            <div key={node.model} className="flex flex-col lg:flex-1 lg:flex-row lg:items-stretch">
              <div className="flex flex-1 flex-col border border-border p-5">
                <p className="font-mono text-anno-sm uppercase text-brand-blue">{node.role}</p>
                <p className="mt-2 font-display-industrial text-h4 font-bold uppercase text-text-strong">
                  {node.model}
                </p>
                <p className="mt-1 flex-1 text-sm text-text-muted">{node.detail}</p>
                <p className="mt-3 border-t border-border pt-2 font-mono text-anno-sm uppercase text-text-muted">
                  {node.port}
                </p>
              </div>
              {/* connector */}
              <div
                aria-hidden
                className="mx-auto h-6 border-l border-line-ink lg:mx-0 lg:h-px lg:w-8 lg:self-center lg:border-l-0 lg:border-t"
              />
            </div>
          ))}
          {/* the terminal node — the visitor's system */}
          <div className="flex flex-col border border-border-strong bg-bg-subtle p-5 lg:flex-1">
            <p className="font-mono text-anno-sm uppercase text-brand-blue">Act</p>
            <p className="mt-2 font-display-industrial text-h4 font-bold uppercase text-text-strong">
              Your stack
            </p>
            <p className="mt-1 flex-1 text-sm text-text-muted">Your robot, your software</p>
            <p className="mt-3 border-t border-border pt-2 font-mono text-anno-sm uppercase text-text-muted">
              ROS 1 / ROS 2 · C/C++ SDK
            </p>
          </div>
        </div>

        <Link
          href="/full-stack-perception"
          className="mt-10 inline-block font-semibold text-brand-blue underline-offset-4 hover:underline"
        >
          Explore full-stack perception →
        </Link>
      </Container>
    </section>
  );
}
