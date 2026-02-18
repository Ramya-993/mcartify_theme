"use client";

import React from "react";
import { IOrder } from "@/types/orderResponse";

import ErrorBoundary from "../ErrorBoundary";
import { useDynamicComponent } from "@/hooks/useDynamicComponent";

interface DynamicOrderSuccessWrapperProps {
  orderData: IOrder;
}

const DynamicOrderSuccessWrapper = ({
  orderData,
}: DynamicOrderSuccessWrapperProps) => {

  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading OrderSuccess
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );

  const DynamicOrderSuccess = useDynamicComponent("ordersuccess/OrderSuccess")

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicOrderSuccess:", error)}
    >
      <DynamicOrderSuccess orderData={orderData} />
    </ErrorBoundary>
  );
};

export default DynamicOrderSuccessWrapper;
