import Link from "next/link";
import { CalendarDays, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

/** Yellow utility bar above the nav (brand: navy on PMS 116 yellow). Shows the
 *  next-show announcement + contact; scrolls away while the nav stays sticky. */
export function TopBar() {
  return (
    <div className="bg-accent text-accent-text">
      <Container className="flex h-9 items-center justify-between gap-4 text-xs font-semibold">
        <Link href="/shows/meet-us-at-the-booth" className="inline-flex min-w-0 items-center gap-2 hover:underline">
          <CalendarDays className="size-3.5 shrink-0" />
          <span className="truncate">Catch us at Automate — June 22, Chicago</span>
        </Link>
        <div className="hidden shrink-0 items-center gap-5 sm:flex">
          <a href={`tel:${site.phoneHref}`} className="inline-flex items-center gap-1.5 hover:underline">
            <Phone className="size-3.5" /> {site.phone}
          </a>
          <Link href="/shows/meet-us-at-the-booth" className="hover:underline">
            Meet us at the booth →
          </Link>
        </div>
      </Container>
    </div>
  );
}
