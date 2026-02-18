"use client";
import React from "react";

import ErrorBoundary from "../ErrorBoundary";

import { useDynamicComponent } from "@/hooks/useDynamicComponent";

// Define Customer type since it's not available from imports
type Customer = {
  name?: string;
  email?: string;
  gender?: string;
  customerId?: string;
  countryCode?: string;
  dob?: string;
  phone?: string;
  [key: string]: unknown;
};

// Define form data type based on Zod schema
interface ProfileFormData {
  name: string;
  email: string;
  gender: string;
  customerId?: string;
  countryCode?: string;
  dob: string;
  phone: string;
}

interface DynamicProfileCardWrapperProps {
  customer: Customer | null;
  onEdit: () => void;
}

interface DynamicProfileFormWrapperProps {
  customer: Customer | null;
  onCancel: () => void;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  isLoading: boolean;
}

export const DynamicProfileCardWrapper = ({
  customer,
  onEdit,
}: DynamicProfileCardWrapperProps) => {
  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading ProfileCard
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );

  const DynamicProfileCard = useDynamicComponent("profile/ProfileCard");

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicProfileCard:", error)}
    >
      <DynamicProfileCard customer={customer} onEdit={onEdit} />
    </ErrorBoundary>
  );
};

export const DynamicProfileFormWrapper = ({
  customer,
  onCancel,
  onSubmit,
  isLoading,
}: DynamicProfileFormWrapperProps) => {
  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading ProfileForm
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );
  const DynamicProfileForm = useDynamicComponent("profile/ProfileForm");

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicProfileForm:", error)}
    >
      <DynamicProfileForm
        customer={customer}
        onCancel={onCancel}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </ErrorBoundary>
  );
};
