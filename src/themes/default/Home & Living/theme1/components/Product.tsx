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
import { Plus, Minus, X } from "lucide-react";
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

      <Card className="group relative rounded-none w-full h-full overflow-hidden border border-gray-200 bg-gray-100 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-300 ease-in-out flex flex-col p-0 pb-14">
        {" "}
        {/* extra bottom padding for cart controls */}
        {/* Top badges */}
        <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
          {hasDiscount && (
            <Badge className="bg-[#E97171] text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-md h-12">
              -{discountPercent}%
            </Badge>
          )}
          {productWithDetails.isNew === 1 && (
            <Badge className="bg-[#2EC1AC] text-white border-0 rounded-full px-3 py-1 text-xs font-semibold shadow-md">
              New
            </Badge>
          )}
        </div>
        {/* Hover Overlay - covers full card, only if not in cart */}
        {(!productInCart || productInCart.quantity === 0) && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm">
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <Button
                className="bg-white text-primary font-semibold rounded-md px-6 py-2 shadow-lg hover:bg-gray-100 transition-colors"
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
            </div>
          </div>
        )}
        {/* Product Image - Clickable */}
        <Link
          href={`/products/${product.slug}?variantId=${product.variants[selectedVariantIndex]?.variantId}`}
          className="block relative aspect-[4/3] md:aspect-[4/2.7] w-full min-h-[220px] md:min-h-[260px] bg-gray-50 cursor-pointer overflow-hidden"
        >
          <div className="relative w-full h-full">
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
              className="object-cover w-full h-full transition-all duration-300 group-hover:scale-105"
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
            />
          </div>
        </Link>
        {/* Main Content - info at bottom */}
        <CardContent className="flex flex-col gap-2 px-4 py-3 flex-grow">
          {/* Product Title */}
          <Link
            href={`/products/${product.slug}?variantId=${product.variants[selectedVariantIndex]?.variantId}`}
            className="hover:text-gray-600 transition-colors"
          >
            <h3 className="font-semibold text-gray-900 line-clamp-1 leading-tight text-base mb-1">
              {product.name}
            </h3>
          </Link>
          <div className="text-xs text-gray-500 mb-1 line-clamp-1">
            {productWithDetails.categoryName || "Stylish cafe chair"}
          </div>
          {/* Variant selector for multiple variants */}
          {product.variants.length > 1 ? (
            <div onClick={(e) => e.stopPropagation()} className="mb-1">
              <Select
                onValueChange={handleShadcnVariantChange}
                defaultValue={product.variants[
                  selectedVariantIndex
                ]?.variantId?.toString()}
              >
                <SelectTrigger className="h-8 w-full bg-white border-gray-200 text-xs rounded-md shadow-sm hover:border-gray-400 focus:border-primary focus:ring-1 focus:ring-primary">
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
                        className="text-xs"
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
            <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-md mb-1">
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
          {/* Price */}
          <div className="flex items-end gap-2 mt-1">
            <span className="text-base font-bold text-gray-900">
              {product.variants[selectedVariantIndex]?.currency || ""}
              {product.variants[
                selectedVariantIndex
              ]?.offerPrice?.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {product.variants[selectedVariantIndex]?.currency || ""}
                {product.variants[
                  selectedVariantIndex
                ]?.basePrice?.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>
        {/* Cart Controls - always at bottom, only if in cart and quantity > 0 */}
        {productInCart && productInCart.quantity > 0 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 right-0 bottom-0 z-40 flex items-center justify-center bg-white border-t border-gray-200 rounded-b-lg px-2 py-2 gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary bg-white rounded-none border border-primary"
              onClick={handleDecrementWithToast}
            >
              <Minus className="h-4 w-4 text-primary" />
            </Button>
            <span className="mx-2 min-w-[2rem] h-full flex items-center justify-center text-center font-medium text-primary">
              {productInCart.quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-primary bg-white rounded-none border border-primary"
              onClick={handleIncrementWithToast}
            >
              <Plus className="h-4 w-4 text-primary" />
            </Button>
          </div>
        )}
      </Card>
    </>
  );
};

export default Product;
