"use client";
import { RootState } from "@/store/StoreProvider";
import Ichild from "@/types/react-children";
import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogIn, Lock, AlertTriangle } from "lucide-react";

const ProtectedLayout = ({ children }: Ichild) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  if (!isLoggedIn) {
    return (
      <div className="min-h-(height:--protected-layout-min-height) flex items-center justify-center p-4 bg-gradient-to-b from-(color:--protected-layout-bg-from) to-(color:--protected-layout-bg-to)">
        <div className="max-w-(width:--protected-layout-card-max-width) w-full rounded-(--protected-layout-card-border-radius) overflow-hidden bg-(color:--protected-layout-card-bg) shadow-(--protected-layout-card-shadow) border border-(color:--protected-layout-card-border-color)">
          <div className="bg-gradient-to-r from-(color:--protected-layout-header-bg-from) to-(color:--protected-layout-header-bg-to) p-(spacing:--protected-layout-header-padding) text-(color:--protected-layout-header-text-color)">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-(color:--protected-layout-icon-bg) rounded-full">
                <Lock className="h-(height:--protected-layout-lock-icon-size) w-(width:--protected-layout-lock-icon-size)" />
              </div>
              <h2 className="text-(size:--protected-layout-title-size) font-(weight:--protected-layout-title-weight)">Protected Area</h2>
            </div>
            <p className="mt-2 text-(color:--protected-layout-subtitle-color) text-(size:--protected-layout-subtitle-size)">
              This section requires authentication to access.
            </p>
          </div>

          <div className="p-(spacing:--protected-layout-content-padding)">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-(color:--protected-layout-alert-bg) p-3 rounded-full mb-4">
                <AlertTriangle className="h-(height:--protected-layout-alert-icon-size) w-(width:--protected-layout-alert-icon-size) text-(color:--protected-layout-alert-icon-color)" />
              </div>
              <h3 className="text-(size:--protected-layout-message-title-size) font-(weight:--protected-layout-message-title-weight) text-(color:--protected-layout-message-title-color) mb-2">
                Login Required
              </h3>
              <p className="text-(color:--protected-layout-message-text-color) text-(size:--protected-layout-message-text-size) mb-4">
                Please sign in to your account to access this page and all its
                features.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default ProtectedLayout;
