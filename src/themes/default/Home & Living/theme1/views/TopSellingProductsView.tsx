"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Product from "../components/Product";
import { topSellingAnimationVariants } from "@/types/components";
import type { TopSellingProductsViewProps } from "../components/TopSellingProducts";

const TopSellingProductsView: React.FC<TopSellingProductsViewProps> = ({
    title,
    loading,
    error,
    layout,
    products,
    showArrows,
    showDots,
    totalSlides,
    currentSlide,
    onNext,
    onPrev,
    onGoToSlide,
}) => {
    if (error) {
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
            className="py-8 md:py-12 px-4 md:px-8 lg:px-36"
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
                                {loading ? (
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
                                                        {products.length > 0 ? (
                                                            products.map((product: any, index: number) => (
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
                                                            onClick={onPrev}
                                                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                                                            aria-label="Previous slide"
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={onNext}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
                                                            aria-label="Next slide"
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                                {products.length > 0 ? (
                                                    products.map((product: any) => (
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
                                                {Array.from({ length: totalSlides }).map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => onGoToSlide(index)}
                                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index
                                                            ? "bg-primary scale-125"
                                                            : "bg-gray-300 hover:bg-gray-400"
                                                            }`}
                                                        aria-label={`Go to slide ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        {/* View All Button */}
                        <div className="flex justify-center mt-8">
                            <Link
                                href="/products"
                                aria-label="View all best selling products cursor-pointer"
                            >
                                <button className="px-8 py-2 border cursor-pointer border-yellow-500 text-yellow-600 bg-white rounded-md font-medium text-base hover:bg-yellow-50 transition-colors shadow-sm">
                                    View All
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default TopSellingProductsView;
