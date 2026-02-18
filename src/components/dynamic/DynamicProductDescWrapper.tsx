"use client";

import ErrorBoundary from "../ErrorBoundary";
import { useDynamicComponent } from "@/hooks/useDynamicComponent";

import type IProductDescResponce from "@/types/productDescResponse";

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

interface DynamicProductDescWrapperProps {
  slug: string;
  variantId: string;
  initialProductData?: ExtendedProductDesc | null;
  initialError?: string | null;
}

const DynamicProductDescWrapper = ({
  slug,
  variantId,
  initialProductData = null,
  initialError = null,
}: DynamicProductDescWrapperProps) => {
  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading ProductDesc
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );
  const DynamicProductDesc = useDynamicComponent("ProductDesc");

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicProductDesc:", error)}
    >
      <DynamicProductDesc
        slug={slug}
        variantId={variantId}
        initialProductData={initialProductData}
        initialError={initialError}
      />
    </ErrorBoundary>
  );
};

export default DynamicProductDescWrapper;
