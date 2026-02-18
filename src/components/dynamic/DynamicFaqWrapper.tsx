"use client";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";

import { useDynamicComponent } from "@/hooks/useDynamicComponent";

const DynamicFaqWrapper = () => {


  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">Error loading Faq</h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );

  const DynamicFaq = useDynamicComponent("Faq")

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicFaq:", error)}
    >
      <DynamicFaq />
    </ErrorBoundary>
  );
};

export default DynamicFaqWrapper;
