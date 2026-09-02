import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "mt_admin_session";

async function isAuthed(request: NextRequest) {
  const token = request.cookies.get(COOKIE)?.value;
  if (!token) return false;
  const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

/**
 * Keep non-canonical hosts out of search indexes. The production site is
 * www.morpheustek.com, but the Vercel deployment is also reachable at
 * *.vercel.app (production alias + preview builds). Serving those hosts with
 * `X-Robots-Tag: noindex` prevents duplicate indexing while keeping preview
 * deployments fully accessible for review (a blanket redirect would break them).
 */
function isNonCanonicalHost(request: NextRequest): boolean {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  return host.endsWith(".vercel.app");
}

function withNoindex(request: NextRequest, response: NextResponse): NextResponse {
  if (isNonCanonicalHost(request)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    if (await isAuthed(request)) {
      return withNoindex(request, NextResponse.redirect(new URL("/admin", request.url)));
    }
    return withNoindex(request, NextResponse.next());
  }

  if (pathname.startsWith("/admin")) {
    if (!(await isAuthed(request))) {
      const login = new URL("/admin/login", request.url);
      login.searchParams.set("next", pathname);
      return withNoindex(request, NextResponse.redirect(login));
    }
  }

  return withNoindex(request, NextResponse.next());
}

export const config = {
  // Run on all pages so non-canonical hosts get noindex, but skip Next internals
  // and static assets to keep the middleware cheap.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
