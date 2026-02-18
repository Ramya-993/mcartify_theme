export const revalidate = 60; // seconds = 60 seconds
import { MetadataRoute } from "next";
import { AxiosFetcher } from "@/utils/axios";
import { headers } from "next/headers";

// Interface for sitemap entries
interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  alternates?: {
    languages?: {
      [lang: string]: string;
    };
  };
}

async function getSeoContext(): Promise<{
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

let cachedSitemap: MetadataRoute.Sitemap | null = null;
let lastGenerated = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (cachedSitemap && Date.now() - lastGenerated < CACHE_DURATION) {
    return cachedSitemap;
  }
  // Get dynamic subdomain and base URL from headers
  const { subdomain, baseUrl } = await getSeoContext();

  // Get host header for API requests
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Check if this is a dev environment
  const isDevEnvironment =
    host.includes(".dev.") ||
    host.includes("localhost") ||
    host.includes("127.0.0.1");

  console.log("🗺️ SERVER-SIDE: Using dynamic baseUrl for sitemap:", baseUrl);
  console.log(
    "🗺️ SERVER-SIDE: Using dynamic subdomain for sitemap:",
    subdomain
  );
  console.log("🗺️ SERVER-SIDE: Is dev environment:", isDevEnvironment);

  // Return empty sitemap for dev environments to prevent indexing
  if (isDevEnvironment) {
    console.log("🗺️ SERVER-SIDE: Blocking sitemap for dev environment");
    return [];
  }

  // Static pages with better SEO configuration
  const staticPages: SitemapEntry[] = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/aboutus`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/hot-deals`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/promotions`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
    {
      url: `${baseUrl}/refund-and-cancellation-policy`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 1,
    },
  ];

  try {
    // Fetch all products for sitemap using the correct API endpoint (POST /stores/products/list)
    console.log(
      "🗺️ SERVER-SIDE: Generating sitemap with product URLs using correct API"
    );
    const productsRes = await AxiosFetcher.post(
      `/stores/products/list`,
      {}, // Empty body to get all products
      {
        headers: {
          "x-store-host": host,
        },
      }
    );

    const productPages: SitemapEntry[] = [];
    const categoryPages: SitemapEntry[] = [];

    if (
      productsRes.data?.Status === 1 &&
      productsRes.data?.Products?.length > 0
    ) {
      // Create a set to track unique categories
      const uniqueCategories = new Set<string>();

      productsRes.data.Products.forEach(
        (product: {
          slug?: string;
          productStatus?: string;
          updatedAt?: string;
          category?: string;
          categorySlug?: string;
          variants?: Array<{
            variantId: number;
            stock?: number;
          }>;
        }) => {
          // Add product pages with variantId
          if (product.slug && product.productStatus === "published") {
            // If product has variants, create URL for each variant
            if (product.variants && product.variants.length > 0) {
              // Add primary product URL with first variant
              const firstVariant = product.variants[0];
              productPages.push({
                url: `${baseUrl}/products/${product.slug}?variantId=${firstVariant.variantId}`,
                lastModified: product.updatedAt || new Date(),
                changeFrequency: "always",
                priority: 1,
              });

              // Add additional variant URLs if there are multiple variants
              product.variants.slice(1).forEach((variant) => {
                if (variant.variantId) {
                  productPages.push({
                    url: `${baseUrl}/products/${product.slug}?variantId=${variant.variantId}`,
                    lastModified: product.updatedAt || new Date(),
                    changeFrequency: "always",
                    priority: 1, // Slightly lower priority for variant pages
                  });
                }
              });
            } else {
              // Fallback: Add product URL without variantId if no variants
              productPages.push({
                url: `${baseUrl}/products/${product.slug}`,
                lastModified: product.updatedAt || new Date(),
                changeFrequency: "always",
                priority: 1,
              });
            }
          }

          // Collect unique categories
          if (product.categorySlug) {
            uniqueCategories.add(product.categorySlug);
          }
        }
      );

      // Add category pages
      uniqueCategories.forEach((categorySlug) => {
        categoryPages.push({
          url: `${baseUrl}/products/category/${categorySlug}`,
          lastModified: new Date(),
          changeFrequency: "always",
          priority: 1,
        });
      });

      console.log(
        `🗺️ SERVER-SIDE: Added ${productPages.length} product URLs and ${categoryPages.length} category URLs to sitemap`
      );
    }

    // Try to fetch categories separately if available using dynamic subdomain
    try {
      const categoriesRes = await AxiosFetcher.get(
        `/stores/categories?subdomain=${subdomain}`
      );

      if (
        categoriesRes.data?.Status &&
        categoriesRes.data?.Categories?.length > 0
      ) {
        categoriesRes.data.Categories.forEach(
          (category: { slug?: string; updatedAt?: string }) => {
            if (category.slug) {
              // Check if not already added
              const categoryUrl = `${baseUrl}/products/category/${category.slug}`;
              if (!categoryPages.some((page) => page.url === categoryUrl)) {
                categoryPages.push({
                  url: categoryUrl,
                  lastModified: category.updatedAt || new Date(),
                  changeFrequency: "always",
                  priority: 1,
                });
              }
            }
          }
        );
      }
    } catch {
      console.log(
        "🗺️ Categories endpoint not available, using product categories only"
      );
    }

    const sitemapData = [...staticPages, ...productPages, ...categoryPages];
    cachedSitemap = sitemapData;
    lastGenerated = Date.now();
    return sitemapData;
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    // Return at least static pages if product fetch fails
    return staticPages;
  }
}
