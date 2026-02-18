"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";

export interface ProfileCardProps {
  customer: Customer | null;
  onEdit: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ customer, onEdit }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!customer) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No profile information available
          </p>
        </CardContent>
      </Card>
    );
  }
  console.log("customerdsdsad", customer);

  return (
    <Card className="w-full border-(color:--profile-border) bg-(color:--profile-bg)">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-(weight:--profile-title-weight) text-(color:--profile-title)">
          Profile Information
        </CardTitle>
        <Button
          onClick={onEdit}
          className="bg-(color:--profile-button-bg) text-(color:--profile-button-text) hover:bg-(color:--primary-hover)"
        >
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm text-(color:--profile-label)">Name</p>
            <p className="font-medium text-(color:--profile-text) wrap-anywhere">
              {customer.name}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-(color:--profile-label)">Email</p>
            <p className="font-medium text-(color:--profile-text) wrap-anywhere">
              {customer.email}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-(color:--profile-label)">Gender</p>
            <p className="font-medium text-(color:--profile-text) wrap-anywhere">
              {customer.gender || "Not specified"}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-(color:--profile-label)">Phone Number</p>
            <p className="font-medium text-(color:--profile-text) wrap-anywhere">
              {customer.phone}
            </p>
          </div>

          {/* <div className="space-y-1">
            <p className="text-sm text-(color:--profile-label)">Country Code</p>
            <p className="font-medium text-(color:--profile-text)">{customer.countryCode}</p>
          </div> */}

          <div className="space-y-1">
            <p className="text-sm text-(color:--profile-label)">
              Date of Birth
            </p>
            <p className="font-medium text-(color:--profile-text)">
              {customer.dob ? formatDate(customer.dob) : "Not specified"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
