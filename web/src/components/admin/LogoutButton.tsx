"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-text-muted hover:text-brand-blue"
    >
      Log out
    </button>
  );
}
