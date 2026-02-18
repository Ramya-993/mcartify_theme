import React, { Suspense } from "react";
import DynamicBannersWrapper from "@/components/dynamic/DynamicBannersWrapper";
import DynamicFeaturedCategoriesWrapper from "@/components/dynamic/DynamicFeaturedCategoriesWrapper";
import DynamicTopSellingProductsWrapper from "@/components/dynamic/DynamicTopSellingProductsWrapper";
import DynamicTestimonialsWrapper from "@/components/dynamic/DynamicTestimonialsWrapper";
import DynamicHeroWrapper from "@/components/dynamic/DynamicHeroWrapper";
import Loading from "./loading";
import { AxiosFetcher } from "@/utils/axios";
import { headers } from "next/headers";
import type { Metadata } from "next";
import DynamicCustomSectionWrapper from "@/components/dynamic/DynamicCustomSectionWrapper";

// Types for homepage configuration
interface HomepageSection {
  id: string;
  type: string;
  component: string;
  enabled: boolean;
  order: number;
  config: Record<string, unknown>;
}

interface HomepageConfig {
  layout: {
    sections: HomepageSection[];
  };
  theme: {
    spacing: {
      sectionGap: string;
      containerPadding: string;
    };
    layout: {
      maxWidth: string;
      centerContent: boolean;
    };
  };
}

// Server-side fetch store data for homepage configuration
async function getStoreData() {
  const headersList = await headers();
  const host = headersList.get("host");
  const parts = host ? host.split(".") : [];
  const subdomain = parts.length >= 3 ? parts[0] : "prakash5555";

  try {
    const response = await AxiosFetcher.get(
      `stores/info?channelType=1&subdomain=${subdomain}`,
      {
        headers: {
          "x-store-host": host,
        },
      }
    );
    return response?.data;
  } catch (error) {
    console.error("Error fetching store data for homepage:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const storeData = await getStoreData();

  if (!storeData || storeData.Status !== 1) {
    return {
      title: "Store Unavailable",
      description: "This store is currently unavailable.",
    };
  }

  const title = storeData.Channels?.title || "mCartify Store";
  const description =
    storeData.Channels?.description || "Your favorite items delivered fast.";
  const logoUrl = storeData.Store?.logo;

  return {
    title,
    description,
    keywords:
      storeData.Channels?.keywords?.split(",").map((k: string) => k.trim()) ||
      [],
    openGraph: {
      title,
      description,
      images: logoUrl ? [{ url: logoUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: logoUrl ? [logoUrl] : [],
    },
  };
}

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

// Component mapping by type - now server-side friendly
const componentMap = {
  banners: DynamicBannersWrapper,
  featuredCategories: DynamicFeaturedCategoriesWrapper,
  topSellingProducts: DynamicTopSellingProductsWrapper,
  testimonials: DynamicTestimonialsWrapper,
  hero: DynamicHeroWrapper,
  customSection: DynamicCustomSectionWrapper,
};

// Server component - renders initial content for crawlers
const HomePage = async () => {
  console.log("🌐 SERVER-SIDE: HomePage executing on server for SEO");

  // Get store data server-side for initial render
  const storeData = await getStoreData();
  console.log("🌐 SERVER-SIDE: Store data:", storeData);

  // Use custom layout from store data
  const homepageConfig: HomepageConfig = storeData?.CustomLayout;
  const sections = homepageConfig?.layout?.sections;

  // Sort and filter enabled sections for SSR
  const enabledSections = sections
    .filter((section: HomepageSection) => section.enabled)
    .sort((a: HomepageSection, b: HomepageSection) => a.order - b.order);

  console.log(
    "🌐 SERVER-SIDE: Rendering sections for crawlers:",
    enabledSections.length
  );

  return (
    <Suspense fallback={<Loading />}>
      <div>
        {/* SEO-friendly structured content for crawlers */}
        <main role="main">
          {enabledSections.map((section: HomepageSection, index: number) => {
            const Component =
              componentMap[section.type as keyof typeof componentMap];

            console.log(
              `🌐 SERVER-SIDE: Processing section ${index + 1}/${
                enabledSections.length
              }:`,
              {
                type: section.type,
                id: section.id,
                order: section.order,
                hasComponent: !!Component,
              }
            );

            if (!Component) {
              console.warn(
                `⚠️ No component found for section type: ${section.type}`
              );
              return null;
            }

            return (
              <section
                key={section.id}
                id={section.id}
                aria-label={`${section.type} section`}
              >
                <Suspense fallback={<LoadingSpinner />}>
                  <Component config={section.config} />
                </Suspense>
              </section>
            );
          })}
        </main>

        {/* Structured data for SEO */}
        {storeData && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Store",
                name: storeData.Store?.storeName,
                description: storeData.Channels?.description,
                url: storeData.Store?.domain,
                logo: storeData.Store?.logo,
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "IN",
                },
              }),
            }}
          />
        )}
      </div>
    </Suspense>
  );
};

export default HomePage;
