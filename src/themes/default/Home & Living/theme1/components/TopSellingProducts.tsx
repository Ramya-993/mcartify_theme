"use client";
import React, { memo, useMemo, useEffect, useRef } from "react";
import { useTopSellingProducts } from "@/themes/hooks/useTopSellingProducts";
import {
  TopSellingProductsProps,
  defaultTopSellingConfig,
} from "@/types/components";
import TopSellingProductsView from "../views/TopSellingProductsView";

export interface TopSellingProductsViewProps {
  title: string;
  loading: boolean;
  error: any;
  layout: string | undefined;
  products: any[];
  showArrows: boolean;
  showDots: boolean;
  totalSlides: number;
  currentSlide: number;
  onNext: () => void;
  onPrev: () => void;
  onGoToSlide: (index: number) => void;
}

const TopSellingProducts = memo(
  ({ config = defaultTopSellingConfig }: TopSellingProductsProps) => {
    // Get products from the hook
    const { products } = useTopSellingProducts();

    // Config values with fallback
    const title = config.title || defaultTopSellingConfig.title || "Top Selling Products";
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

    return (
      <TopSellingProductsView
        title={title}
        loading={loadingState}
        error={errorState}
        layout={layout}
        products={currentProducts}
        showArrows={showArrows}
        showDots={showDots}
        totalSlides={totalSlides}
        currentSlide={currentSlide}
        onNext={nextSlide}
        onPrev={prevSlide}
        onGoToSlide={goToSlide}
      />
    );
  }
);

TopSellingProducts.displayName = "TopSellingProducts";

export default TopSellingProducts;
