import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

/**
 * The differentiator sentence inks itself in as it crosses the viewport —
 * a CSS scroll-driven animation (animation-timeline: view()), no JS. Browsers
 * without support (and reduced-motion users) read it fully inked.
 */
export function WordFillManifesto() {
  return (
    <section className="py-24 md:py-36">
      <Container>
        <p className="eyebrow">Why MorpheusTEK</p>
        <p className="wordfill mt-6 max-w-4xl font-display text-h1 font-bold leading-[1.12]">
          {site.differentiator}
        </p>
      </Container>
    </section>
  );
}
