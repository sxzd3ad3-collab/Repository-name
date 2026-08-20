import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-secret-change-me"
);

async function sessionFrom(req: NextRequest) {
  const token = req.cookies.get("msa_session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: String(payload.id || ""),
      role: payload.role === "ADMIN" ? "ADMIN" : "STUDENT",
    };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await sessionFrom(req);

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    if (session.role !== "ADMIN") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
      }
      return NextResponse.redirect(new URL("/student", req.url));
    }
  }

  if (pathname.startsWith("/student") || pathname.startsWith("/api/student")) {
    if (!session) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "يجب تسجيل الدخول" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/api/admin/:path*", "/api/student/:path*"],
};
