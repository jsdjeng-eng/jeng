import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 renamed the `middleware.ts` convention to `proxy.ts`. The exported
 * function must be named `proxy` (or be the default export).
 *
 * Route categories:
 *   • Protected:   /dashboard/**   -> requires session + verified email
 *   • Auth pages:  /auth/signin, /auth/signup -> redirect signed-in users home
 *   • Verify:      /auth/verify-email         -> requires session, must NOT be verified
 *
 * We rely on Better Auth's session cookie. We do a lightweight cookie check
 * for fast paths, then verify the session against `/api/auth/get-session`
 * when we need the user's verification status. The
 * `/api/auth/get-session` endpoint is excluded from rate limiting (see
 * `lib/auth.ts`).
 */

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_PAGES = new Set(["/auth/signin", "/auth/signup"]);
const VERIFY_PAGE = "/auth/verify-email";

// Better Auth's session cookie name varies based on `useSecureCookies`. In
// production it's prefixed with `__Secure-`.
const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

function getSessionCookie(request: NextRequest): string | null {
  for (const name of SESSION_COOKIE_NAMES) {
    const cookie = request.cookies.get(name);
    if (cookie?.value) return cookie.value;
  }
  return null;
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function deleteAllSessionCookies(response: NextResponse): NextResponse {
  for (const name of SESSION_COOKIE_NAMES) {
    response.cookies.delete(name);
  }
  return response;
}

type SessionResponse = {
  user?: {
    emailVerified?: boolean;
  };
} | null;

async function fetchSession(request: NextRequest): Promise<SessionResponse> {
  try {
    const url = new URL("/api/auth/get-session", request.url);
    const res = await fetch(url, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
      // Session cookies should never be cached at the edge.
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as SessionResponse;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = getSessionCookie(request);
  const protectedPath = isProtectedPath(pathname);
  const isAuthPage = AUTH_PAGES.has(pathname);
  const isVerifyPage = pathname === VERIFY_PAGE;

  // No cookie at all -> only allow public + auth pages
  if (!sessionCookie) {
    if (protectedPath || isVerifyPage) {
      const signinUrl = new URL("/auth/signin", request.url);
      signinUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signinUrl);
    }
    return NextResponse.next();
  }

  // Has cookie -> resolve the actual session to get verification status.
  const session = await fetchSession(request);

  if (!session?.user) {
    // Cookie is stale -> delete it.
    if (protectedPath || isVerifyPage) {
      const signinUrl = new URL("/auth/signin", request.url);
      signinUrl.searchParams.set("redirect", pathname);
      return deleteAllSessionCookies(NextResponse.redirect(signinUrl));
    }
    return deleteAllSessionCookies(NextResponse.next());
  }

  const verified = session.user.emailVerified === true;

  if (!verified && !isVerifyPage) {
    return NextResponse.redirect(new URL(VERIFY_PAGE, request.url));
  }

  if (verified && isVerifyPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (verified && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API routes and Next.js internals so we don't
  // intercept the session lookup that this proxy itself depends on.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
