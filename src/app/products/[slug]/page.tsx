import DynamicProductDescWrapper from "@/components/dynamic/DynamicProductDescWrapper";
import { AxiosFetcher } from "@/utils/axios";
import type { Metadata, ResolvingMetadata } from "next";
import { headers } from "next/headers";
import type IProductDescResponce from "@/types/productDescResponse";
import { getSeoContext } from "@/utils/seo";
import Head from "next/head";

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

// Interface for individual product image from API response
interface ProductImage {
  productImageId: number;
  productId: number;
  image: string;
  altText: string | null;
  isPrimary: number; // Assuming 1 for true, 0 for false
  priority: number;
  imageURL: string;
}

// Interface for component props (remains similar)
interface IProductPageProps {
  params: { slug: string };
  searchParams: { variantId: string };
}

// generateMetadata function
type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  console.log("🌐 SERVER-SIDE: generateMetadata executing on server");
  const { slug } = await params;
  console.log("🌐 SERVER-SIDE: generateMetadata for product_id:", slug);
  const headersList = await headers(); // Try awaiting headers()
  const host = headersList.get("host");
  const parts = host ? host.split(".") : [];
  const subdomain = parts.length >= 3 ? parts[0] : "prakash5555"; // Default or example subdomain
  try {
    const res = await AxiosFetcher.get(
      `/stores/product/details/${slug}?subdomain=${subdomain}`,
      {
        headers: {
          "x-store-host": host,
        },
      }
    );
    const product = res?.data?.Product; // Adjust based on actual API response structure
    console.log("productdsadds", product);
    if (!product || res?.data?.Status !== 1) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    // Optional: accessing parent metadata
    // const previousImages = (await parent).openGraph?.images || []

    // Extract relevant data using correct field names from API response
    const productName =
      `${product.name} || ${product.categoryName}` || "Product Details"; // Use product.name
    const description =
      product.metaDescription ||
      (await parent).description ||
      "View product details.";

    // Find the primary image from productImages array
    let primaryImageUrl: string | undefined = undefined;
    if (product.productImages && product.productImages.length > 0) {
      const primaryImage = product.productImages.find(
        (img: ProductImage) => img.isPrimary === 1
      );
      primaryImageUrl = primaryImage
        ? primaryImage.imageURL
        : product.productImages[0].imageURL; // Fallback to first image if no primary
    }

    // Determine the parent image URL correctly
    const parentImages = (await parent).openGraph?.images;
    let parentImageUrl: string | undefined = undefined;
    if (parentImages && parentImages.length > 0) {
      const firstParentImage = parentImages[0];
      if (typeof firstParentImage === "string") {
        parentImageUrl = firstParentImage;
      } else if (firstParentImage instanceof URL) {
        // Check if it's a URL object
        parentImageUrl = firstParentImage.href;
      } else if (typeof firstParentImage === "object" && firstParentImage.url) {
        // If the 'url' property itself is a URL object, convert it
        parentImageUrl =
          firstParentImage.url instanceof URL
            ? firstParentImage.url.href
            : firstParentImage.url.toString();
      }
    }

    // Select the primary product image if available, otherwise use the parent image or a default
    const imageUrl =
      primaryImageUrl || parentImageUrl || "/default-og-image.png";

    return {
      title: productName,
      description: description,
      openGraph: {
        title: productName,
        description: description,
        images: [
          {
            url: imageUrl,
            // Optionally add width and height if known
          },
          // ...previousImages, // Include parent images if desired
        ],
      },
      // You can add other metadata fields here
    };
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    return {
      title: "Error Loading Product",
      description: "Could not load product details.",
    };
  }
}

// Page Component with server-side data fetching
const ProductPage = async ({ params, searchParams }: IProductPageProps) => {
  const { baseUrl } = await getSeoContext();
  console.log("🌐 SERVER-SIDE: ProductPage component executing on server");
  const { variantId } = await searchParams;
  const { slug } = await params;

  console.log("🌐 SERVER-SIDE: variantId:", variantId);
  console.log("🌐 SERVER-SIDE: product_id resolved:", slug);

  // Server-side data fetching for SEO
  let initialProductData: ExtendedProductDesc | null = null;
  let initialError: string | null = null;

  try {
    console.log("🌐 SERVER-SIDE: Fetching product data server-side for SEO");
    const headersList = await headers();
    const host = headersList.get("host");
    const parts = host ? host.split(".") : [];
    const subdomain = parts.length >= 3 ? parts[0] : "prakash5555";

    const res = await AxiosFetcher.get(
      `/stores/product/details/${slug}?subdomain=${subdomain}`,
      {
        headers: {
          "x-store-host": host,
        },
      }
    );

    if (res.data.Status && res.data.Product) {
      initialProductData = res.data.Product;
      console.log(
        "🌐 SERVER-SIDE: Product data fetched successfully:",
        initialProductData?.name
      );
    } else {
      initialError = "Product not found";
      console.log("🌐 SERVER-SIDE: Product not found in API response");
    }
  } catch (error) {
    initialError =
      error instanceof Error ? error.message : "Failed to fetch product data";
    console.error("🌐 SERVER-SIDE: Error fetching product data:", error);
  }

  console.log(
    "🌐 SERVER-SIDE: About to render DynamicProductDescWrapper with SSR data"
  );

  return (
    <div>
      <Head>
        <link
          rel="canonical"
          href={`${baseUrl}/products/${slug}?variantId=${variantId}`}
        />
      </Head>
      {/* Use the DynamicProductDescWrapper to load theme-specific ProductDesc component */}
      <DynamicProductDescWrapper
        slug={slug}
        variantId={variantId}
        initialProductData={initialProductData}
        initialError={initialError}
      />
    </div>
  );
};

export default ProductPage;

/* HTML: <div class="loader"></div> */
