import { ProductDescClient } from "./ProductDescClient";
import type IProductDescResponce from "@/types/productDescResponse";
import Script from "next/script";

// Extended interface to add missing properties
interface ExtendedProductDesc extends IProductDescResponce {
  isNew?: number;
  avgRating?: number;
  reviewCount?: number;
  brandName?: string;
  categorySlug?: string;
  slug?: string;
  attributes?: Array<{
    name: string;
    value: string;
    unit?: string | null;
    inputType?: string;
    isVariantDimension?: number;
  }>;
}

interface IProductDescServerProps {
  slug: string;
  variantId: string;
  initialProductData?: ExtendedProductDesc | null;
  initialError?: string | null;
}

// Add this function before the component
const generateProductSchema = (
  productData: ExtendedProductDesc,
  variantId: string
) => {
  const selectedVariant =
    productData.variants?.find((v) => v.variantId.toString() === variantId) ||
    productData.variants?.[0];

  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: productData.name,
    description: productData.description,
    image: productData.productImages?.[0]?.imageURL,
    brand: {
      "@type": "Brand",
      name:
        productData.attributes?.find((attr) => attr.name === "Brand")?.value ||
        "Store Brand",
    },
    offers: {
      "@type": "Offer",
      price: selectedVariant?.offerPrice || selectedVariant?.basePrice,
      priceCurrency: selectedVariant?.currency || "INR",
      availability:
        selectedVariant?.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${
        productData.slug || "product"
      }`,
    },
  };
};

// Server component that receives server-side fetched data and passes it to client component
const ProductDescServer = ({
  slug,
  variantId,
  initialProductData = null,
  initialError = null,
}: IProductDescServerProps) => {
  console.log("🔧 SERVER-SIDE: ProductDescServer rendering with data:", {
    slug,
    variantId,
    hasInitialData: !!initialProductData,
    hasInitialError: !!initialError,
  });

  // Render client component with server-side data for optimal SEO and performance
  return (
    <>
      {/* Add structured data for SEO */}
      {initialProductData && (
        <Script id="product-schema" type="application/ld+json">
          {JSON.stringify(generateProductSchema(initialProductData, variantId))}
        </Script>
      )}

      <ProductDescClient
        slug={slug}
        variantId={variantId}
        initialProductData={initialProductData}
        initialError={initialError}
      />
    </>
  );
};

export default ProductDescServer;
