import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Cta = { label: string; href: string };

export function CtaBand({
  eyebrow = "Ready when you are",
  title,
  body,
  primary,
  secondary,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  primary: Cta;
  secondary?: Cta;
}) {
  return (
    <section className="dark relative overflow-hidden bg-bg">
      <div className="circuit-motif pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <Container className="relative py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
          <h2 className="mt-4 font-display text-h2 font-extrabold text-text-strong">{title}</h2>
          {body ? <p className="mx-auto mt-4 max-w-2xl text-lead text-text-muted">{body}</p> : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={primary.href} variant="primary" size="lg">
              {primary.label}
            </Button>
            {secondary ? (
              <Button href={secondary.href} variant="ghost" size="lg">
                {secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
