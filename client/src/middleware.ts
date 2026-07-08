import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/signin", "/signup", "/forgot-password", "/reset-password"]);
const PROTECTED_PREFIXES = ["/admin", "/dashboard", "/listings", "/insights", "/predict", "/profile"];

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.has(pathname);
}

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function dashboardFor(role?: string) {
  return role === "admin" || role === "agent" ? "/admin" : "/profile";
}

function tokenIsFresh(token?: string) {
  if (!token) return false;
  try {
    const payloadSegment = token.split(".")[1] || "";
    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch (_error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("rezox-access-token")?.value;
  const hasRefresh = request.cookies.get("rezox-refresh-token-present")?.value === "1";
  const role = request.cookies.get("rezox-role")?.value;
  const authenticated = tokenIsFresh(token) || hasRefresh;

  if (isProtectedPath(pathname) && !authenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if ((pathname === "/signin" || pathname === "/signup") && authenticated) {
    const url = request.nextUrl.clone();
    url.pathname = dashboardFor(role);
    url.search = "";
    return NextResponse.redirect(url);
  }

  if ((pathname === "/admin" || pathname.startsWith("/admin/")) && authenticated && role !== "admin" && role !== "agent") {
    const url = request.nextUrl.clone();
    url.pathname = "/profile";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (!isPublicPath(pathname) && !isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
