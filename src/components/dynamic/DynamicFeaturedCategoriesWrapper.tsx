"use client";
import React from "react";

import ErrorBoundary from "../ErrorBoundary";

import { useDynamicComponent } from "@/hooks/useDynamicComponent";

interface DynamicFeaturedCategoriesWrapperProps {
  config?: Record<string, unknown>;
}

const DynamicFeaturedCategoriesWrapper = ({
  config = {},
}: DynamicFeaturedCategoriesWrapperProps) => {


  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading FeaturedCategories
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );
  // Memoize the dynamic component to prevent recreation on re-renders
  const DynamicFeaturedCategories = useDynamicComponent("FeaturedCategories")


  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) =>
        console.error("Error in DynamicFeaturedCategories:", error)
      }
    >
      <DynamicFeaturedCategories config={config} />
    </ErrorBoundary>
  );
};

export default DynamicFeaturedCategoriesWrapper;
