"use client";

import { RootState } from "@/store/StoreProvider";
import { AxiosFetcher } from "@/utils/axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toastSuccess, toastError } from "@/utils/toastConfig";
import { fetchCustomer } from "@/store/slices/user";
import { AppDispatch } from "@/store/StoreProvider";
import { useDispatch } from "react-redux";
import {
  DynamicProfileCardWrapper,
  DynamicProfileFormWrapper,
} from "@/components/dynamic/DynamicProfileWrapper";

interface ProfileFormData {
  name: string;
  email: string;
  gender: string;
  customerId?: string;
  countryCode?: string;
  dob: string;
  phone: string;
}

const Profile = () => {
  const { customer } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Store and theme IDs are now handled within the wrapper components

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        "";

      await AxiosFetcher.patch("/customer/profile/save", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toastSuccess("Profile Updated Successfully");
      dispatch(fetchCustomer());
      setIsEditing(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { Message?: string } } };
      toastError(
        error?.response?.data?.Message ||
          "An error occurred while updating your profile"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!customer) {
    return <p>No Profile Page found for the Guest User</p>;
  }

  return isEditing ? (
    <DynamicProfileFormWrapper
      customer={customer}
      onCancel={() => setIsEditing(false)}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  ) : (
    <DynamicProfileCardWrapper
      customer={customer}
      onEdit={() => setIsEditing(true)}
    />
  );
};

export default Profile;
