import type { Metadata } from "next";
import { Suspense } from "react";
import AdminLoginPage from "./AdminLoginClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading…</div>}>
      <AdminLoginPage />
    </Suspense>
  );
}
