"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AxiosFetcher } from "@/utils/axios";
import type IProductDescResponce from "@/types/productDescResponse";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Added Select components

// Extended interface to add missing properties
interface ExtendedProductDesc extends IProductDescResponce {
  isNew?: number;
  avgRating?: number;
  reviewCount?: number;
  brandName?: string;
  categorySlug?: string;
  attributes?: Array<{
    name: string;
    value: string;
    unit?: string | null;
    inputType?: string;
    isVariantDimension?: number;
  }>;
}
import {
  Star,
  Check,
  Eye,
  ShoppingCart,
  Plus,
  Minus,
  X,
  AlertCircle,
  AlertTriangle,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Define interfaces for the attribute structure
interface ProductAttribute {
  name: string;
  unit: string | null;
  value: string;
  inputType: string;
  isVariantDimension: number;
}

type VariantWithAttributes = IProductDescResponce["variants"][0] & {
  attributes?: ProductAttribute[];
  variantName?: string | null;
  variantDescription?: string | null;
};

import { useAddToCart } from "@/themes/hooks/useAddToCart";
import Breadcrumb from "@/components/ui/breadcrumbs";
import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";
import StoreStatusDialog from "./StoreStatusDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Shadcn UI components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IProductDescProps {
  slug: string;
  variantId: string;
  initialProductData?: ExtendedProductDesc | null;
  initialError?: string | null;
}

const ProductDescClient = ({
  slug,
  variantId,
  initialProductData = null,
  initialError = null,
}: IProductDescProps) => {
  console.log(
    "💻 CLIENT-SIDE: ProductDescClient component executing on client"
  );
  console.log("💻 CLIENT-SIDE: Received props:", {
    slug,
    variantId,
    hasInitialData: !!initialProductData,
    hasInitialError: !!initialError,
  });
  const router = useRouter();
  const [productDesc, setProductDesc] = useState<ExtendedProductDesc | null>(
    initialProductData
  );
  const [loading, setLoading] = useState<boolean>(
    !initialProductData && !initialError
  );
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [storeClosedDialog, setStoreClosedDialog] = useState(false);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const storeStatus = useSelector(
    (state: RootState) => state.store.storestatus
  );
  const isStoreOpen = useSelector(
    (state: RootState) => state.store.store?.isStoreOpen
  );
  // const { customer } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Set initial data if provided from server
    if (initialProductData) {
      setProductDesc(initialProductData);
      setLoading(false);
      console.log(
        "💻 CLIENT-SIDE: Using server-side product data:",
        initialProductData.name
      );
    } else if (initialError) {
      setLoading(false);
      console.log("💻 CLIENT-SIDE: Received server-side error:", initialError);
    }
  }, [initialProductData, initialError]);

  useEffect(() => {
    if (productDesc?.variants) {
      const selectedVariant = productDesc.variants.find(
        (variant) => variant.variantId === Number(variantId)
      );
      if (selectedVariant) {
        const index = productDesc.variants.indexOf(selectedVariant);
        setSelectedVariantIndex(index);
      }
    }
  }, [productDesc, variantId]);

  // Fallback client-side fetch only if no initial data and no error
  const fetchData = useCallback(async () => {
    try {
      console.log(
        "💻 CLIENT-SIDE: Fallback - Fetching product data client-side"
      );
      const res = await AxiosFetcher.get(`/stores/product/details/${slug}`);
      if (res.data.Status) {
        setProductDesc(res?.data?.Product);
        console.log("💻 CLIENT-SIDE: Client-side fetch successful");
      }
    } catch (e: unknown) {
      console.error("💻 CLIENT-SIDE: Client-side fetch failed:", e);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    // Only fetch if no initial data provided and no error
    if (!initialProductData && !initialError) {
      console.log(
        "💻 CLIENT-SIDE: No server-side data, initiating client-side fetch"
      );
      fetchData();
    }
  }, [fetchData, initialProductData, initialError]);

  // Get variant images - prioritize variant images, fallback to product images
  const getVariantImages = (variant: VariantWithAttributes) => {
    // Check if variant has images array and if it contains items
    if (
      variant.images &&
      Array.isArray(variant.images) &&
      variant.images.length > 0
    ) {
      return variant.images.map((img) => img.image);
    }
    // Fallback to product images
    return (
      productDesc?.productImages?.map((img) => img.imageURL || img.image) || []
    );
  };

  // Handler for variant selection
  const handleVariantSelect = (index: number) => {
    setSelectedVariantIndex(index);
    setSelectedImage(0); // Reset to first image when changing variants
  };

  // Handler for image selection
  const handleImageSelect = (index: number) => {
    setSelectedImage(index);
  };

  // Carousel navigation handlers
  const VISIBLE_THUMBNAILS = 4; // Number of thumbnails visible at once

  const handlePrevThumbnails = () => {
    setThumbnailStartIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextThumbnails = () => {
    setThumbnailStartIndex((prev) => {
      const maxStart = Math.max(0, currentImages.length - VISIBLE_THUMBNAILS);
      return Math.min(maxStart, prev + 1);
    });
  };

  // Get stock status with color coding and improved styling
  const getStockStatus = (stock: number) => {
    if (stock <= 0) {
      return {
        label: "Out of Stock",
        color: "text-(color:--out-of-stock-text)",
        bgColor: "bg-(color:--out-of-stock-bg)",
        border: "border-(color:--out-of-stock-border)",
        icon: <X className="h-3.5 w-3.5 mr-1" />,
        badge: "text-xs font-medium px-2.5 py-0.5 rounded-full",
        variant: "destructive" as const,
      };
    } else if (stock <= 5) {
      return {
        label: "Very Low Stock",
        color: "text-(color:--very-low-stock-text)",
        bgColor: "bg-(color:--very-low-stock-bg)",
        border: "border-(color:--very-low-stock-border)",
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />,
        badge: "text-xs font-medium px-2.5 py-0.5 rounded-full",
        variant: "destructive" as const,
      };
    } else if (stock <= 10) {
      return {
        label: "Limited Stock",
        color: "text-(color:--limited-stock-text)",
        bgColor: "bg-(color:--limited-stock-bg)",
        border: "border-(color:--limited-stock-border)",
        icon: <AlertTriangle className="h-3.5 w-3.5 mr-1" />,
        badge: "text-xs font-medium px-2.5 py-0.5 rounded-full",
        variant: "secondary" as const,
      };
    } else {
      return {
        label: "In Stock",
        color: "text-(color:--in-stock-text)",
        bgColor: "bg-(color:--in-stock-bg)",
        border: "border-(color:--in-stock-border)",
        icon: <Check className="h-3.5 w-3.5 mr-1" />,
        badge: "text-xs font-medium px-2.5 py-0.5 rounded-full",
        variant: "default" as const,
      };
    }
  };

  // Get discount percentage
  const getDiscountPercentage = (base: number, offer: number) => {
    return Math.round((1 - offer / base) * 100);
  };

  // Format variant attributes for display
  const getVariantAttributesText = (variant: VariantWithAttributes) => {
    if (!variant.attributes) return "";

    const variantDimensions = variant.attributes.filter(
      (attr) => attr.isVariantDimension === 1
    );

    const metricValue = variantDimensions.find(
      (attr) => attr.name === "MetricValue"
    );
    const metricType = variantDimensions.find(
      (attr) => attr.name === "MetricType"
    );

    if (metricValue && metricType) {
      return `${metricValue.value} ${metricType.value}`;
    }

    const otherDimensions = variantDimensions.filter(
      (attr) => attr.name !== "MetricType" && attr.name !== "MetricValue"
    );

    if (otherDimensions.length > 0) {
      return otherDimensions.map((attr) => attr.value).join(" • ");
    }

    return `${variant.qty} ${variant.unit}`;
  };

  // AddToCart functionality
  const { productInCart, handleDecrement, handleIncrement, handleAddToCart } =
    useAddToCart({
      productId: productDesc ? Number(productDesc.productId) : 0,
      variantId: productDesc?.variants?.[selectedVariantIndex]?.variantId || 0,
      stock: productDesc?.variants?.[selectedVariantIndex]?.stock || 0,
    });

  // Wrapper for add to cart that checks store status
  const checkStoreAndAddToCart = (e: React.MouseEvent) => {
    // Check if there's a valid location set
    // Look for stored location or customer location
    // const storedLocation =
    //   localStorage.getItem("selectedLocation") ||
    //   localStorage.getItem("userLocation") ||
    //   localStorage.getItem("location");
    // const hasValidLocation = customer?.location || storedLocation;

    // if (!hasValidLocation) {
    //   e.preventDefault(); // Prevent default link behavior
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
    //       color: "var(--destructive-foreground)",
    //       border: "1px solid var(--destructive)",
    //     },
    //   });
    //   return;
    // }

    // Check store status (paused) OR business hours (closed)
    if (storeStatus?.storePaused || !isStoreOpen?.isStoreOpenNow) {
      e.preventDefault(); // Prevent default link behavior
      e.stopPropagation(); // Prevent card click
      setStoreClosedDialog(true);
      return;
    }

    const currentStock =
      productDesc?.variants?.[selectedVariantIndex]?.stock || 0;

    // Check if product is out of stock
    if (currentStock <= 0) {
      toast.error("Product Out of Stock", {
        description: "This product is currently not available",
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--destructive)",
        },
        className: "border-destructive text-destructive",
      });
      return;
    }

    // If store is not paused, proceed with normal add to cart
    handleAddToCart(e);

    // Show success toast with enhanced messaging
    const productName = productDesc?.name || "Product";
    const variantText = getVariantAttributesText(currentVariant);

    if (currentStock <= 5) {
      toast.success("Added to Cart!", {
        description: `${productName} ${
          variantText ? `(${variantText})` : ""
        } - Only ${currentStock} left in stock`,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 5000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--primary)",
        },
        className: "border-primary",
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "1px solid var(--primary)",
        },
      });
    } else {
      toast.success("Added to Cart!", {
        description: `${productName} ${
          variantText ? `(${variantText})` : ""
        } added successfully`,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 3000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--primary)",
        },
        className: "border-primary",
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "1px solid var(--primary)",
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
    //       color: "var(--destructive-foreground)",
    //       border: "1px solid var(--destructive)",
    //     },
    //   });
    //   return;
    // }

    const currentStock =
      productDesc?.variants?.[selectedVariantIndex]?.stock || 0;
    const currentQuantity = productInCart?.quantity || 0;

    // Check if we can increment (stock vs current quantity + 1)
    if (currentQuantity + 1 > currentStock) {
      toast.error("Cannot Add More", {
        description: `Only ${currentStock} items available. You have ${currentQuantity} in cart.`,
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--destructive)",
        },
        className: "border-destructive text-destructive",
      });
      return;
    }

    handleIncrement(e);

    // Show appropriate toast based on remaining stock
    const remainingStock = currentStock - (currentQuantity + 1);
    const newQuantity = currentQuantity + 1;
    const productName = productDesc?.name || "Product";
    const variantText = getVariantAttributesText(currentVariant);

    if (remainingStock <= 0) {
      toast.success("Maximum Reached!", {
        description: `${productName} quantity: ${newQuantity} - You now have all available stock!`,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--primary)",
        },
        className: "border-primary",
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "1px solid var(--primary)",
        },
      });
    } else if (remainingStock <= 3) {
      toast.success("Quantity Updated!", {
        description: `${productName} quantity: ${newQuantity} - Only ${remainingStock} left in stock!`,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--primary)",
        },
        className: "border-primary",
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "1px solid var(--primary)",
        },
      });
    } else {
      toast.success("Quantity Updated!", {
        description: `${productName} ${
          variantText ? `(${variantText})` : ""
        } quantity: ${newQuantity}`,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
        duration: 3000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--primary)",
        },
        className: "border-primary",
        actionButtonStyle: {
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "1px solid var(--primary)",
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

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!productDesc) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md mx-auto">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-(color:--muted) rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-(color:--muted-foreground)"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.691-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <h3 className="text-xl font-(weight:--fw-semibold) text-(color:--foreground)">
              Product Not Found
            </h3>
            <p className="text-(size:--fs-base) text-(color:--muted-foreground) leading-relaxed">
              The product you&apos;re looking for doesn&apos;t exist or has been
              removed from our catalog.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-(color:--primary) text-(color:--primary-foreground) rounded-(--radius-lg) font-(weight:--fw-medium) hover:bg-(color:--primary)/90 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="pt-2 border-t border-(color:--border)">
            <p className="text-(size:--fs-sm) text-(color:--muted-foreground)">
              Need help?
              <a
                href="/contact-us"
                className="ml-1 text-(color:--primary) hover:text-(color:--primary)/80 font-(weight:--fw-medium) transition-colors duration-200"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentVariant = productDesc.variants[
    selectedVariantIndex
  ] as VariantWithAttributes;
  const currentImages = getVariantImages(currentVariant);

  console.log("productDDSADASDSADSAesc", productDesc);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="container max-w-7xl px-4 md:px-6 py-4 mx-auto">
          <Breadcrumb
            crumbItems={[
              { href: "/", label: "Home", isCurrent: false, isDisabled: false },
              {
                href: `/products/category/${productDesc.categorySlug}`,
                label: productDesc.categoryName,
                isCurrent: false,
                isDisabled: false,
              },
              {
                href: "",
                label: productDesc.name,
                isCurrent: true,
                isDisabled: true,
              },
            ]}
          />
        </div>

        {/* Main Product Section */}
        <div className="container mx-auto max-w-7xl px-4 md:px-6 pb-8 overflow-x-hidden">
          <div className="grid gap-6 md:gap-8 lg:grid-cols-2 w-full max-w-full">
            {/* Image Gallery */}
            <div className="space-y-4 w-full max-w-full flex flex-col items-center">
              <motion.div
                className="aspect-square overflow-hidden rounded-xl bg-muted relative group w-full max-w-[320px] md:max-w-none h-auto"
                layoutId="main-image"
              >
                <Image
                  src={currentImages[selectedImage] || "/placeholder.svg"}
                  alt="Product image"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setShowImageModal(true)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </motion.div>

              {/* Thumbnail Gallery with Carousel */}
              {currentImages.length > 1 && (
                <div className="w-full max-w-[320px] md:max-w-full overflow-hidden">
                  <div className="relative">
                    {/* Previous Button */}
                    {thumbnailStartIndex > 0 && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 md:h-10 md:w-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                        onClick={handlePrevThumbnails}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                    )}

                    {/* Thumbnail Container */}
                    <div className="px-6 md:px-8 overflow-hidden">
                      <div
                        className="flex gap-3 pb-2 transition-transform duration-300 ease-in-out justify-center md:justify-start"
                        style={{
                          transform: `translateX(-${
                            thumbnailStartIndex * (92 + 12)
                          }px)`, // 92px width (80px + 12px gap) + 12px gap
                          width: `${currentImages.length * (92 + 12)}px`, // Total width to prevent overflow
                        }}
                        aria-label="Product image selection"
                      >
                        {currentImages.map((image, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleImageSelect(index)}
                            className={`flex-shrink-0 aspect-square w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 overflow-hidden ${
                              selectedImage === index
                                ? "border-primary shadow-md ring-2 ring-primary/20"
                                : "border-muted hover:border-primary/50 transition-all duration-200"
                            }`}
                          >
                            <div className="relative w-full h-full">
                              <Image
                                src={image || "/placeholder.svg"}
                                alt={`Product image ${index + 1}`}
                                fill
                                sizes="(max-width: 768px) 80px, 96px"
                                className="object-contain"
                              />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Next Button */}
                    {thumbnailStartIndex <
                      currentImages.length - VISIBLE_THUMBNAILS && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 md:h-10 md:w-10 bg-background/80 backdrop-blur-sm hover:bg-background"
                        onClick={handleNextThumbnails}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Carousel Indicators */}
                  {currentImages.length > VISIBLE_THUMBNAILS && (
                    <div className="flex justify-center mt-3 gap-1">
                      {Array.from({
                        length: Math.ceil(
                          currentImages.length / VISIBLE_THUMBNAILS
                        ),
                      }).map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            Math.floor(
                              thumbnailStartIndex / VISIBLE_THUMBNAILS
                            ) === index
                              ? "bg-primary"
                              : "bg-muted hover:bg-muted-foreground/50"
                          }`}
                          onClick={() =>
                            setThumbnailStartIndex(index * VISIBLE_THUMBNAILS)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-4 md:space-y-6 px-2 md:px-0">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {productDesc?.isNew === 1 && (
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> New
                    </Badge>
                  )}
                  {(productDesc?.avgRating ?? 0) > 0 && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(productDesc.avgRating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({productDesc?.reviewCount ?? 0})
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 wrap-anywhere">
                  {productDesc?.name}
                </h1>

                {/* Brand Badge */}
                {productDesc?.brandName && (
                  <div className="mb-2">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Award className="h-3.5 w-3.5" />
                      <span>{productDesc.brandName}</span>
                    </Badge>
                  </div>
                )}

                {/* Product Info Badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {(productDesc?.avgRating || 0) > 0 && (
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(productDesc?.avgRating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">
                        ({productDesc?.reviewCount || 0})
                      </span>
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-3xl md:text-4xl font-bold text-primary">
                    {currentVariant.currency}
                    {currentVariant.offerPrice.toLocaleString()}
                  </span>
                  {currentVariant.basePrice !== currentVariant.offerPrice && (
                    <>
                      <span className="text-lg md:text-xl text-muted-foreground line-through">
                        {currentVariant.currency}
                        {currentVariant.basePrice.toLocaleString()}
                      </span>
                      <Badge variant="destructive" className="text-sm">
                        {getDiscountPercentage(
                          currentVariant.basePrice,
                          currentVariant.offerPrice
                        )}
                        % OFF
                      </Badge>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`${
                      getStockStatus(currentVariant.stock).bgColor
                    } ${getStockStatus(currentVariant.stock).color} ${
                      getStockStatus(currentVariant.stock).badge
                    } inline-flex items-center`}
                  >
                    {getStockStatus(currentVariant.stock).icon}
                    {getStockStatus(currentVariant.stock).label}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentVariant.stock} units available
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {currentVariant.stock <= 0 ? (
                    <Button
                      size="lg"
                      className="w-full gap-2"
                      disabled={true}
                      variant="secondary"
                    >
                      <X className="h-5 w-5" />
                      Out of Stock
                    </Button>
                  ) : productInCart ? (
                    <div className="flex overflow-hidden rounded-md border shadow-sm">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-l-md border-r hover:bg-primary/90 hover:text-primary-foreground"
                        onClick={handleDecrementWithToast}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex w-16 items-center justify-center font-medium">
                        {productInCart.quantity}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-r-md border-l hover:bg-primary/90 hover:text-primary-foreground"
                        onClick={handleIncrementWithToast}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      className="w-full gap-2"
                      onClick={checkStoreAndAddToCart}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </Button>
                  )}
                </div>
              </div>
              {/* Variant Selection Section */}
              {productDesc.variants.length > 1 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="space-y-4">
                    <h2 className="text-lg md:text-xl font-bold mb-3">
                      Available Options Grocery Theme
                    </h2>
                    <Select
                      value={selectedVariantIndex.toString()}
                      onValueChange={(value) =>
                        handleVariantSelect(parseInt(value, 10))
                      }
                    >
                      <SelectTrigger className="w-full p-6 md:p-6 rounded-lg border-border hover:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 bg-card text-foreground">
                        <SelectValue placeholder="Select a variant">
                          {/* Display selected variant info in trigger */}
                          {currentVariant && (
                            <div className="flex items-center gap-2 md:gap-3 w-full">
                              <div className="flex-grow text-left min-w-0">
                                <p className="text-sm font-semibold truncate">
                                  {getVariantAttributesText(currentVariant) ||
                                    `Option ${selectedVariantIndex + 1}`}
                                </p>
                                {/* <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                                  <span className="text-sm font-bold text-primary">
                                    {currentVariant.currency}
                                    {currentVariant.offerPrice.toLocaleString()}
                                  </span>
                                  {currentVariant.basePrice !==
                                    currentVariant.offerPrice && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      {currentVariant.currency}
                                      {currentVariant.basePrice.toLocaleString()}
                                    </span>
                                  )}
                                </div> */}
                              </div>
                              {/* <div
                                className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap flex-shrink-0 ${
                                  getStockStatus(currentVariant.stock).bgColor
                                } ${
                                  getStockStatus(currentVariant.stock).color
                                }`}
                              >
                                {getStockStatus(currentVariant.stock).icon}
                                <span className="hidden sm:inline">
                                  {currentVariant.stock > 0
                                    ? `${currentVariant.stock} left`
                                    : "Out of stock"}
                                </span>
                                <span className="sm:hidden">
                                  {currentVariant.stock > 0
                                    ? currentVariant.stock
                                    : "0"}
                                </span>
                              </div> */}
                            </div>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border shadow-lg rounded-lg max-h-80 overflow-y-auto">
                        {productDesc.variants.map((variant, index) => {
                          const variantWithAttrs =
                            variant as VariantWithAttributes;
                          const stockInfo = getStockStatus(variant.stock);
                          return (
                            <SelectItem
                              key={variant.variantId}
                              value={index.toString()}
                              className={`p-3 hover:bg-primary focus:bg-primary/10 data-[state=checked]:bg-primary/15 data-[state=checked]:text-primary transition-colors duration-150 rounded-md cursor-pointer min-h-[60px] md:min-h-[70px] ${
                                variant.stock <= 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={variant.stock <= 0}
                            >
                              <div className="flex items-center gap-2 md:gap-4 w-full">
                                {/* <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                                  <Image
                                    src={getVariantPrimaryImage(variantWithAttrs)}
                                    alt={variantWithAttrs.variantName || `Variant ${index + 1}`}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                  />
                                </div> */}
                                <div className="flex-grow text-left space-y-1 min-w-0">
                                  <h3 className="text-sm font-semibold leading-tight truncate">
                                    {getVariantAttributesText(
                                      variantWithAttrs
                                    ) || `Option ${index + 1}`}
                                  </h3>
                                  <div className="flex items-baseline gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-primary">
                                      {variant.currency}
                                      {variant.offerPrice.toLocaleString()}
                                    </span>
                                    {variant.basePrice !==
                                      variant.offerPrice && (
                                      <span className="text-xs text-muted-foreground line-through">
                                        {variant.currency}
                                        {variant.basePrice.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                  {variant.basePrice !== variant.offerPrice && (
                                    <Badge
                                      variant="secondary"
                                      className="text-[10px] px-1.5 py-0.5 h-auto bg-destructive/10 text-destructive border-destructive/20"
                                    >
                                      {getDiscountPercentage(
                                        variant.basePrice,
                                        variant.offerPrice
                                      )}
                                      % OFF
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-col items-end space-y-1 ml-auto flex-shrink-0">
                                  <div
                                    className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap ${stockInfo.bgColor} ${stockInfo.color} border ${stockInfo.border}`}
                                  >
                                    {stockInfo.icon}
                                    <span className="hidden sm:inline">
                                      {variant.stock > 0
                                        ? `${variant.stock} left`
                                        : "Out of stock"}
                                    </span>
                                    <span className="sm:hidden">
                                      {variant.stock > 0 ? variant.stock : "0"}
                                    </span>
                                  </div>
                                  {selectedVariantIndex === index && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs px-2 py-0.5 h-auto border-primary text-primary bg-primary/10"
                                    >
                                      Selected
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              {/* Specifications Section - Enhanced Responsive Design */}
              <div className="mt-6 mb-4">
                <h3 className="text-lg font-semibold mb-3">
                  Product Information
                </h3>

                {/* Mobile-First Card Layout */}
                <div className="block md:hidden space-y-3 w-full">
                  {/* Product Attributes - Mobile */}
                  {productDesc.attributes?.map((attr, index) => (
                    <Card
                      key={`mobile-product-${index}`}
                      className="p-4 w-full overflow-hidden"
                    >
                      <div className="space-y-2 w-full">
                        <div className="text-sm font-medium text-foreground break-all overflow-wrap-anywhere max-w-full">
                          {attr.name}
                        </div>
                        <div className="text-sm text-muted-foreground break-all overflow-wrap-anywhere leading-relaxed max-w-full">
                          {attr.value}
                        </div>
                      </div>
                    </Card>
                  ))}

                  {/* Variant Attributes - Mobile */}
                  {currentVariant.attributes
                    ?.filter((attr) => attr.isVariantDimension === 0)
                    .slice(0, 2)
                    .map((attr, index) => (
                      <Card
                        key={`mobile-variant-${index}`}
                        className="p-4 w-full overflow-hidden"
                      >
                        <div className="space-y-2 w-full">
                          <div className="text-sm font-medium text-foreground break-all overflow-wrap-anywhere max-w-full">
                            {attr.name}
                          </div>
                          <div className="text-sm text-muted-foreground break-all overflow-wrap-anywhere leading-relaxed max-w-full">
                            {attr.value}
                          </div>
                        </div>
                      </Card>
                    ))}

                  {/* Basic Info - Mobile */}
                  {currentVariant.qty && (
                    <Card className="p-4 w-full overflow-hidden">
                      <div className="space-y-2 w-full">
                        <div className="text-sm font-medium text-foreground break-all overflow-wrap-anywhere max-w-full">
                          Quantity
                        </div>
                        <div className="text-sm text-muted-foreground break-all overflow-wrap-anywhere max-w-full">
                          {currentVariant.qty} {currentVariant.unit}
                        </div>
                      </div>
                    </Card>
                  )}

                  <Card className="p-4 w-full overflow-hidden">
                    <div className="space-y-2 w-full">
                      <div className="text-sm font-medium text-foreground break-all overflow-wrap-anywhere max-w-full">
                        Stock
                      </div>
                      <div className="text-sm text-muted-foreground break-all overflow-wrap-anywhere max-w-full">
                        {currentVariant.stock} units
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block w-full">
                  <Card className="bg-transparent shadow-none w-full">
                    <div className="w-full">
                      <Table className="w-full table-fixed">
                        <TableBody>
                          {/* Product Attributes */}
                          {productDesc.attributes?.map((attr, index) => (
                            <TableRow
                              key={`desktop-product-${index}`}
                              className="hover:bg-muted/50"
                            >
                              <TableCell className="py-4 px-4 font-medium text-sm align-top w-1/3 max-w-[200px]">
                                <div className="break-words pr-4 w-full">
                                  {attr.name}
                                </div>
                              </TableCell>
                              <TableCell className="py-4 px-4 text-sm text-muted-foreground align-top w-2/3">
                                <div className="break-words leading-relaxed w-full">
                                  {attr.value}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}

                          {/* Variant Attributes */}
                          {currentVariant.attributes
                            ?.filter((attr) => attr.isVariantDimension === 0)
                            .slice(0, 2)
                            .map((attr, index) => (
                              <TableRow
                                key={`desktop-variant-${index}`}
                                className="hover:bg-muted/50"
                              >
                                <TableCell className="py-4 px-4 font-medium text-sm align-top w-1/3 max-w-[200px]">
                                  <div className="break-words pr-4 w-full">
                                    {attr.name}
                                  </div>
                                </TableCell>
                                <TableCell className="py-4 px-4 text-sm text-muted-foreground align-top w-2/3">
                                  <div className="break-words leading-relaxed w-full">
                                    {attr.value}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}

                          {/* Basic Info */}
                          {/* {currentVariant.qty && (
                            <TableRow className="hover:bg-muted/50">
                              <TableCell className="py-4 px-4 font-medium text-sm align-top w-1/3 max-w-[200px]">
                                <div className="break-words pr-4 w-full">
                                  Quantity
                                </div>
                              </TableCell>
                              <TableCell className="py-4 px-4 text-sm text-muted-foreground align-top w-2/3">
                                <div className="break-words leading-relaxed w-full">
                                  {currentVariant.qty} {currentVariant.unit}
                                </div>
                              </TableCell>
                            </TableRow>
                          )} */}

                          {/* <TableRow className="hover:bg-muted/50">
                            <TableCell className="py-4 px-4 font-medium text-sm align-top w-1/3 max-w-[200px]">
                              <div className="break-words pr-4 w-full">
                                Stock
                              </div>
                            </TableCell>
                            <TableCell className="py-4 px-4 text-sm text-muted-foreground align-top w-2/3">
                              <div className="break-words leading-relaxed w-full">
                                {currentVariant.stock} units
                              </div>
                            </TableCell>
                          </TableRow> */}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description - Below Available Options */}
        <div className="container mx-auto max-w-7xl px-4 py-8 border-t">
          <div className="space-y-8">
            {/* Description Section */}
            <div>
              <h2 className="text-xl font-bold mb-4">Product Description</h2>
              <Card>
                <CardContent className="p-6">
                  <div
                    className="product-description-content text-red-500"
                    dangerouslySetInnerHTML={{
                      __html:
                        productDesc.description || "No description available",
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Product Images</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                {currentImages.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg relative"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes=""
                      className=""
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Store Status Dialog */}
        <StoreStatusDialog
          isOpen={storeClosedDialog}
          onOpenChange={setStoreClosedDialog}
          storeStatus={storeStatus || {}}
          isStoreOpen={isStoreOpen}
        />
      </div>
    </TooltipProvider>
  );
};

// Keep the original export name for compatibility
const ProductDesc = ProductDescClient;

export default ProductDesc;
export { ProductDescClient };
