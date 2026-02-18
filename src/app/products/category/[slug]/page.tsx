import Breadcrumb from "@/components/ui/breadcrumbs";
import ProductResponse, { IProductResponse } from "@/types/productListResponse";
import { AxiosFetcher } from "@/utils/axios";
import React from "react";
import DynamicProductWrapper from "@/components/dynamic/DynamicProductWrapper";
import GeolocationProvider from "@/components/GeolocationProvider";
import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import Head from "next/head";
import { getSeoContext } from "@/utils/seo";

// Server-side Props interface
interface CategoryProductPageProps {
  params: { slug: string };
  searchParams: { subcategory?: string };
}

// Note: LoadingSpinner removed as not needed in server component

// Generate metadata for SEO
export async function generateMetadata(
  { params, searchParams }: CategoryProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const { subcategory } = await searchParams;

  console.log("🌐 SERVER-SIDE: generateMetadata executing for category:", slug);

  const headersList = await headers();
  const host = headersList.get("host");

  try {
    // Prepare API request params
    const apiParams: { category: string; subcategoryId?: string | number } = {
      category: slug,
    };
    if (subcategory) {
      apiParams.subcategoryId = subcategory;
    }

    const res = await AxiosFetcher.post<ProductResponse>(
      `/stores/products/list`,
      apiParams,
      {
        headers: {
          "x-store-host": host,
        },
      }
    );

    if (
      res.data.Status === 1 &&
      res.data.Products &&
      res.data.Products.length > 0
    ) {
      const categoryName = res.data.Products[0]?.categoryName || "Products";
      const subcategoryName =
        subcategory && res.data.Products[0]?.subcategoryName
          ? res.data.Products[0].subcategoryName
          : "";

      const title = subcategoryName
        ? `${subcategoryName} - ${categoryName} | Shop Online`
        : `${categoryName} | Shop Online`;

      const description = subcategoryName
        ? `Browse our collection of ${subcategoryName} in ${categoryName}. Find the best products with great prices and fast delivery.`
        : `Explore our wide range of ${categoryName}. Quality products, competitive prices, and excellent customer service.`;

      // Get the first product image for Open Graph
      const firstProductImage = res.data.Products[0]?.imageURL;
      const ogImage = firstProductImage || "/default-category-image.png";

      const parentImages = (await parent).openGraph?.images;
      const parentImageUrl = parentImages?.[0]
        ? typeof parentImages[0] === "string"
          ? parentImages[0]
          : parentImages[0] instanceof URL
          ? parentImages[0].href
          : typeof parentImages[0] === "object" && parentImages[0]?.url
          ? parentImages[0].url instanceof URL
            ? parentImages[0].url.href
            : parentImages[0].url.toString()
          : "/default-og-image.png"
        : "/default-og-image.png";

      const imageUrl = ogImage || parentImageUrl;

      return {
        title,
        description,
        keywords: `${categoryName}, ${subcategoryName}, online shopping, ecommerce`,
        openGraph: {
          title,
          description,
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: `${categoryName} ${subcategoryName} products`,
            },
          ],
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [imageUrl],
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
        alternates: {
          canonical: `/products/category/${slug}${
            subcategory ? `?subcategory=${subcategory}` : ""
          }`,
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata for category page:", error);
  }

  // Fallback metadata
  const fallbackTitle = `${
    slug.charAt(0).toUpperCase() + slug.slice(1)
  } | Shop Online`;
  return {
    title: fallbackTitle,
    description: `Browse our collection of ${slug} products. Quality items at great prices.`,
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Server-side data fetching function
async function fetchCategoryProducts(
  categorySlug: string,
  subcategory?: string
): Promise<{ products: IProductResponse | null; error: string | null }> {
  if (!categorySlug) {
    return { products: null, error: "Category not found" };
  }

  const headersList = await headers();
  const host = headersList.get("host");

  try {
    const apiParams: { category: string; subcategoryId?: string | number } = {
      category: categorySlug,
    };
    if (subcategory) {
      apiParams.subcategoryId = subcategory;
    }

    const res = await AxiosFetcher.post<ProductResponse>(
      `/stores/products/list`,
      apiParams,
      {
        headers: {
          "x-store-host": host,
        },
      }
    );

    if (res.data.Status === 1) {
      return { products: res.data, error: null };
    } else {
      return { products: null, error: "Failed to fetch products" };
    }
  } catch (error) {
    console.error("Error fetching category products:", error);
    return {
      products: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Generate structured data for SEO
function generateStructuredData(
  products: IProductResponse,
  categorySlug: string,
  subcategory?: string
) {
  if (!products.Products || products.Products.length === 0) return null;

  const categoryName = products.Products[0]?.categoryName || "Products";
  const subcategoryName =
    subcategory && products.Products[0]?.subcategoryName
      ? products.Products[0].subcategoryName
      : "";

  const itemListElements = products.Products.slice(0, 10).map(
    (product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description || "",
        image: product.imageURL || "",
        url: `/products/${product.productId}`,
        offers: {
          "@type": "Offer",
          price:
            product.variants?.[0]?.offerPrice ||
            product.variants?.[0]?.basePrice ||
            0,
          priceCurrency: "INR",
          availability:
            product.variants?.[0]?.stock > 0 ? "InStock" : "OutOfStock",
        },
        brand: {
          "@type": "Brand",
          name: "Store Brand",
        },
      },
    })
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: subcategoryName
      ? `${subcategoryName} - ${categoryName}`
      : categoryName,
    description: `Collection of ${categoryName} products${
      subcategoryName ? ` in ${subcategoryName}` : ""
    }`,
    numberOfItems: products.Products.length,
    itemListElement: itemListElements,
  };
}

// Main server component
const CategoryProductPage = async ({
  params,
  searchParams,
}: CategoryProductPageProps) => {
  const { baseUrl } = await getSeoContext();
  console.log(
    "🌐 SERVER-SIDE: CategoryProductPage component executing on server"
  );

  const { slug: categorySlug } = await params;
  const { subcategory } = await searchParams;

  console.log(
    "🌐 SERVER-SIDE: categorySlug:",
    categorySlug,
    "subcategory:",
    subcategory
  );

  // Server-side data fetching
  const { products, error } = await fetchCategoryProducts(
    categorySlug,
    subcategory
  );

  if (error) {
    return (
      <div className="container mx-auto md:px-10 px-0">
        <Breadcrumb
          className="md:px-0 px-2"
          crumbItems={[
            { href: "/", label: "Home", isCurrent: false, isDisabled: false },
            {
              href: `/products/category/${categorySlug}`,
              label:
                categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
              isCurrent: true,
              isDisabled: false,
            },
          ]}
        />
        <div className="text-center py-10">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!products || !products.Products || products.Products.length === 0) {
    return (
      <div className="container mx-auto md:px-10 px-0">
        <Breadcrumb
          className="md:px-0 px-2"
          crumbItems={[
            { href: "/", label: "Home", isCurrent: false, isDisabled: false },
            {
              href: `/products/category/${categorySlug}`,
              label:
                categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
              isCurrent: true,
              isDisabled: false,
            },
          ]}
        />
        <div className="text-center py-10">
          <p>No products found in this category.</p>
        </div>
      </div>
    );
  }

  const categoryName = products.Products[0]?.categoryName || "All Products";
  const subcategoryName =
    subcategory && products.Products[0]?.subcategoryName
      ? products.Products[0].subcategoryName
      : "";

  const structuredData = generateStructuredData(
    products,
    categorySlug,
    subcategory
  );

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={`${baseUrl}/products/category/${categorySlug}${
            subcategory ? `?subcategory=${subcategory}` : ""
          }`}
        />
      </Head>
      {/* Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      <GeolocationProvider autoFetch={true}>
        <div className="">
          <div className="container mx-auto md:px-10 px-0">
            <Breadcrumb
              className="md:px-0 px-2"
              crumbItems={[
                {
                  href: "/",
                  label: "Home",
                  isCurrent: false,
                  isDisabled: false,
                },
                {
                  href: `/products/category/${categorySlug}`,
                  label: categoryName,
                  isCurrent: subcategory ? false : true,
                  isDisabled: false,
                },
                ...(!subcategory
                  ? []
                  : [
                      {
                        href: `/products/category/${categorySlug}?subcategory=${subcategory}`,
                        label: subcategoryName || "Subcategory",
                        isCurrent: true,
                        isDisabled: false,
                      },
                    ]),
              ]}
            />

            {/* SEO-friendly heading */}
            <div className="md:px-0 px-2 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {subcategoryName
                  ? `${subcategoryName} - ${categoryName}`
                  : categoryName}
              </h1>
              <p className="text-gray-600">
                {subcategoryName
                  ? `Discover our collection of ${subcategoryName} in ${categoryName}`
                  : `Browse our wide range of ${categoryName} products`}
                {` (${products.Products.length} products)`}
              </p>
            </div>

            <div className="md:mt-6 mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-4 gap-3 pb-10 md:px-0 px-2">
              {products.Products.map((product) => (
                <DynamicProductWrapper
                  product={product}
                  key={product.productId}
                />
              ))}
            </div>
          </div>
        </div>
      </GeolocationProvider>
    </>
  );
};

export default CategoryProductPage;
