"use client";
import React from "react";

interface DynamicHeroWrapperProps {
  config?: Record<string, unknown>;
}
import ErrorBoundary from "../ErrorBoundary";
import { useDynamicComponent } from "@/hooks/useDynamicComponent";

const DynamicHeroWrapper = ({ config = {} }: DynamicHeroWrapperProps) => {
  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading Hero Section
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );

  const DynamicHero = useDynamicComponent("Hero");

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicHero:", error)}
    >
      <DynamicHero config={config} />
    </ErrorBoundary>
  );
};

export default DynamicHeroWrapper;
