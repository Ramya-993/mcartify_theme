"use client";

import React from "react";
import Image from "next/image"; // Import next/image
import useProfileHeader from "@/themes/hooks/profile/useProfileHeader";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Define a type for the customer data expected by this component
interface CustomerData {
  name?: string | null;
  profile_image?: string | null;
  place?: string | null;
  // Add other fields if needed
}

export default function ProfileHeader() {
  const { customer, loading, error } = useProfileHeader() as {
    customer: CustomerData | null;
    loading: boolean;
    error: string | null;
  };

  // Loading State
  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="flex flex-col items-center p-6">
          <Skeleton className="size-24 rounded-full" />
          <Skeleton className="mt-4 h-6 w-32" />
          <Skeleton className="mt-2 h-4 w-24" />
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-6 text-center text-destructive">
          Error loading profile header: {error}
        </CardContent>
      </Card>
    );
  }

  // No Customer Data State
  if (!customer) {
    return (
      <Card className="border-primary/20">
        <CardContent className="flex flex-col items-center p-6 text-muted-foreground">
          <Avatar className="size-24">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          <p className="mt-4">Profile data not available.</p>
        </CardContent>
      </Card>
    );
  }

  // Success State - Render Header
  const initials = customer?.name ? customer.name.charAt(0).toUpperCase() : "?";

  return (
    <Card className="border-primary/20">
      <CardContent className="flex flex-col items-center p-6">
        <Avatar className={cn("size-24 ring-4", "ring-primary/20")}>
          {customer.profile_image ? (
            <AvatarImage
              src={customer.profile_image}
              alt={customer.name || "Profile picture"}
            />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
        <h4 className="mt-4 text-xl font-semibold text-primary wrap-anywhere">
          {customer.name || "Guest User"}
        </h4>
        {customer.place && (
          <p className="mt-1 text-sm text-muted-foreground">{customer.place}</p>
        )}
      </CardContent>
    </Card>
  );
}
