"use client";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";

import { useDynamicComponent } from "@/hooks/useDynamicComponent";

// We don't need props since Checkout gets data from Redux

const DynamicContactUsWrapper = () => {


  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading Contact Us
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );

  const DynamicContactUs = useDynamicComponent("ContactUs")


  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicContactUs:", error)}
    >
      <DynamicContactUs />
    </ErrorBoundary>
  );
};

export default DynamicContactUsWrapper;
