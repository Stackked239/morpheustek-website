import Link from "next/link";
import { CalendarDays, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function TopBar({
  message,
  href,
  boothCta,
  phone,
  phoneHref,
}: {
  message: string;
  href: string;
  boothCta: string;
  phone: string;
  phoneHref: string;
}) {
  return (
    <div className="bg-accent text-accent-text">
      <Container className="flex h-9 items-center justify-between gap-4 text-xs font-semibold">
        <Link href={href} className="inline-flex min-w-0 items-center gap-2 hover:underline">
          <CalendarDays className="size-3.5 shrink-0" />
          <span className="truncate">{message}</span>
        </Link>
        <div className="hidden shrink-0 items-center gap-5 sm:flex">
          <a href={`tel:${phoneHref}`} className="inline-flex items-center gap-1.5 hover:underline">
            <Phone className="size-3.5" /> {phone}
          </a>
          <Link href={href} className="hover:underline">
            {boothCta}
          </Link>
        </div>
      </Container>
    </div>
  );
}
