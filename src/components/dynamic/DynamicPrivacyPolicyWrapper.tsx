"use client";
import React from "react";
import ErrorBoundary from "../ErrorBoundary";

import { useDynamicComponent } from "@/hooks/useDynamicComponent";
// We don't need props since Checkout gets data from Redux

const DynamicPrivacyPolicyWrapper = () => {


  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading PrivacyPolicy
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );
  // Memoize the dynamic component to prevent recreation on re-renders
  const DynamicPrivacyPolicy = useDynamicComponent("PrivacyPolicy")

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) =>
        console.error("Error in DynamicPrivacyPolicy:", error)
      }
    >
      <DynamicPrivacyPolicy />
    </ErrorBoundary>
  );
};

export default DynamicPrivacyPolicyWrapper;
