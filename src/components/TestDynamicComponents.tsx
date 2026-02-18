"use client";
import React, { Suspense, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";
import { getDynamicFooter, getDynamicSecondaryNav } from "./DynamicComponents";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

/**
 * This is a test component to demonstrate loading dynamic components from themes
 * It loads both SecondaryNav and Footer components from the specified theme
 */
const TestDynamicComponents = () => {
  // Theme configuration
  const storeID = "default";
  const themeID = "default";

  // Get store data from Redux
  const { store } = useSelector((state: RootState) => state.store);

  // Memoize dynamic components to prevent recreating them on each render
  const DynamicSecondaryNav = useMemo(
    () => getDynamicSecondaryNav(storeID, themeID),
    [storeID, themeID]
  );

  const DynamicFooter = useMemo(
    () => getDynamicFooter(storeID, themeID),
    [storeID, themeID]
  );

  return (
    <div className="flex flex-col min-h-screen">
      <h1 className="text-2xl font-bold text-center my-4">
        Testing Dynamic Components
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Dynamic SecondaryNav:</h2>
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicSecondaryNav />
        </Suspense>
      </div>

      <div className="mt-auto">
        <h2 className="text-xl font-semibold mb-2">Dynamic Footer:</h2>
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicFooter
            name={store?.name || "Store Name"}
            image={store?.logo || "/images/default/logo.png"}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default TestDynamicComponents;
