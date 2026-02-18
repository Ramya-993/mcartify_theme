"use client";

import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/store/StoreProvider";

interface CartItem {
  productId: number;
  variantId: number;
  name: string;
  image?: string;
  quantity: number;
  offerPrice: number;
  basePrice: number;
  finalItemPrice: number;
  attributes?: Array<{
    name: string;
    value: string;
  }>;
}

interface Cart {
  CartItems: CartItem[];
  subTotal: number;
  finalPrice: number;
  totalItems: number;
}

export const useFloatingCart = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [lastCartCount, setLastCartCount] = useState(0);

  const cart = useSelector((state: RootState) => state.cart.data) as Cart;
  const cartItemCount = cart?.CartItems?.length || 0;
  const cartSubTotal = cart?.SubTotal || 0;

  // Show/hide button based on cart items and current page
  useEffect(() => {
    const shouldShow =
      cartItemCount > 0 && pathname !== "/cart" && pathname !== "/checkout";
    setIsVisible(shouldShow);

    // Auto-collapse when cart becomes empty
    if (cartItemCount === 0) {
      setIsExpanded(false);
    }

    // Show animation when new item is added
    if (cartItemCount > lastCartCount && lastCartCount > 0) {
      // Brief expansion animation when item is added
      setIsExpanded(true);
      const timer = setTimeout(() => setIsExpanded(false), 2000);
      return () => clearTimeout(timer);
    }

    setLastCartCount(cartItemCount);
  }, [cartItemCount, pathname, lastCartCount]);

  const handleViewCart = useCallback(() => {
    setIsExpanded(false);
    router.push("/cart");
  }, [router]);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleCloseExpanded = useCallback(() => {
    setIsExpanded(false);
  }, []);

  return {
    isVisible,
    isExpanded,
    cartItemCount,
    cartSubTotal,
    cartItems: cart?.CartItems || [],
    handleViewCart,
    handleToggleExpanded,
    handleCloseExpanded,
  };
};
