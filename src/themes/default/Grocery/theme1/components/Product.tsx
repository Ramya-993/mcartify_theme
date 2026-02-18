"use client";

import Image from "next/image";
import IProduct from "@/types/product";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useProduct } from "@/themes/hooks/useProduct";
import { useAddToCart } from "@/themes/hooks/useAddToCart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Plus, Minus, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";
import StoreStatusDialog from "./StoreStatusDialog";
import { toast } from "sonner";

interface ProductProps {
  product: IProduct;
}

// Extend IProduct type to include additional properties
type ProductWithDetails = IProduct & {
  isNew?: number;
  avgRating?: number;
  reviewCount?: number;
  brandName?: string;
  categoryName?: string;
  discountPercentage?: number;
};

// Helper type for variant with images
type VariantWithImages = {
  variantId: number;
  images?: Array<{ image: string; isPrimary?: number }>;
  basePrice: number;
  offerPrice: number;
  stock: number;
  qty?: string | number;
  unit?: string;
  currency?: string;
  sku?: string;
  attributes?: Array<{
    id: number;
    name: string;
    value: string;
    isVariantDimension: number;
    options?: string[];
  }>;
};

// Helper function to get variant attribute text - dynamically handles all variant attributes
const getVariantAttributeText = (variant: VariantWithImages): string => {
  if (!variant.attributes)
    return variant.qty && variant.unit ? `${variant.qty} ${variant.unit}` : "";

  // Check for metric values first (grocery products)
  const metricValue = variant.attributes.find(
    (attr) => attr.name === "MetricValue"
  );
  const metricType = variant.attributes.find(
    (attr) => attr.name === "MetricType"
  );

  if (metricValue && metricType) {
    return `${metricValue.value} ${metricType.value}`;
  }

  // Dynamic handling for all other attributes based on isVariantDimension
  const variantDimensions = variant.attributes.filter(
    (attr) => attr.isVariantDimension === 1
  );

  if (variantDimensions.length > 0) {
    // Filter out MetricValue and MetricType since we already handled them
    const otherDimensions = variantDimensions.filter(
      (attr) => attr.name !== "MetricValue" && attr.name !== "MetricType"
    );

    if (otherDimensions.length > 0) {
      return otherDimensions.map((attr) => attr.value).join(" • ");
    }
  }

  // Default to qty and unit if nothing else found
  return variant.qty && variant.unit ? `${variant.qty} ${variant.unit}` : "";
};

// Generate structured data for individual product (for client-side components)
const generateProductStructuredData = (
  product: ProductWithDetails,
  variant: VariantWithImages
) => {
  const currentPrice = variant.offerPrice || variant.basePrice;
  const originalPrice = variant.basePrice;
  const discountPercentage =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || "",
    image: product.imageURL || "",
    sku: variant.sku || `${product.productId}-${variant.variantId}`,
    category: product.categoryName || "Grocery",
    brand: {
      "@type": "Brand",
      name: "Store Brand",
    },
    offers: {
      "@type": "Offer",
      price: currentPrice,
      priceCurrency: "INR",
      availability:
        variant.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days from now
      seller: {
        "@type": "Organization",
        name: "Store",
      },
    },
    aggregateRating:
      product.avgRating && product.avgRating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.avgRating,
            reviewCount: product.reviewCount || 1,
          }
        : undefined,
    additionalProperty:
      variant.attributes?.map((attr) => ({
        "@type": "PropertyValue",
        name: attr.name,
        value: attr.value,
      })) || [],
  };
};

const Product = ({ product }: ProductProps) => {
  // Cast product to extended type with additional properties
  const productWithDetails = product as ProductWithDetails;
  const router = useRouter();
  const storeStatus = useSelector(
    (state: RootState) => state.store.storestatus
  );
  const isStoreOpen = useSelector(
    (state: RootState) => state.store.store?.isStoreOpen
  );
  console.log("isStoreOpen in Product:", isStoreOpen);
  const { selectedVariantIndex, setSelectedVariantIndex } = useProduct(product);
  const [storeClosedDialog, setStoreClosedDialog] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const { customer } = useSelector((state: RootState) => state.user);
  console.log("customer in Product:", customer);

  // Get current variant for structured data
  const currentVariant = product.variants[
    selectedVariantIndex
  ] as VariantWithImages;
  const structuredData = generateProductStructuredData(
    productWithDetails,
    currentVariant
  );

  const handleShadcnVariantChange = (value: string) => {
    const index = product.variants.findIndex(
      (v) => v.variantId.toString() === value
    );
    if (index !== -1) {
      setSelectedVariantIndex(index);
    }
  };

  // Memoized function to get variant images - prioritize variant images, fallback to product image
  const getVariantImage = useMemo(() => {
    return (variant: VariantWithImages): string => {
      // Check if variant has images array and if it contains items
      if (
        variant.images &&
        Array.isArray(variant.images) &&
        variant.images.length > 0
      ) {
        // Try to find primary image first
        const primaryImage = variant.images.find((img) => img.isPrimary === 1);
        if (primaryImage) {
          return primaryImage.image;
        }
        // If no primary image, use the first one
        return variant.images[0].image;
      }
      // Fallback to product image
      return product?.imageURL || "/images/dummy/placeholder.png";
    };
  }, [product?.imageURL]);

  // Function to get second image for hover effect
  const getHoverImage = useMemo(() => {
    return (variant: VariantWithImages): string | null => {
      if (
        variant.images &&
        Array.isArray(variant.images) &&
        variant.images.length > 1
      ) {
        // Find the second image (non-primary or second in array)
        const secondImage =
          variant.images.find((img) => img.isPrimary !== 1) ||
          variant.images[1];
        return secondImage ? secondImage.image : null;
      }
      return null;
    };
  }, []);

  // Memoize the current variant image to prevent unnecessary re-renders
  const currentVariantImage = useMemo(() => {
    const currentVariant = product.variants[
      selectedVariantIndex
    ] as VariantWithImages;
    return getVariantImage(currentVariant);
  }, [product.variants, selectedVariantIndex, getVariantImage]);

  // Memoize the hover image
  const currentHoverImage = useMemo(() => {
    const currentVariant = product.variants[
      selectedVariantIndex
    ] as VariantWithImages;
    return getHoverImage(currentVariant);
  }, [product.variants, selectedVariantIndex, getHoverImage]);

  // Extract cart handling functions from useAddToCart hook
  const cartFunctions = useAddToCart({
    productId: product.productId,
    variantId: product.variants[selectedVariantIndex]?.variantId,
    stock: product?.variants[selectedVariantIndex]?.stock,
  });

  const { productInCart, handleDecrement, handleIncrement, handleAddToCart } =
    cartFunctions;

  // Wrapper for add to cart that checks store status and location
  const checkStoreAndAddToCart = (e: React.MouseEvent) => {
    // Check if there's a valid location set
    // Look for stored location or customer location
    // const storedLocation =
    //   localStorage.getItem("selectedLocation") ||
    //   localStorage.getItem("userLocation") ||
    //   localStorage.getItem("location");
    // const hasValidLocation = customer?.location || storedLocation;

    // if (!hasValidLocation) {
    //   e.stopPropagation(); // Prevent card click
    //   toast.error("Location Required", {
    //     duration: 4000,
    //     style: {
    //       background: "var(--background)",
    //       color: "var(--destructive)",
    //       border: "1px solid var(--destructive)",
    //     },
    //     actionButtonStyle: {
    //       background: "var(--destructive)",
    //       color: "var(--on-destructive)",
    //       border: "1px solid var(--destructive)",
    //     },
    //   });
    //   return;
    // }

    // Check store status (paused) OR business hours (closed)
    if (storeStatus?.storePaused || !isStoreOpen?.isStoreOpenNow) {
      e.stopPropagation(); // Prevent card click
      setStoreClosedDialog(true);
      return;
    }

    const currentStock = product?.variants[selectedVariantIndex]?.stock || 0;

    // Check if product is out of stock
    if (currentStock <= 0) {
      toast.error("Product Out of Stock", {
        description: "This product is currently not available",
        duration: 3000,
        style: {
          background: "var(--background)",
          color: "var(--destructive)",
          border: "1px solid var(--destructive)",
        },
      });
      return;
    }

    // If store is not paused and location exists, proceed with normal add to cart
    handleAddToCart(e);

    // Show success toast with stock info
    if (currentStock <= 5) {
      toast.success("Added to Cart", {
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--primary)",
          border: "1px solid var(--primary-hover)",
        },
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--on-primary)",
          border: "1px solid var(--primary-hover)",
        },
      });
    } else {
      toast.success("Cart Updated Successfully", {
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 3000,
        style: {
          background: "var(--background)",
          color: "var(--primary)",
          border: "1px solid var(--primary-hover)",
        },
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--on-primary)",
          border: "1px solid var(--primary-hover)",
        },
      });
    }
  };

  // Wrapper for increment that shows toast
  const handleIncrementWithToast = (e: React.MouseEvent) => {
    // Check if there's a valid location set
    // const storedLocation =
    //   localStorage.getItem("selectedLocation") ||
    //   localStorage.getItem("userLocation") ||
    //   localStorage.getItem("location");
    // const hasValidLocation = customer?.location || storedLocation;

    // if (!hasValidLocation) {
    //   e.stopPropagation();
    //   toast.error("Location Required", {
    //     duration: 4000,
    //     style: {
    //       background: "var(--background)",
    //       color: "var(--destructive)",
    //       border: "1px solid var(--destructive)",
    //     },
    //     actionButtonStyle: {
    //       background: "var(--destructive)",
    //       color: "var(--on-destructive)",
    //       border: "1px solid var(--destructive)",
    //     },
    //   });
    //   return;
    // }

    const currentStock = product?.variants[selectedVariantIndex]?.stock || 0;
    const currentQuantity = productInCart?.quantity || 0;

    // Check if we can increment (stock vs current quantity + 1)
    if (currentQuantity + 1 > currentStock) {
      toast.error("Insufficient Stock", {
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--destructive)",
          border: "1px solid var(--destructive)",
        },
      });
      return;
    }

    handleIncrement(e);

    // Show appropriate toast based on remaining stock
    const remainingStock = currentStock - (currentQuantity + 1);
    if (remainingStock <= 0) {
      toast.success("Cart Updated", {
        description: "You now have all available stock in your cart!",
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--primary)",
          border: "1px solid var(--primary-hover)",
        },
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--on-primary)",
          border: "1px solid var(--primary-hover)",
        },
      });
    } else if (remainingStock <= 3) {
      toast.success("Cart Updated", {
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--primary)",
          border: "1px solid var(--primary-hover)",
        },
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--on-primary)",
          border: "1px solid var(--primary-hover)",
        },
      });
    } else {
      toast.success("Cart Updated Successfully", {
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 3000,
        style: {
          background: "var(--background)",
          color: "var(--primary)",
          border: "1px solid var(--primary-hover)",
        },
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--on-primary)",
          border: "1px solid var(--primary-hover)",
        },
      });
    }
  };

  // Wrapper for decrement that shows toast
  const handleDecrementWithToast = (e: React.MouseEvent) => {
    handleDecrement(e);
    toast.success("Cart Updated Successfully", {
      action: {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
      duration: 3000,
      style: {
        background: "var(--background)",
        color: "var(--primary)",
        border: "1px solid var(--primary-hover)",
      },
      actionButtonStyle: {
        background: "var(--primary)",
        color: "var(--on-primary)",
        border: "1px solid var(--primary-hover)",
      },
    });
  };

  // Calculate discount percentage
  const discountPercent = Math.round(
    (1 -
      product.variants[selectedVariantIndex]?.offerPrice /
        product.variants[selectedVariantIndex]?.basePrice) *
      100
  );

  const hasDiscount =
    product.variants[selectedVariantIndex]?.basePrice !==
    product.variants[selectedVariantIndex]?.offerPrice;

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Using reusable Store Status Dialog */}
      <StoreStatusDialog
        isOpen={storeClosedDialog}
        onOpenChange={setStoreClosedDialog}
        storeStatus={storeStatus || {}}
        isStoreOpen={isStoreOpen}
      />

      <Card className="group relative w-full h-full py-1 pb-6 overflow-hidden border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 ease-in-out flex flex-col">
        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <div className="flex gap-1">
            {/* {hasDiscount && (
              <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-0 rounded-full px-2 py-1 text-xs font-medium">
                save {discountPercent}%
              </Badge>
            )} */}
            {productWithDetails.isNew === 1 && (
              <Badge className="bg-green-50 text-green-600 hover:bg-green-50 border-0 rounded-full px-2 py-1 text-xs font-medium">
                New
              </Badge>
            )}
          </div>
          {/* <button
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
          >
            <Heart className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
          </button> */}
        </div>

        {/* Product Image - Clickable */}
        <Link
          href={`/products/${product.slug}?variantId=${product.variants[selectedVariantIndex]?.variantId}`}
          className="block"
        >
          <div className="relative aspect-square pl-6 pr-6 pb-0 bg-gray-50/50 cursor-pointer">
            <div
              className="relative w-full h-full rounded-lg overflow-hidden group-hover:[transform:rotateY(180deg)] transition-transform duration-700 ease-in-out"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Image
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                src={
                  isImageHovered && currentHoverImage
                    ? currentHoverImage
                    : currentVariantImage ||
                      product?.imageURL ||
                      "/images/dummy/placeholder.png"
                }
                alt={product.name}
                priority
                className="object-contain transition-all duration-300 group-hover:scale-105 group-hover:[transform:rotateY(180deg)]"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              />
            </div>
          </div>
        </Link>

        {/* Main Content - flex grow to push cart controls to bottom */}
        <CardContent className="space-y-3 flex-grow flex flex-col">
          <div className="flex-grow space-y-3">
            {/* Product Title - Clickable */}
            <div className="h-14 flex items-start mt-0 mb-6">
              <Link
                href={`/products/${product.slug}?variantId=${product.variants[selectedVariantIndex]?.variantId}`}
                className="hover:text-gray-600 transition-colors"
              >
                <h3 className="font-medium text-gray-900 line-clamp-2 leading-relaxed text-2xl ">
                  {product.name}
                </h3>
              </Link>
            </div>

            {/* Variant selector for multiple variants */}
            {product.variants.length > 1 ? (
              <div onClick={(e) => e.stopPropagation()}>
                <Select
                  onValueChange={handleShadcnVariantChange}
                  defaultValue={product.variants[
                    selectedVariantIndex
                  ]?.variantId?.toString()}
                >
                  <SelectTrigger className="h-9 w-full bg-white border-gray-300 text-sm rounded-md shadow-sm hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary">
                    <SelectValue>
                      {(() => {
                        const selectedVariant = product.variants[
                          selectedVariantIndex
                        ] as VariantWithImages;
                        const variantText =
                          getVariantAttributeText(selectedVariant);
                        return (
                          variantText ||
                          `${selectedVariant.qty || ""} ${
                            selectedVariant.unit || ""
                          }`
                        );
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {product.variants.map((variant) => {
                      const variantText = getVariantAttributeText(
                        variant as VariantWithImages
                      );
                      return (
                        <SelectItem
                          key={variant.variantId}
                          value={variant.variantId.toString()}
                          className="text-sm"
                        >
                          {variantText ||
                            `${variant.qty || ""} ${variant.unit || ""}`}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              /* Single variant display */
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                {(() => {
                  const selectedVariant = product.variants[
                    selectedVariantIndex
                  ] as VariantWithImages;
                  const variantText = getVariantAttributeText(selectedVariant);
                  return (
                    variantText ||
                    `${selectedVariant.qty || ""} ${selectedVariant.unit || ""}`
                  );
                })()}
              </div>
            )}

            {/* Rating */}
            {productWithDetails.avgRating > 0 && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(productWithDetails.avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">
                  ({productWithDetails.reviewCount || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-semibold text-gray-900">
                {product.variants[selectedVariantIndex]?.currency || ""}
                {product.variants[selectedVariantIndex]?.offerPrice}
              </span>

              {hasDiscount && (
                <span className="text-sm text-gray-400 line-through">
                  {product.variants[selectedVariantIndex]?.currency || ""}
                  {product.variants[selectedVariantIndex]?.basePrice}
                </span>
              )}
              {hasDiscount && (
                <Badge className="bg-[#F0508A] text-red-200 hover:bg-red-500 border-0 rounded-full px-2 py-1 mt-5 text-xs font-medium">
                  save {discountPercent}%
                </Badge>
              )}
            </div>
          </div>

          {/* Cart Controls - Always at bottom */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 flex justify-center"
          >
            {productInCart ? (
              <div className="flex items-center justify-center">
                <div className="flex  h-8  flex-row justify-between items-center bg-primary ">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white bg-white rounded-none border border-primary"
                    onClick={handleDecrementWithToast}
                  >
                    <Minus className="h-4 w-4 text-primary" />
                  </Button>
                  <span className="mx-3 min-w-[2rem] h-full flex items-center justify-center text-center font-medium text-white">
                    {productInCart.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-white bg-white rounded-none border border-primary"
                    onClick={handleIncrementWithToast}
                  >
                    <Plus className="h-4 w-4 text-primary" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className=" bg-primary hover:bg-primary/80 text-white rounded-lg h-10 font-medium"
                onClick={checkStoreAndAddToCart}
                disabled={product.variants[selectedVariantIndex]?.stock <= 0}
              >
                {product.variants[selectedVariantIndex]?.stock <= 0 ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Out of Stock
                  </>
                ) : (
                  "Add to cart"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Product;
