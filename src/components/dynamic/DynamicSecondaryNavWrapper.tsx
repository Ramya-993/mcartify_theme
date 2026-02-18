"use client";
import React from "react";

import ErrorBoundary from "../ErrorBoundary";
import { useDynamicComponent } from "@/hooks/useDynamicComponent";

interface DynamicSecondaryNavWrapperProps {
  config?: Record<string, unknown>;
}

const DynamicSecondaryNavWrapper = ({
  config = {},
}: DynamicSecondaryNavWrapperProps) => {


  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading SecondaryNav
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );

const DynamicSecondaryNav = useDynamicComponent("SecondaryNav")

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicSecondaryNav:", error)}
    >
      <DynamicSecondaryNav config={config} />
    </ErrorBoundary>
  );
};

export default DynamicSecondaryNavWrapper;
