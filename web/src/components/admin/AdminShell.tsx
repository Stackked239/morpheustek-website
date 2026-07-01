import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/site", label: "Site & nav" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/merch", label: "Merchandising" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/catalog/categories", label: "Categories" },
  { href: "/admin/catalog/applications", label: "Applications" },
  { href: "/admin/catalog/resources", label: "Resources" },
  { href: "/admin/content", label: "Pages & homepage" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-muted text-text">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-blue">
              MorpheusTEK CMS
            </p>
            <h1 className="font-display text-lg font-bold uppercase text-text-strong">Admin</h1>
          </div>
          <LogoutButton />
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-6 pb-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="shrink-0 rounded-md px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted transition hover:bg-bg hover:text-brand-blue"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
