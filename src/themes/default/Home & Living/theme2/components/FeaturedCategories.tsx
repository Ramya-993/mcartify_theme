"use client";
import React, { memo } from "react";
import { useFeaturedCategories } from "@/themes/hooks/useFeaturedCategories";
import CategoryCard from "./CategoryCard";
import Link from "next/link";
import ICategory from "@/types/category";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface FeaturedCategoriesConfig {
  title?: string;
  columns?: string;
  max_items?: number;
  featured_categories?: string[];
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
  const columns = parseInt(config.columns || "3", 10);
  const featuredCategoryIds = (config.featured_categories || []).map(Number);

  if (!categories?.length) return null;

  // Filter and limit categories based on config
  let filteredCategories = categories;
  if (featuredCategoryIds.length > 0) {
    filteredCategories = categories.filter((cat) =>
      featuredCategoryIds.includes(cat.categoryId)
    );
  }
  const displayedCategories = filteredCategories.slice(0, maxItems);

  // Responsive grid columns
  const gridCols =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    }[columns] || "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  return (
    <section
      className="py-8 md:py-16 px-4 md:px-8 lg:px-28"
      aria-labelledby="featured-categories-heading"
    >
      <div className="container mx-auto max-w-full">
        {/* Section Header - Centered Title */}
        <div className="mb-28 px-0 flex flex-col items-center justify-center">
          <h2
            id="featured-categories-heading"
            className="text-2xl md:text-3xl font-bold text-gray-900 text-center"
          >
            {title}
          </h2>
        </div>

        {/* Mobile Carousel */}
        <div className="sm:hidden overflow-visible">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1.05 as number}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="overflow-visible"
          >
            {displayedCategories.map((category) => (
              <SwiperSlide
                key={category.categoryId}
                className="pt-20 overflow-visible flex justify-center"
              >
                <div className="overflow-visible flex justify-center">
                  <CategoryCard cardData={category} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Categories Grid for tablet/desktop */}
        <div className={`hidden sm:grid gap-6 ${gridCols}`}>
          {displayedCategories.map((category) => (
            <CategoryCard key={category.categoryId} cardData={category} />
          ))}
        </div>

        {/* View All Button at Bottom Center */}
        <div className="flex justify-center mt-10">
          <Link href="/categories" aria-label="View all product categories">
            <button className="px-8 py-2 border border-(color:--primary) text-(color:--primary) bg-white rounded-md font-medium text-base hover:bg-(color:--primary)/10 transition-colors shadow-sm">
              View All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
});

FeaturedCategories.displayName = "FeaturedCategories";

export default FeaturedCategories;
