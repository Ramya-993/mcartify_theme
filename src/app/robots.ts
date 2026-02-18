import { MetadataRoute } from "next";
import { getDynamicBaseUrl } from "@/utils/seo";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Get dynamic base URL from headers
  const baseUrl = await getDynamicBaseUrl();
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Check if this is a dev environment
  const isDevEnvironment =
    host.includes(".dev.") ||
    host.includes("localhost") ||
    host.includes("127.0.0.1");

  console.log("🤖 SERVER-SIDE: Using dynamic baseUrl for robots.txt:", baseUrl);
  console.log("🤖 SERVER-SIDE: Is dev environment:", isDevEnvironment);

  // Block all crawling for dev environments
  if (isDevEnvironment) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  // Allow crawling for production environments
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
