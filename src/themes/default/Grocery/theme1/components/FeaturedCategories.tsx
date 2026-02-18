"use client";
import React, { memo, useMemo } from "react";
import { useFeaturedCategories } from "@/themes/hooks/useFeaturedCategories";
import CategoryCard from "./CategoryCard";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ICategory from "@/types/category";
import { motion, Variants } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface FeaturedCategoriesConfig {
  title?: string;
  columns?: string;
  max_items?: number;
}

interface FeaturedCategoriesProps {
  config?: FeaturedCategoriesConfig;
}

const FeaturedCategories = memo(({ config = {} }: FeaturedCategoriesProps) => {
  const { categories } = useFeaturedCategories() as {
    categories: ICategory[];
    numPerPage: number;
  };

  // Extract configuration values with defaults
  const title = config.title || "Featured Categories";
  const maxItems = config.max_items || 20;

  // Animation variants
  const containerVariants = useMemo(
    (): Variants => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.08,
          delayChildren: 0.1,
        },
      },
    }),
    []
  );

  const itemVariants = useMemo(
    (): Variants => ({
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
        },
      },
    }),
    []
  );

  if (!categories?.length) return null;

  // For carousel, we can show more categories based on configuration
  const displayedCategories = categories.slice(0, maxItems);

  return (
    <section
      className="py-8 md:py-12 px-4 md:px-8 lg:px-12"
      aria-labelledby="featured-categories-heading"
    >
      <div className="container mx-auto max-w-full">
        {/* Section Header */}
        <motion.div
          className="flex items-center justify-between mb-8 px-0"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2
            id="featured-categories-heading"
            className="text-2xl md:text-3xl font-(family-name:--font-primary) text-gray-900"
            variants={itemVariants}
          >
            {title}
          </motion.h2>

          <motion.div variants={itemVariants}>
            <Link
              href="/categories"
              className="flex items-center text-green-600 hover:text-green-700 font-medium text-sm md:text-base transition-colors duration-200"
              aria-label="View all product categories"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Categories Carousel */}
        <motion.div
          className="relative overflow-hidden"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="featured-categories-carousel relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              navigation={{
                prevEl: ".featured-categories-prev",
                nextEl: ".featured-categories-next",
              }}
              pagination={{
                el: ".featured-categories-pagination",
                clickable: true,
                bulletActiveClass: "bg-green-500",
                bulletClass:
                  "w-2 h-2 rounded-full bg-gray-300 mx-1 transition-all duration-300",
              }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1.5,
                  spaceBetween: 12,
                },
                480: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                640: {
                  slidesPerView: 2.5,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: 5,
                  spaceBetween: 24,
                },
                1536: {
                  slidesPerView: 6,
                  spaceBetween: 24,
                },
              }}
              className="overflow-hidden"
            >
              {displayedCategories.map((category) => (
                <SwiperSlide key={category.categoryId}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="h-full"
                  >
                    <CategoryCard cardData={category} />
                  </motion.div>
                </SwiperSlide>
              ))}
              
            </Swiper>

            {/* Navigation Buttons */}
            <button
              className="featured-categories-prev absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white border border-green-500 text-green-600 rounded-full shadow-lg hover:bg-green-50 hover:border-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              className="featured-categories-next absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-white border border-green-500 text-green-600 rounded-full shadow-lg hover:bg-green-50 hover:border-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next categories"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots */}
            <div className="featured-categories-pagination flex justify-center mt-6 space-x-2"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

FeaturedCategories.displayName = "FeaturedCategories";

export default FeaturedCategories;
