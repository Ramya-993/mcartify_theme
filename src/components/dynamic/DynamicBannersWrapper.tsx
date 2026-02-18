"use client";
import React from "react";


interface DynamicBannersWrapperProps {
  config?: Record<string, unknown>;
}
import ErrorBoundary from "../ErrorBoundary";
import { useDynamicComponent } from "@/hooks/useDynamicComponent";

const DynamicBannersWrapper = ({ config = {} }: DynamicBannersWrapperProps) => {

  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading Banners
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );

  const DynamicBanners = useDynamicComponent("Banners")

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicBanners:", error)}
    >
      <DynamicBanners config={config} />
    </ErrorBoundary>
  );
};

export default DynamicBannersWrapper;
