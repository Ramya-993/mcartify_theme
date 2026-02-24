"use client";
import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CategoryCard from "../components/CategoryCard";
import type { FeaturedCategoriesViewProps } from "../components/FeaturedCategories";

const FeaturedCategoriesView: React.FC<FeaturedCategoriesViewProps> = ({
    title,
    displayedCategories,
    gridCols,
}) => {
    return (
        <section
            className="py-(spacing:--section-padding-y) md:py-(spacing:--section-padding-y-lg) px-(spacing:--section-padding-x) md:px-(spacing:--section-padding-x-md) lg:px-(spacing:--section-padding-x-lg)"
            aria-labelledby="featured-categories-heading"
        >
            <div className="container mx-auto max-w-full">
                {/* Section Header - Centered Title */}
                <div className="mb-(spacing:--heading-margin) px-0 flex flex-col items-center justify-center">
                    <h2
                        id="featured-categories-heading"
                        className="text-(size:--heading-size) md:text-(size:--heading-size-lg) font-(weight:--heading-weight) text-(color:--foreground) text-center"
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
                <div className={`hidden sm:grid gap-(spacing:--card-gap) ${gridCols}`}>
                    {displayedCategories.map((category) => (
                        <CategoryCard key={category.categoryId} cardData={category} />
                    ))}
                </div>

                {/* View All Button at Bottom Center */}
                <div className="flex justify-center mt-(spacing:--section-margin-top)">
                    <Link href="/categories" aria-label="View all product categories">
                        <button className="px-(spacing:--button-padding-x) py-(spacing:--button-padding-y) border-(color:--border) text-(color:--primary) bg-(color:--background) rounded-(radius:--button-radius) font-(weight:--button-weight) text-(size:--button-size) hover:bg-(color:--button-hover-bg) transition-colors shadow-(--button-shadow)">
                            View All
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategoriesView;