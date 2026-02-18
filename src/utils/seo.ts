import { headers } from "next/headers";

/**
 * Extracts subdomain from the host header
 * Follows the same pattern used throughout the application
 */
export async function getSubdomainFromHeaders(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host");
  const parts = host ? host.split(".") : [];
  return parts.length >= 3 ? parts[0] : "prakash5555"; // Default fallback
}

/**
 * Generates dynamic base URL from host header or environment variable
 * Follows the same pattern used in layout.tsx generateMetadata
 */
export async function getDynamicBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host");

  // Use environment variable if available, otherwise construct from host
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (host) {
    const protocol = host.includes("localhost") ? "http" : "https";
    return `${protocol}://${host}`;
  }

  return "http://localhost:3000";
}

/**
 * Gets both subdomain and base URL in one call for efficiency
 */
export async function getSeoContext(): Promise<{
  subdomain: string;
  baseUrl: string;
}> {
  const headersList = await headers();
  const host = headersList.get("host");
  const parts = host ? host.split(".") : [];

  const subdomain = parts.length >= 3 ? parts[0] : "prakash5555";

  let baseUrl: string;
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (host) {
    const protocol = host.includes("localhost") ? "http" : "https";
    baseUrl = `${protocol}://${host}`;
  } else {
    baseUrl = "http://localhost:3000";
  }

  return { subdomain, baseUrl };
}
