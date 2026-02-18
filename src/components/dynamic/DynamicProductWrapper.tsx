"use client";

import React from "react";

import ErrorBoundary from "../ErrorBoundary";
import { useDynamicComponent } from "@/hooks/useDynamicComponent";
import IProduct from "@/types/product";
interface DynamicProductWrapperProps {
  product: IProduct;
}

const DynamicProductWrapper = ({ product }: DynamicProductWrapperProps) => {
  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading Product
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );
  const DynamicProduct = useDynamicComponent("Product");

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicProduct:", error)}
    >
      <DynamicProduct product={product} />
    </ErrorBoundary>
  );
};

export default DynamicProductWrapper;
