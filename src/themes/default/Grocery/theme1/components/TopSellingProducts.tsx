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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

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
    const showArrows = config.showArrows !== false;

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
        className="py-8 md:py-12 px-4 md:px-8 lg:px-12"
        aria-labelledby="top-selling-title"
      >
        <div className="container mx-auto max-w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={topSellingAnimationVariants.container}
          >
            <motion.div variants={topSellingAnimationVariants.card}>
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0 pb-6">
                  <div className="flex w-full items-center justify-between">
                    <motion.h2
                      id="top-selling-title"
                      className="text-2xl md:text-3xl font-(family-name:--font-primary) text-gray-900"
                      variants={{}}
                    >
                      {title}
                    </motion.h2>
                    <div className="flex items-center gap-2">
                      <Link
                        href="/products"
                        className="flex items-center text-(color:--primary) hover:text-(color:--primary-hover) cursor-pointer font-medium text-sm md:text-base transition-colors duration-200 whitespace-nowrap ml-4"
                        aria-label="View all best selling products"
                      >
                        View All
                        <ArrowRight
                          className="ml-2 h-4 w-4"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </div>
                </CardHeader>

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

                          {/* Navigation Arrows */}
                          {showArrows && totalSlides > 1 && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={prevSlide}
                                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                                aria-label="Previous slide"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={nextSlide}
                                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                                aria-label="Next slide"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-5">
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

                      {/* Dots Navigation */}
                      {layout === "carousel" && showDots && totalSlides > 1 && (
                        <div className="flex justify-center items-center mt-6 gap-2">
                          {Array.from({ length: totalSlides }).map(
                            (_, index) => (
                              <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                  currentSlide === index
                                    ? "bg-primary scale-125"
                                    : "bg-gray-300 hover:bg-gray-400"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }
);

TopSellingProducts.displayName = "TopSellingProducts";

export default TopSellingProducts;
