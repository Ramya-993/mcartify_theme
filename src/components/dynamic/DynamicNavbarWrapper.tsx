"use client";
import React from "react";
import { StoreData } from "@/types/store";
import ErrorBoundary from "../ErrorBoundary";


import { useDynamicComponent } from "@/hooks/useDynamicComponent";
interface DynamicNavbarWrapperProps {
  storeData: StoreData;
}

const DynamicNavbarWrapper = ({ storeData }: DynamicNavbarWrapperProps) => {
  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading Navbar
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );

  const DynamicNavbar = useDynamicComponent("Navbar");

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicNavbar:", error)}
    >
      <DynamicNavbar store={storeData} />
    </ErrorBoundary>
  );
};

export default DynamicNavbarWrapper;
