import Breadcrumb from "@/components/ui/breadcrumbs";
import ProductResponse, { IProductResponse } from "@/types/productListResponse";
import { AxiosFetcher } from "@/utils/axios";
import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import ClientProductsWrapper from "@/components/dynamic/ClientProductsWrapper";
import GeolocationProvider from "@/components/GeolocationProvider";
// DynamicProductWrapper removed as not needed

// Server-side Props interface
interface ProductPageProps {
  searchParams: { category?: string; subcategory?: string };
}

// Generate metadata for SEO
export async function generateMetadata(
  { searchParams }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { category, subcategory } = await searchParams;

  console.log("🌐 SERVER-SIDE: generateMetadata executing for products page");

  const headersList = await headers();
  const host = headersList.get("host");

  let title = "All Products | Shop Online";
  let description =
    "Browse our complete collection of products. Quality items at great prices with fast delivery.";

  if (category || subcategory) {
    try {
      let params: { categoryId?: string; subcategoryId?: string } = {};
      if (category) {
        params = { ...params, categoryId: category };
      }
      if (subcategory) {
        params = { ...params, subcategoryId: subcategory };
      }

      const res = await AxiosFetcher.post<ProductResponse>(
        `/stores/products/list`,
        params,
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

        title = subcategoryName
          ? `${subcategoryName} - ${categoryName} | Shop Online`
          : `${categoryName} | Shop Online`;

        description = subcategoryName
          ? `Browse our collection of ${subcategoryName} in ${categoryName}. Find the best products with great prices and fast delivery.`
          : `Explore our wide range of ${categoryName}. Quality products, competitive prices, and excellent customer service.`;
      }
    } catch (error) {
      console.error("Error generating metadata for products page:", error);
    }
  }

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

  return {
    title,
    description,
    keywords: "products, online shopping, ecommerce, quality products",
    openGraph: {
      title,
      description,
      images: [
        {
          url: parentImageUrl,
          width: 1200,
          height: 630,
          alt: "Products collection",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [parentImageUrl],
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
      canonical: "/products",
    },
  };
}

// Server-side data fetching function
async function fetchProducts(
  category?: string,
  subcategory?: string
): Promise<{ products: IProductResponse | null; error: string | null }> {
  const headersList = await headers();
  const host = headersList.get("host");

  try {
    let params: { categoryId?: string; subcategoryId?: string } = {};

    if (category || subcategory) {
      if (category) {
        params = { ...params, categoryId: category };
      }
      if (subcategory) {
        params = { ...params, subcategoryId: subcategory };
      }

      const res = await AxiosFetcher.post<ProductResponse>(
        `/stores/products/list`,
        params,
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
    } else {
      // Fetch all products
      const res = await AxiosFetcher.post<ProductResponse>(
        `/stores/products/list`,
        {},
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
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      products: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Generate structured data for SEO
function generateStructuredData(products: IProductResponse) {
  if (!products.Products || products.Products.length === 0) return null;

  const itemListElements = products.Products.slice(0, 20).map(
    (product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.name,
        description: product.description || "",
        image: product.imageURL || "",
        url: `/products/${product.slug}`,
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
    name: "Products Collection",
    description: "Complete collection of quality products",
    numberOfItems: products.Products.length,
    itemListElement: itemListElements,
  };
}

// Client-side Product Wrapper Component moved to separate file

// Main server component
const ProductPage = async ({ searchParams }: ProductPageProps) => {
  console.log("🌐 SERVER-SIDE: ProductPage component executing on server");

  const { category, subcategory } = await searchParams;

  console.log(
    "🌐 SERVER-SIDE: category:",
    category,
    "subcategory:",
    subcategory
  );

  // Server-side data fetching
  const { products, error } = await fetchProducts(category, subcategory);

  if (error) {
    return (
      <div className="container mx-auto md:px-10 px-0">
        <Breadcrumb
          className="md:px-0 px-2"
          crumbItems={[
            { href: "/", label: "Home", isCurrent: false, isDisabled: false },
            {
              href: "/products",
              label: "All Products",
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
              href: "/products",
              label: "All Products",
              isCurrent: true,
              isDisabled: false,
            },
          ]}
        />
        <div className="text-center py-10">
          <p>No products found.</p>
        </div>
      </div>
    );
  }

  const structuredData = generateStructuredData(products);

  return (
    <>
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
                  href: "/products",
                  label: "All Products",
                  isCurrent: true,
                  isDisabled: false,
                },
              ]}
            />

            {/* SEO-friendly heading */}
            <div className="md:px-0 px-2 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                All Products
              </h1>
              <p className="text-gray-600">
                Discover our complete collection of quality products (
                {products.Products.length} products)
              </p>
            </div>

            <div className="md:mt-6 mt-2 pb-10 md:px-0 px-2">
              <ClientProductsWrapper products={products} />
            </div>
          </div>
        </div>
      </GeolocationProvider>
    </>
  );
};

export default ProductPage;
