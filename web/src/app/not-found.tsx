import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { EyeMark } from "@/components/brand/EyeMark";

export default function NotFound() {
  return (
    <section className="dark relative isolate flex min-h-[70vh] items-center overflow-hidden bg-bg">
      <div className="circuit-motif pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <Container className="relative text-center">
        <div className="mx-auto mb-8 grid size-28 place-items-center">
          <EyeMark size={112} scanning className="text-text-strong" />
        </div>
        <Eyebrow className="justify-center">Error 404</Eyebrow>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold text-text-strong">
          This page is off our radar.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lead text-text-muted">
          The sensor came back empty. Let&apos;s get you back to something useful.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" variant="primary" size="lg">
            Back home
          </Button>
          <Button href="/products" variant="ghost" size="lg">
            Browse products
          </Button>
        </div>
      </Container>
    </section>
  );
}
