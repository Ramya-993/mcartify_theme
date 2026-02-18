"use client";

import ICartItem from "@/types/cartItem";
import NextImage from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";
import { useCart } from "@/themes/hooks/useCart";
import { toast } from "sonner";

// Import Shadcn UI components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  PackageIcon,
  CreditCardIcon,
} from "@/components/icons";
import { cn } from "@/lib/utils";

// Loading skeleton component
const CartSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-12 w-full" />
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  </div>
);

const Cart = () => {
  const {
    cart,
    handleQuantityChange,
    handleCheckout,
    canProceedToCheckout,
    handleClearCart,
    router,
  } = useCart();

  // Calculate correct values according to the formulas
  const subTotal = cart
    ? (cart.OriginalPrice || 0) - (cart.TotalItemDiscount || 0)
    : 0;
  const totalPriceAfterPromocode = subTotal - (cart?.PromocodeDiscount || 0);
  const finalPrice = totalPriceAfterPromocode + (cart?.VAT || 0);

  const isMinOrderNotMet = cart && !canProceedToCheckout();
  const remainingAmount =
    cart && isMinOrderNotMet ? cart.MinOrderAmount - finalPrice : 0;

  return (
    <>
      <div>
        <div className="container mx-auto max-w-7xl ">
          <div className="mx-auto max-w-6xl py-4 px-4 lg:px-0">
            <h1 className="text-3xl font-bold text-gray-900 font-(family-name:--font-secondary)">
              My Cart
            </h1>
            <p className="text-gray-600 mt-1 font-(family-name:--font-primary)">
              {cart?.NoOfItems} items in your cart
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-[60vh]">
        {cart?.CartItems && cart.CartItems.length > 0 ? (
          <div className="bg-(--cart-bg) px-4 py-6 md:px-10 lg:py-10">
            <div className="container mx-auto max-w-6xl">
              {/* <Card className="mb-6 border-(--cart-info-border) bg-(--cart-info-bg) rounded-(--cart-card-radius)">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <ShoppingCartIcon className="h-6 w-6 text-(--cart-icon-color) hidden sm:block" />
                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold text-(--cart-heading-color) font-(family-name:--font-secondary)">
                        Your Shopping Cart
                      </h2>
                      <p className="text-sm sm:text-base text-(--cart-subheading-color) font-(family-name:--font-primary)">
                        Complete your purchase to enjoy our products
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}

              <div className="grid gap-4 sm:gap-1 lg:grid-cols-12">
                {/* Order Summary for Mobile - Shown on top for mobile devices */}
                <div className="lg:hidden">
                  <Card className="rounded-lg border border-gray-200 bg-white shadow-sm">
                    {/* Savings Banner */}
                    {(cart?.TotalItemDiscount > 0 ||
                      cart?.PromocodeDiscount > 0) && (
                      <div className="p-4 rounded-t-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🥳</span>
                          <span className="text-sm font-medium text-gray-700">
                            wow you saved{" "}
                            <span className="text-red-500 font-bold">
                              {cart?.Currency}
                              {(cart?.TotalItemDiscount || 0) +
                                (cart?.PromocodeDiscount || 0)}
                            </span>{" "}
                            on this order
                          </span>
                        </div>
                      </div>
                    )}

                    <CardHeader className="pb-3">
                      <h3 className="text-lg font-bold text-gray-900 font-(family-name:--font-secondary)">
                        Order Summary
                      </h3>
                    </CardHeader>
                    <CardContent className="px-4 pb-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                          <p className="text-base font-(family-name:--font-secondary) text-gray-600">
                            Items total
                          </p>
                          <span className="text-base font-(family-name:--font-secondary) text-gray-900">
                            {cart?.Currency}
                            {cart?.OriginalPrice}
                          </span>
                        </div>

                        {cart?.TotalItemDiscount > 0 && (
                          <div className="flex items-center justify-between px-2">
                            <p className="text-base font-(family-name:--font-secondary) text-gray-600">
                              Offer price
                            </p>
                            <span className="text-base font-(family-name:--font-secondary) text-(color:--primary)">
                              {cart?.Currency}
                              {subTotal.toFixed(2)}
                            </span>
                          </div>
                        )}

                        {cart?.Promocode && cart?.PromocodeDiscount > 0 && (
                          <div className="flex items-center justify-between px-2">
                            <p className="text-base font-(family-name:--font-secondary) text-gray-600">
                              Promocode ({cart?.Promocode})
                            </p>
                            <span className="text-base font-(family-name:--font-secondary) text-(color:--primary)">
                              -{cart?.Currency}
                              {cart?.PromocodeDiscount}
                            </span>
                          </div>
                        )}

                        {cart?.VAT > 0 && (
                          <div className="flex items-center justify-between px-2">
                            <p className="text-base font-(family-name:--font-secondary) text-gray-600">
                              Tax
                            </p>
                            <span className="text-base font-(family-name:--font-secondary) text-gray-900">
                              {cart?.Currency}
                              {cart?.VAT}
                            </span>
                          </div>
                        )}

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between px-2">
                          <p className="text-lg font-bold text-gray-900 font-(family-name:--font-secondary)">
                            Subtotal
                          </p>
                          <span className="text-lg font-bold text-gray-900 font-(family-name:--font-secondary)">
                            {cart?.Currency}
                            {finalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-4">
                      <Button
                        className={cn(
                          "w-full h-14 text-lg font-(family-name:--font-secondary) rounded-lg",
                          canProceedToCheckout()
                            ? "bg-(color:--primary) hover:bg-(color:--primary-hover) text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        )}
                        onClick={handleCheckout}
                        disabled={!canProceedToCheckout()}
                      >
                        {canProceedToCheckout() ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <CreditCardIcon className="h-6 w-6" />
                              <span>Checkout</span>
                            </div>
                            <span>
                              {cart?.Currency}
                              {finalPrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          `Add ${cart?.Currency}${remainingAmount.toFixed(
                            2
                          )} more`
                        )}
                      </Button>
                    </CardFooter>
                  </Card>

                  {/* Minimum Cart Value Section for Mobile */}
                  {cart?.MinOrderAmount !== 0 && !canProceedToCheckout() && (
                    <div className="w-full bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <ShoppingCartIcon className="h-10 w-10 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-(family-name:--font-secondary) font-semibold text-yellow-800">
                            Minimum Cart Value Required
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1 font-(family-name:--font-secondary)">
                            Your cart must have items worth at least
                            {cart?.Currency}
                            {cart?.MinOrderAmount} to proceed with the checkout.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-8">
                  <div className="mb-1 flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                    <span className="font-(family-name:--font-secondary) font-bold text-gray-900">
                      Missed something?
                    </span>
                    <Button
                      variant="default"
                      className="bg-black text-white hover:bg-gray-800 px-4 py-2 text-sm font-medium rounded-lg"
                      onClick={() => router.push("/")}
                    >
                      + Add More Items
                    </Button>
                  </div>
                  <div className="flex flex-col gap-1">
                    {/* Large Screen Table View */}
                    <div className="hidden md:block">
                      <ScrollArea className="h-[400px] sm:h-[500px] border border-gray-200">
                        <Table>
                          <TableBody>
                            <Suspense fallback={<CartSkeleton />}>
                              {cart &&
                                cart.CartItems.map(
                                  (item: ICartItem, i: number) => (
                                    <TableRow
                                      key={i}
                                      className="!bg-transparent hover:!bg-transparent border-b border-gray-200"
                                    >
                                      <TableCell className="p-4 w-20">
                                        <Link
                                          href={`/products/${item.slug}?variantId=${item.variantId}`}
                                        >
                                          <div className="h-14 w-14 rounded-lg border border-border overflow-hidden bg-gray-50 flex items-center justify-center">
                                            <NextImage
                                              width={90}
                                              height={90}
                                              src={item.image}
                                              alt={item.name}
                                              className="max-h-full max-w-full object-contain rounded-lg"
                                            />
                                          </div>
                                        </Link>
                                      </TableCell>
                                      <TableCell className="max-w-0 w-full">
                                        <div className="space-y-1">
                                          <Link
                                            className="text-sm font-(family-name:--font-secondary) font-bold text-foreground hover:text-primary hover:underline block leading-tight"
                                            href={`/products/${item.slug}?variantId=${item.variantId}`}
                                            title={item.name}
                                            style={{
                                              display: "-webkit-box",
                                              WebkitLineClamp: 2,
                                              WebkitBoxOrient: "vertical",
                                              overflow: "hidden",
                                            }}
                                          >
                                            {item.name}
                                          </Link>

                                          {/* Category and brand info */}
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            {item.isNew && (
                                              <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                                                New
                                              </span>
                                            )}
                                          </div>

                                          {/* Product details */}
                                          <p className="text-xs text-muted-foreground flex flex-wrap gap-1.5 items-center">
                                            <span>
                                              {item.qty && item.unit
                                                ? `${item.qty} ${item.unit}`
                                                : ""}
                                            </span>

                                            {item.stock <= 5 &&
                                              item.stock > 0 && (
                                                <span className="text-amber-600 font-medium text-[10px] bg-amber-100 px-1.5 py-0.5 rounded-full">
                                                  Only {item.stock} left
                                                </span>
                                              )}
                                          </p>

                                          {/* Discounts */}
                                          {item.discountPercentage &&
                                            item.discountPercentage > 0 && (
                                              <span className="text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
                                                Save {item.discountPercentage}%
                                              </span>
                                            )}
                                        </div>
                                      </TableCell>
                                      <TableCell className="w-40">
                                        <div className="flex w-32 items-center justify-between gap-2 bg-gray-100 rounded-2xl p-1">
                                          <Button
                                            size="icon"
                                            className={cn(
                                              "h-7 w-7 rounded-full",
                                              "bg-white border-primary/20",
                                              "hover:bg-primary/10 hover:text-primary"
                                            )}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleQuantityChange(
                                                Number(item.productId),
                                                Number(item.variantId),
                                                item.quantity - 1
                                              );
                                            }}
                                          >
                                            {item.quantity === 1 ? (
                                              <TrashIcon className="h-4 w-4 text-gray-500" />
                                            ) : (
                                              <MinusIcon className="h-4 w-4 text-gray-500" />
                                            )}
                                          </Button>
                                          <span className="min-w-8 text-center font-medium">
                                            {item.quantity}
                                          </span>
                                          <Button
                                            size="icon"
                                            className={cn(
                                              "h-8 w-8 rounded-full",
                                              "bg-primary border-primary",
                                              "hover:bg-primary/10 hover:text-primary"
                                            )}
                                            onClick={(e) => {
                                              e.stopPropagation();

                                              // Check stock before incrementing
                                              if (
                                                item.quantity + 1 >
                                                item.stock
                                              ) {
                                                toast.error(
                                                  "Insufficient Stock",
                                                  {
                                                    description: `Only ${item.stock} items available. You already have ${item.quantity} in cart.`,
                                                    duration: 4000,
                                                    style: {
                                                      background:
                                                        "var(--background)",
                                                      color:
                                                        "var(--destructive)",
                                                      border:
                                                        "1px solid var(--destructive)",
                                                    },
                                                  }
                                                );
                                                return;
                                              }

                                              handleQuantityChange(
                                                Number(item.productId),
                                                Number(item.variantId),
                                                item.quantity + 1
                                              );

                                              // Show success toast with stock warning if needed
                                              const remainingStock =
                                                item.stock -
                                                (item.quantity + 1);
                                              if (remainingStock <= 0) {
                                                toast.success("Cart Updated", {
                                                  description:
                                                    "You now have all available stock in your cart!",
                                                  duration: 4000,
                                                });
                                              } else if (remainingStock <= 3) {
                                                toast.success("Cart Updated", {
                                                  description: `Only ${remainingStock} items left in stock!`,
                                                  duration: 4000,
                                                });
                                              } else {
                                                toast.success(
                                                  "Quantity updated successfully!",
                                                  {
                                                    duration: 4000,
                                                    style: {
                                                      background:
                                                        "var(--background)",
                                                      color: "var(--primary)",
                                                      border:
                                                        "1px solid var(--primary-hover)",
                                                    },
                                                  }
                                                );
                                              }
                                            }}
                                          >
                                            <PlusIcon className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                      <TableCell className="font-medium text-foreground w-32">
                                        <div className="flex flex-col items-end">
                                          <span className="font-(family-name:--font-secondary) font-bold text-lg">
                                            {item.currency}
                                            {item.finalItemPrice}
                                          </span>
                                          {item.totalBasePrice !==
                                            item.finalItemPrice && (
                                            <span className="text-xs text-muted-foreground line-through font-(family-name:--font-secondary)">
                                              {item.currency}
                                              {item.totalBasePrice}
                                            </span>
                                          )}
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                            </Suspense>
                          </TableBody>
                        </Table>
                      </ScrollArea>
                      <Button
                        variant="outline"
                        className="self-end border-(color:--primary) text-(color:--primary) hover:bg-destructive hover:text-white mt-4"
                        onClick={handleClearCart}
                      >
                        Remove All
                      </Button>
                    </div>

                    {/* Mobile List View */}
                    <div className="md:hidden">
                      <div className="flex flex-col gap-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        <ScrollArea className="h-[400px]">
                          {cart &&
                            cart.CartItems.map((item: ICartItem, i: number) => (
                              <div
                                key={i}
                                className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0"
                              >
                                <div className="flex items-start gap-4">
                                  <Link
                                    href={`/products/${item.slug}?variantId=${item.variantId}`}
                                  >
                                    <div className="h-16 w-16 rounded-lg border border-border overflow-hidden bg-gray-50 flex items-center justify-center">
                                      <NextImage
                                        width={90}
                                        height={90}
                                        src={item.image}
                                        alt={item.name}
                                        className="max-h-full max-w-full object-contain rounded-lg"
                                      />
                                    </div>
                                  </Link>
                                  <div className="flex-1 min-w-0">
                                    <Link
                                      className="text-sm font-(family-name:--font-secondary) font-bold text-foreground hover:text-primary hover:underline block leading-tight"
                                      href={`/products/${item.slug}?variantId=${item.variantId}`}
                                      title={item.name}
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                      }}
                                    >
                                      {item.name}
                                    </Link>

                                    {/* Category and brand info */}
                                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                      {item.isNew && (
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                                          New
                                        </span>
                                      )}
                                    </div>

                                    {/* Product details */}
                                    <p className="text-xs text-muted-foreground flex flex-wrap gap-1.5 items-center mt-1">
                                      <span>
                                        {item.qty && item.unit
                                          ? `${item.qty} ${item.unit}`
                                          : ""}
                                      </span>

                                      {item.stock <= 5 && item.stock > 0 && (
                                        <span className="text-amber-600 font-medium text-[10px] bg-amber-100 px-1.5 py-0.5 rounded-full">
                                          Only {item.stock} left
                                        </span>
                                      )}
                                    </p>

                                    {/* Discounts */}
                                    {item.discountPercentage &&
                                      item.discountPercentage > 0 && (
                                        <span className="text-[10px] text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full mt-1 inline-block">
                                          Save {item.discountPercentage}%
                                        </span>
                                      )}

                                    <div className="flex justify-between items-center mt-3">
                                      <div className="flex w-32 items-center justify-between gap-2 bg-gray-100 rounded-2xl p-1">
                                        <Button
                                          size="icon"
                                          className={cn(
                                            "h-7 w-7 rounded-full",
                                            "bg-white border-primary/20",
                                            "hover:bg-primary/10 hover:text-primary"
                                          )}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleQuantityChange(
                                              Number(item.productId),
                                              Number(item.variantId),
                                              item.quantity - 1
                                            );
                                          }}
                                        >
                                          {item.quantity === 1 ? (
                                            <TrashIcon className="h-4 w-4 text-gray-500" />
                                          ) : (
                                            <MinusIcon className="h-4 w-4 text-gray-500" />
                                          )}
                                        </Button>
                                        <span className="min-w-8 text-center font-medium">
                                          {item.quantity}
                                        </span>
                                        <Button
                                          size="icon"
                                          className={cn(
                                            "h-8 w-8 rounded-full",
                                            "bg-primary border-primary",
                                            "hover:bg-primary/10 hover:text-primary"
                                          )}
                                          onClick={(e) => {
                                            e.stopPropagation();

                                            // Check stock before incrementing
                                            if (
                                              item.quantity + 1 >
                                              item.stock
                                            ) {
                                              toast.error(
                                                "Insufficient Stock",
                                                {
                                                  description: `Only ${item.stock} items available. You already have ${item.quantity} in cart.`,
                                                  duration: 4000,
                                                  style: {
                                                    background:
                                                      "var(--background)",
                                                    color: "var(--destructive)",
                                                    border:
                                                      "1px solid var(--destructive)",
                                                  },
                                                }
                                              );
                                              return;
                                            }

                                            handleQuantityChange(
                                              Number(item.productId),
                                              Number(item.variantId),
                                              item.quantity + 1
                                            );

                                            // Show success toast with stock warning if needed
                                            const remainingStock =
                                              item.stock - (item.quantity + 1);
                                            if (remainingStock <= 0) {
                                              toast.success("Cart Updated", {
                                                description:
                                                  "You now have all available stock in your cart!",
                                                duration: 4000,
                                              });
                                            } else if (remainingStock <= 3) {
                                              toast.success("Cart Updated", {
                                                description: `Only ${remainingStock} items left in stock!`,
                                                duration: 4000,
                                              });
                                            } else {
                                              toast.success(
                                                "Quantity updated successfully!",
                                                {
                                                  duration: 4000,
                                                  style: {
                                                    background:
                                                      "var(--background)",
                                                    color: "var(--primary)",
                                                    border:
                                                      "1px solid var(--primary-hover)",
                                                  },
                                                }
                                              );
                                            }
                                          }}
                                        >
                                          <PlusIcon className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      <div className="flex flex-col items-end">
                                        <span className="font-(family-name:--font-secondary) font-bold text-lg">
                                          {item.currency}
                                          {item.finalItemPrice}
                                        </span>
                                        {item.totalBasePrice !==
                                          item.finalItemPrice && (
                                          <span className="text-xs text-muted-foreground line-through font-(family-name:--font-secondary)">
                                            {item.currency}
                                            {item.totalBasePrice}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </ScrollArea>
                        <Button
                          variant="outline"
                          className="self-end border-(color:--primary) text-(color:--primary) hover:bg-destructive hover:text-white mt-4"
                          onClick={handleClearCart}
                        >
                          Remove All
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary for Desktop - Hidden on mobile */}
                <div className="hidden lg:block lg:col-span-4">
                  <Card className="rounded-none border border-gray-200 bg-white shadow-sm">
                    {/* Savings Banner */}
                    {(cart?.TotalItemDiscount > 0 ||
                      cart?.PromocodeDiscount > 0) && (
                      <div className="  p-4 rounded-t-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🥳</span>
                          <span className="text-sm font-medium text-gray-700">
                            wow you saved{" "}
                            <span className="text-red-500 font-bold">
                              {cart?.Currency}
                              {(cart?.TotalItemDiscount || 0) +
                                (cart?.PromocodeDiscount || 0)}
                            </span>{" "}
                            on this order
                          </span>
                        </div>
                      </div>
                    )}

                    <CardHeader className="">
                      <h3 className="text-lg font-bold text-gray-900 font-(family-name:--font-secondary)">
                        Order Summary
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                          <p className="text-base font-(family-name:--font-secondary) text-gray-600">
                            Items total
                          </p>
                          <span className="text-base font-(family-name:--font-secondary) text-gray-900">
                            {cart?.Currency}
                            {cart?.OriginalPrice}
                          </span>
                        </div>

                        {cart?.TotalItemDiscount > 0 && (
                          <div className="flex items-center justify-between px-2">
                            <p className="text-base font-(family-name:--font-secondary) text-gray-600">
                              Offer price
                            </p>
                            <span className="text-base font-(family-name:--font-secondary) text-green-600">
                              {cart?.Currency}
                              {subTotal.toFixed(2)}
                            </span>
                          </div>
                        )}

                        {cart?.Promocode && cart?.PromocodeDiscount > 0 && (
                          <div className="flex items-center justify-between px-2">
                            <p className="text-base font-(family-name:--font-secondary) text-gray-600">
                              Promocode ({cart?.Promocode})
                            </p>
                            <span className="text-base font-(family-name:--font-secondary) text-green-600">
                              -{cart?.Currency}
                              {cart?.PromocodeDiscount}
                            </span>
                          </div>
                        )}

                        {cart?.VAT > 0 && (
                          <div className="flex items-center justify-between px-2">
                            <p className="text-base font-(family-name:--font-secondary) text-gray-600">
                              Tax
                            </p>
                            <span className="text-base font-(family-name:--font-secondary) text-gray-900">
                              {cart?.Currency}
                              {cart?.VAT}
                            </span>
                          </div>
                        )}

                        <Separator className="my-4" />

                        <div className="flex items-center justify-between px-2">
                          <p className="text-lg font-bold text-gray-900 font-(family-name:--font-secondary)">
                            Subtotal
                          </p>
                          <span className="text-lg font-bold text-gray-900 font-(family-name:--font-secondary)">
                            {cart?.Currency}
                            {finalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-0">
                      <Button
                        className={cn(
                          "w-full h-14 text-lg font-(family-name:--font-secondary) rounded-lg",
                          canProceedToCheckout()
                            ? "bg-(color:--primary) hover:bg-(color:--primary-hover) text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        )}
                        onClick={handleCheckout}
                        disabled={!canProceedToCheckout()}
                      >
                        {canProceedToCheckout() ? (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <CreditCardIcon className="h-6 w-6" />
                              <span>Checkout</span>
                            </div>
                            <span>
                              {cart?.Currency}
                              {finalPrice.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          `Add ${cart?.Currency}${remainingAmount.toFixed(
                            2
                          )} more`
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                  {/* Minimum Cart Value Section for Desktop */}
                  {cart?.MinOrderAmount !== 0 && !canProceedToCheckout() && (
                    <div className="w-full bg-yellow-50 border-none p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <ShoppingCartIcon className="h-10 w-10 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-(family-name:--font-secondary) font-semibold text-yellow-800">
                            Minimum Cart Value Required
                          </h4>
                          <p className="text-sm text-yellow-700 mt-1 font-(family-name:--font-secondary)">
                            Your cart must have items worth at least
                            {cart?.Currency}
                            {cart?.MinOrderAmount} to proceed with the checkout.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid min-h-[60vh] place-items-center gap-6 py-6 sm:py-10 bg-gray-50 px-4">
            <Card className="w-full max-w-md border border-gray-200 bg-white shadow-sm rounded-lg p-6 text-center">
              <CardContent className="flex flex-col items-center space-y-6">
                <div className="relative size-24 sm:size-32 rounded-full bg-gray-100 p-6 border border-gray-200">
                  <PackageIcon className="size-full text-gray-400" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-(family-name:--font-secondary)">
                    Your Shopping Cart is Empty
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 font-(family-name:--font-primary)">
                    Looks like you haven&apos;t added anything to your cart yet
                  </p>
                </div>

                <Button
                  className="mt-4 w-full bg-(color:--primary) text-white hover:bg-(color:--primary-hover) transition-colors rounded-lg h-12 text-base font-(family-name:--font-secondary) font-semibold"
                  size="lg"
                  onClick={() => router.push("/")}
                >
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  <span>Start Shopping</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
