import { NextRequest, NextResponse } from "next/server";

// Protege toda a dashboard com autenticação básica (usuário: admin).
// Sem DASHBOARD_PASSWORD configurada, o acesso fica liberado (útil em dev).
export function middleware(req: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD;
  if (!password) return NextResponse.next();

  // O endpoint de cron tem sua própria proteção via CRON_SECRET.
  if (req.nextUrl.pathname.startsWith("/api/cron/")) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      const sepIndex = decoded.indexOf(":");
      const user = decoded.slice(0, sepIndex);
      const pass = decoded.slice(sepIndex + 1);
      if (user === "admin" && pass === password) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Autenticação necessária", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="FB Ads Dashboard"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)"],
};
