"use client";
import React, { memo, useMemo, useEffect, useRef } from "react";
import Link from "next/link";

import Product from "./Product";
import { useTopSellingProducts } from "@/themes/hooks/useTopSellingProducts";
import {
  TopSellingProductsProps,
  defaultTopSellingConfig,
  topSellingAnimationVariants,
} from "@/types/components";

// Shadcn UI components
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Framer Motion for animations
import { motion, AnimatePresence } from "framer-motion";

const TopSellingProducts = memo(
  ({ config = defaultTopSellingConfig }: TopSellingProductsProps) => {
    // Get products from the hook
    const { products } = useTopSellingProducts();

    // Config values with fallback
    const title = config.title || defaultTopSellingConfig.title;
    const maxItems = config.max_items || defaultTopSellingConfig.max_items;
    const layout = config.layout || defaultTopSellingConfig.layout;
    const columns = config.columns || defaultTopSellingConfig.columns || 4;
    const autoPlay = config.autoPlay || defaultTopSellingConfig.autoPlay;
    const autoPlayInterval =
      config.autoPlayInterval || defaultTopSellingConfig.autoPlayInterval;
    const showDots = config.showDots !== false;

    // State for carousel
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    // Ensure type safety for products
    const safeProducts = useMemo(
      () => (Array.isArray(products) ? products.slice(0, maxItems) : []),
      [products, maxItems]
    );

    // For carousel mode, we'll show products one by one or in small groups
    const itemsPerSlide = layout === "carousel" ? 5 : columns;
    const totalSlides = Math.ceil(safeProducts.length / itemsPerSlide);

    // Auto-play functionality
    useEffect(() => {
      if (layout === "carousel" && autoPlay && totalSlides > 1) {
        autoPlayRef.current = setInterval(() => {
          setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, autoPlayInterval);
      } else {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
          autoPlayRef.current = null;
        }
      }

      return () => {
        if (autoPlayRef.current) {
          clearInterval(autoPlayRef.current);
        }
      };
    }, [layout, autoPlay, totalSlides, autoPlayInterval]);

    // Navigation functions
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (index: number) => {
      setCurrentSlide(index);
    };

    // Get current slide products
    const currentProducts = useMemo(() => {
      if (layout === "carousel") {
        const start = currentSlide * itemsPerSlide;
        return safeProducts.slice(start, start + itemsPerSlide);
      }
      return safeProducts;
    }, [safeProducts, currentSlide, itemsPerSlide, layout]);

    // Mock states for loading and error handling
    const loadingState = false;
    const errorState = null;

    if (errorState) {
      return (
        <section className="py-(spacing:--top-selling-section-padding-y) bg-(color:--top-selling-section-bg)">
          <div className="container mx-auto px-4">
            <Card className="border-none shadow-(--top-selling-card-shadow) rounded-(--top-selling-card-radius) bg-(color:--top-selling-card-bg) p-8 text-center">
              <CardTitle className="text-lg text-(color:--destructive) mb-2">
                Error Loading Products
              </CardTitle>
              <p className="text-(color:--destructive-foreground)">
                Unable to load top selling products. Please try again later.
              </p>
            </Card>
          </div>
        </section>
      );
    }

    return (
      <section
        className="py-8 md:py-12 px-4 md:px-8 lg:px-56"
        aria-labelledby="top-selling-title"
      >
        <div className="container mx-auto max-w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={topSellingAnimationVariants.container}
          >
            <motion.div variants={topSellingAnimationVariants.card}>
              {/* Section Title */}
              <h2
                id="top-selling-title"
                className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900"
              >
                {title}
              </h2>

              <Card className="border-none shadow-none bg-transparent">
                <CardContent className="px-0">
                  {loadingState ? (
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
                      {Array(10)
                        .fill(0)
                        .map((_, index) => (
                          <div
                            key={`skeleton-${index}`}
                            className="h-[300px] rounded-lg bg-gray-100 animate-pulse"
                            aria-hidden="true"
                          />
                        ))}
                    </div>
                  ) : (
                    <div className="relative">
                      {layout === "carousel" ? (
                        <div className="overflow-hidden rounded-lg">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentSlide}
                              initial={{ opacity: 0, x: 300 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -300 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                                duration: 0.5,
                              }}
                              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
                            >
                              {currentProducts.length > 0 ? (
                                currentProducts.map((product, index) => (
                                  <motion.div
                                    key={product.productId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="carousel-product-container"
                                    style={
                                      {
                                        "--carousel-scale": "0.85",
                                        "--carousel-height": "auto",
                                        "--image-aspect": "3/4",
                                        "--card-padding": "0.75rem",
                                        "--title-size": "0.875rem",
                                        "--price-size": "1rem",
                                        "--content-spacing": "0.5rem",
                                      } as React.CSSProperties
                                    }
                                  >
                                    <div className="transform scale-[0.85] origin-center">
                                      <Product product={product} />
                                    </div>
                                  </motion.div>
                                ))
                              ) : (
                                <div
                                  className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-(color:--top-selling-empty-border) bg-(color:--top-selling-empty-bg) p-8 text-center text-(color:--top-selling-empty-text) font-(family-name:--font-primary)"
                                  role="status"
                                >
                                  No products available at the moment
                                </div>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                          {safeProducts.length > 0 ? (
                            safeProducts.map((product) => (
                              <Product
                                key={product.productId}
                                product={product}
                              />
                            ))
                          ) : (
                            <div
                              className="col-span-full flex items-center justify-center rounded-lg border border-dashed border-(color:--top-selling-empty-border) bg-(color:--top-selling-empty-bg) p-8 text-center text-(color:--top-selling-empty-text) font-(family-name:--font-primary)"
                              role="status"
                            >
                              No products available at the moment
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Navigation Bar: arrows and dots centered at the bottom */}
              {layout === "carousel" && showDots && totalSlides > 1 && (
                <div className="flex items-center justify-center gap-8 mt-10 mb-2">
                  {/* Left Arrow */}
                  <button
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center transition hover:bg-gray-100"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-400" />
                  </button>
                  {/* Dots */}
                  <div className="flex items-center gap-3">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full border transition-all duration-200 ${
                          currentSlide === index
                            ? "bg-black border-black"
                            : "bg-white border-gray-400"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                  {/* Right Arrow */}
                  <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full bg-white shadow border border-gray-200 flex items-center justify-center transition hover:bg-gray-100"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                  </button>
                </div>
              )}
              {/* View All Button */}
              <div className="flex justify-center mt-8">
                <Link
                  href="/products"
                  aria-label="View all best selling products cursor-pointer"
                >
                  <button className="px-8 py-2 border cursor-pointer border-(color:--primary) text-(color:--primary) bg-white rounded-md font-medium text-base hover:bg-(color:--primary)/10 transition-colors shadow-sm">
                    View All
                  </button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }
);

TopSellingProducts.displayName = "TopSellingProducts";

export default TopSellingProducts;
