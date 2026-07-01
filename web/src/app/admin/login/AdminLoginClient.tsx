"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Wrong password.");
      return;
    }
    router.push(search.get("next") || "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-muted px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-lg">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-brand-blue">MorpheusTEK</p>
        <h1 className="mt-2 font-display text-2xl font-bold uppercase text-text-strong">Admin login</h1>
        <p className="mt-2 text-sm text-text-muted">Enter the site admin password to edit content.</p>
        <label className="mt-6 block">
          <span className="mb-1.5 block font-mono text-xs font-bold uppercase tracking-[0.1em] text-text-muted">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus:border-border-strong focus-visible:ring-2 focus-visible:ring-brand-blue/40"
            autoComplete="current-password"
            required
          />
        </label>
        {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-brand-blue py-2.5 font-mono text-xs font-bold uppercase tracking-[0.12em] text-bg disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
