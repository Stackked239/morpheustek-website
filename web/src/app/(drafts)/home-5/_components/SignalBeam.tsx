import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The signal chain as a live wiring diagram: three sensor nodes feed the edge
 * box, which feeds YOUR STACK. Dashes march along the wires (.beam-path) and
 * pulses ride each path via CSS offset-path — the same path data is reused for
 * the SVG wire and the pulse's motion path, so they can never drift apart.
 */

const wires = [
  { d: "M 120 60 C 250 60 280 150 400 150", from: "2D / 3D LiDAR" },
  { d: "M 120 150 C 220 150 280 150 400 150", from: "3D cameras" },
  { d: "M 120 240 C 250 240 280 150 400 150", from: "Safety scanner" },
] as const;

const outWire = "M 520 150 C 600 150 620 150 700 150";

export function SignalBeam() {
  return (
    <section className="border-y border-border bg-bg-subtle py-16 md:py-24">
      <Container>
        <Reveal>
          <h2 className="max-w-2xl font-display text-h2 font-bold text-text-strong">
            One wire diagram, sensor to stack.
          </h2>
          <p className="mt-4 max-w-2xl text-lead text-text-muted">
            We don&apos;t stop at the sensor. Cameras, LiDAR, and safety feed rugged edge compute —
            and arrive in your software as one integrated feed.
          </p>
        </Reveal>

        <Reveal className="mt-12">
          <figure aria-label="Diagram: LiDAR, cameras, and safety sensors connect to edge compute, which connects to your stack" className="relative">
            <svg viewBox="0 0 820 300" className="w-full">
              {/* wires */}
              {wires.map((w) => (
                <g key={w.d}>
                  <path d={w.d} fill="none" stroke="var(--border)" strokeWidth="1.5" />
                  <path d={w.d} fill="none" stroke="var(--brand-blue)" strokeWidth="1.5" className="beam-path" />
                </g>
              ))}
              <path d={outWire} fill="none" stroke="var(--border)" strokeWidth="1.5" />
              <path d={outWire} fill="none" stroke="var(--accent)" strokeWidth="1.5" className="beam-path" />

              {/* source nodes */}
              {wires.map((w, i) => (
                <g key={w.from} fontFamily="var(--font-mono)">
                  <rect x="8" y={36 + i * 90} width="112" height="48" rx="10" fill="var(--surface)" stroke="var(--border)" />
                  <text x="64" y={64 + i * 90} textAnchor="middle" fill="var(--text)" fontSize="11">
                    {w.from}
                  </text>
                </g>
              ))}

              {/* edge node */}
              <rect x="400" y="114" width="120" height="72" rx="12" fill="var(--surface-raised)" stroke="var(--border-strong)" strokeWidth="1.5" />
              <text x="460" y="145" textAnchor="middle" fill="var(--text-strong)" fontSize="12" fontWeight="bold" fontFamily="var(--font-mono)">
                iBOX-602P
              </text>
              <text x="460" y="164" textAnchor="middle" fill="var(--text-subtle)" fontSize="10" fontFamily="var(--font-mono)">
                Jetson Orin NX
              </text>

              {/* destination */}
              <rect x="700" y="118" width="112" height="64" rx="12" fill="var(--accent)" />
              <text x="756" y="155" textAnchor="middle" fill="var(--accent-text)" fontSize="12" fontWeight="bold" fontFamily="var(--font-mono)">
                YOUR STACK
              </text>

              {/* pulses ride the same path data via CSS offset-path — inside the
                  SVG so they live in viewBox units and scale with the wires */}
              {[...wires.map((w) => w.d), outWire].map((d, i) => (
                <circle
                  key={d}
                  r="4"
                  className="beam-pulse"
                  fill={i === wires.length ? "var(--accent)" : "var(--brand-blue)"}
                  style={{ offsetPath: `path('${d}')`, animationDelay: `${i * 0.8}s` }}
                />
              ))}
            </svg>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
