import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of known crawler user agents
const crawlerUserAgents = [
  "googlebot",
  "bingbot",
  "slurp",
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "applebot",
  "screaming frog",
  "ahrefsbot",
  "semrushbot",
  "dotbot",
  "mj12bot",
  "rogerbot",
  "pingdom",
  "uptimerobot",
];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const isCrawler = crawlerUserAgents.some((bot) => userAgent.includes(bot));

  // Clone the request headers
  const requestHeaders = new Headers(request.headers);

  // Add crawler detection header
  if (isCrawler) {
    requestHeaders.set("x-is-crawler", "true");
    console.log(`🤖 Crawler detected: ${userAgent}`);
  }

  // For crawlers, ensure we don't block any important resources
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Add cache headers for static content when accessed by crawlers
  if (isCrawler) {
    const pathname = request.nextUrl.pathname;

    // For static pages, add cache headers
    if (
      pathname === "/" ||
      pathname.startsWith("/products") ||
      pathname.startsWith("/categories") ||
      pathname.startsWith("/aboutus") ||
      pathname.startsWith("/contact-us")
    ) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=3600, s-maxage=3600"
      );
    }

    // Ensure crawlers can access the site
    response.headers.set("X-Robots-Tag", "index, follow");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
