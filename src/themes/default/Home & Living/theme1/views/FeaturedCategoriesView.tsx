"use client";
import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CategoryCard from "../components/CategoryCard";
// Import types from the Container
import type { FeaturedCategoriesViewProps } from "../components/FeaturedCategories";

const FeaturedCategoriesView: React.FC<FeaturedCategoriesViewProps> = ({
    title,
    displayedCategories,
    gridCols,
}) => {
    return (
        <section
            className="py-8 md:py-12 px-4 md:px-8 lg:px-28"
            aria-labelledby="featured-categories-heading"
        >
            <div className="container mx-auto max-w-full">
                {/* Section Header - Centered Title */}
                <div className="mb-8 px-0 flex flex-col items-center justify-center">
                    <h2
                        id="featured-categories-heading"
                        className="text-2xl md:text-3xl font-bold text-gray-900 text-center"
                    >
                        {title}
                    </h2>
                </div>

                {/* Mobile Carousel */}
                <div className="sm:hidden">
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
                            <SwiperSlide key={category.categoryId}>
                                <CategoryCard cardData={category} />
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
                        <button className="px-8 py-2 border border-yellow-500 text-yellow-600 bg-white rounded-md font-medium text-base hover:bg-yellow-50 transition-colors shadow-sm">
                            View All
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategoriesView;
