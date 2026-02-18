"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosFetcher } from "@/utils/axios";
import { toastInfo, toastError, toastSuccess } from "@/utils/toastConfig";
import { fetchCart } from "@/store/slices/cart";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/StoreProvider";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Tag, X, Calendar, Percent, DollarSign } from "lucide-react";

// Updated interfaces to match actual API response
interface CouponType {
  promocodeId: number;
  promocode: string;
  description: string;
  startDate: string;
  endDate: string;
  offerType: number; // 1 = fixed amount, 2 = percentage
  offerValue: number;
  maxDiscount: number;
  minOrderValue: number;
}

interface CouponsResponse {
  Status: number;
  Promocodes: CouponType[];
}

interface CouponSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const useCoupons = (searchTerm: string = "") => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        null
      : null;

  return useQuery<CouponsResponse>({
    queryKey: ["coupons", searchTerm],
    queryFn: async () => {
      const url = searchTerm
        ? `/stores/promocodes?search=${encodeURIComponent(searchTerm)}`
        : "/stores/promocodes";

      const response = await AxiosFetcher.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return response.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

const CouponCard: React.FC<{
  coupon: CouponType;
  isSelected: boolean;
  onSelect: (coupon: CouponType) => void;
}> = ({ coupon, isSelected, onSelect }) => {
  const isPercentage = coupon.offerType === 2;
  const discountText = isPercentage
    ? `${coupon.offerValue}% OFF`
    : `${coupon.offerValue} OFF`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`group relative border rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-green-500 bg-green-50 shadow-md"
          : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
      }`}
      onClick={() => {
        console.log("🎯 CouponCard clicked:", coupon.promocode);
        onSelect(coupon);
      }}
    >
      {/* Header with Code and Discount */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold">
            <Tag className="h-3 w-3" />
            {coupon.promocode}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs font-semibold">
          {isPercentage ? (
            <Percent className="h-3 w-3" />
          ) : (
            <DollarSign className="h-3 w-3" />
          )}
          {discountText}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm mb-4 font-medium">
        {coupon.description}
      </p>

      {/* Offer Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Min. order value:</span>
          <span className="font-semibold text-gray-900">
            {coupon.minOrderValue}
          </span>
        </div>
        {coupon.maxDiscount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Max. discount:</span>
            <span className="font-semibold text-gray-900">
              {coupon.maxDiscount}
            </span>
          </div>
        )}
      </div>

      {/* Validity */}
      <div className="flex items-center gap-2 text-xs text-gray-500 border-t pt-3">
        <Calendar className="h-3 w-3" />
        <span>Valid till {formatDate(coupon.endDate)}</span>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

const CouponSidebar: React.FC<CouponSidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [couponSearchTerm, setCouponSearchTerm] = useState<string>("");
  const [selectedCoupon, setSelectedCoupon] = useState<CouponType | null>(null);
  const { data: couponsData, isLoading, error } = useCoupons(couponSearchTerm);

  // Enhanced logging for debugging
  React.useEffect(() => {
    console.log(
      "🏷️ CouponSidebar - selectedCoupon changed:",
      selectedCoupon?.promocode || "null"
    );
  }, [selectedCoupon]);

  React.useEffect(() => {
    console.log(
      "📊 CouponSidebar - couponsData:",
      couponsData?.Promocodes?.length || 0,
      "coupons"
    );
  }, [couponsData]);

  // Apply selected coupon
  const applySelectedCoupon = async (couponCode: string) => {
    const token =
      localStorage.getItem("guest_token") ||
      localStorage.getItem("token") ||
      null;

    if (!couponCode) {
      toastInfo("Please select a valid coupon");
      return;
    }

    try {
      const response = await AxiosFetcher.post(
        "/stores/promocode/apply",
        {
          promocode: couponCode.toUpperCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toastSuccess(response?.data?.Message || "Coupon applied successfully!");
      dispatch(fetchCart());
      onClose();
      setCouponSearchTerm("");
      setSelectedCoupon(null);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { Message?: string } } };
      toastError(err?.response?.data?.Message || "Failed to apply coupon");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setCouponSearchTerm(e.target.value);
  };

  const clearSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCouponSearchTerm("");
    // Note: We intentionally DON'T reset selectedCoupon here
    // so that the user's selection persists when clearing search
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset all state when closing
      setCouponSearchTerm("");
      setSelectedCoupon(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col"
        style={{ height: "100vh", maxHeight: "100vh" }}
      >
        <SheetHeader className="p-6 pb-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-green-100 rounded-full">
                <Tag className="h-5 w-5 text-green-600" />
              </div>
              Available Coupons
            </SheetTitle>
            <button
              onClick={onClose}
              className="p-1 hover:bg-green-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </button>
          </div>
          <SheetDescription className="text-gray-600">
            Find and apply coupons to save on your order
          </SheetDescription>
        </SheetHeader>

        <div
          className="flex flex-col"
          style={{ height: "calc(100vh - 140px)" }}
        >
          {/* Search Bar */}
          <div className="p-6 pb-4 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search coupons..."
                value={couponSearchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
              />
              {couponSearchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Coupons List */}
          <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <ScrollArea
              className="h-full px-6"
              style={{ height: "calc(100vh - 300px)" }}
            >
              <div className="space-y-4 pb-6">
                {isLoading ? (
                  // Loading skeletons
                  <>
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="border rounded-xl p-5 animate-pulse"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <X className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-gray-600 mb-4">Failed to load coupons</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                      className="border-gray-300"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : !couponsData?.Promocodes?.length ? (
                  <div className="text-center py-12">
                    <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Tag className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg font-medium mb-2">
                      {couponSearchTerm
                        ? "No coupons found"
                        : "No coupons available"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {couponSearchTerm
                        ? `Try searching for something else`
                        : "Check back later for new offers"}
                    </p>
                  </div>
                ) : (
                  couponsData.Promocodes.map((coupon) => (
                    <CouponCard
                      key={coupon.promocodeId}
                      coupon={coupon}
                      isSelected={
                        selectedCoupon?.promocodeId === coupon.promocodeId
                      }
                      onSelect={setSelectedCoupon}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Apply Button - Fixed positioning to always be visible */}
          <div
            className="flex-shrink-0 border-t bg-gray-50 flex items-center justify-center"
            style={{
              position: "sticky",
              bottom: 0,
              height: "80px",
              marginTop: "auto",
              zIndex: 10,
            }}
          >
            {selectedCoupon ? (
              <div className="w-full p-6">
                <Button
                  onClick={() => {
                    console.log(
                      "🚀 Apply button clicked for:",
                      selectedCoupon.promocode
                    );
                    applySelectedCoupon(selectedCoupon.promocode);
                  }}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 text-base font-semibold shadow-lg"
                  size="lg"
                >
                  Apply {selectedCoupon.promocode}
                </Button>
                {/* Show selected coupon info if it's not in current filtered results */}
                {!couponsData?.Promocodes?.find(
                  (c) => c.promocodeId === selectedCoupon.promocodeId
                ) && (
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Selected coupon: {selectedCoupon.promocode}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                Select a coupon to apply
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CouponSidebar;
