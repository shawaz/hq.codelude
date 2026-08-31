import { NextResponse } from "next/server";
import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

/**
 * Server components cannot read their own pathname, so we stamp it on a request
 * header here. The dashboard layout reads it back to run the per-page access
 * guard — see src/app/dashboard/layout.tsx.
 */
export const PATHNAME_HEADER = "x-hq-pathname";

// /api/leads is the public intake for website + social lead forms, so it must
// stay reachable without a session — everything else stays behind auth.
const isPublicRoute = createRouteMatcher([
  "/login",
  "/api/auth(.*)",
  "/api/leads",
]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  if (isPublicRoute(request)) {
    if (request.nextUrl.pathname === "/login" && (await convexAuth.isAuthenticated())) {
      return nextjsMiddlewareRedirect(request, "/dashboard");
    }
    return;
  }

  if (!(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/login");
  }

  const headers = new Headers(request.headers);
  headers.set(PATHNAME_HEADER, request.nextUrl.pathname);
  return NextResponse.next({ request: { headers } });
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
