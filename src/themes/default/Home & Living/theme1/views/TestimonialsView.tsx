"use client";
import React from "react";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { TestimonialsIcon } from "@/components/icons";

interface TestimonialItem {
    id: number;
    rating: number;
    review: string;
    customer_name: string;
    avatar?: string;
    designation?: string;
}

interface TestimonialsViewProps {
    title?: string;
    testimonials: TestimonialItem[];
}

// Render stars
const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
        <Star
            key={index}
            className={`h-(size:--testimonials-star-size) w-(size:--testimonials-star-size) ${index < rating
                ? "fill-(color:--testimonials-star-filled-color) text-(color:--testimonials-star-filled-color)"
                : "fill-(color:--testimonials-star-empty-color) text-(color:--testimonials-star-empty-color)"
                }`}
        />
    ));
};

const TestimonialsView = ({
    title,
    testimonials,
}: TestimonialsViewProps) => {
    return (
        <section className="py-(spacing:--testimonials-section-padding-y) relative bg-(color:--testimonials-section-bg)">
            <div className="container mx-auto max-w-(size:--testimonials-container-max-width)">
                {/* Title section matching the image */}
                <div className="flex flex-col items-center mb-8">
                    <TestimonialsIcon size={52} alt="Testimonials" />
                    <span className="text-(length:--testimonials-label-size) text-(color:--testimonials-label-color) tracking-(--testimonials-label-tracking) mt-2 mb-1">
                        {title}
                    </span>
                </div>
                <Swiper
                    modules={[Navigation, Pagination]}
                    slidesPerView={1}
                    navigation={{
                        nextEl: ".testimonial-next",
                        prevEl: ".testimonial-prev",
                    }}
                    pagination={false}
                    className="relative"
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id}>
                            <div className="text-center p-6 rounded-lg">
                                <p className="text-(color:--testimonials-review-color) mb-4 leading-(--testimonials-review-line-height) font-(weight:--testimonials-review-weight) text-(length:--testimonials-review-size)">
                                    &ldquo;{testimonial.review}&rdquo;
                                </p>
                                <div className="flex justify-center mb-3">
                                    <div className="flex gap-1">
                                        {renderStars(testimonial.rating)}
                                    </div>
                                </div>
                                <p className="font-(weight:--testimonials-name-weight) text-(color:--testimonials-name-color)">
                                    {testimonial.customer_name}
                                </p>
                                {testimonial.designation && (
                                    <p className="text-(color:--testimonials-designation-color) text-(length:--testimonials-designation-size) mt-1">
                                        {testimonial.designation}
                                    </p>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                {/* Custom navigation */}
                <div className="flex justify-center gap-4 mt-6">
                    <button className="testimonial-prev w-(size:--testimonials-nav-size) h-(size:--testimonials-nav-size) rounded-(radius:--testimonials-nav-radius) border border-(color:--testimonials-nav-border-color) flex items-center justify-center text-(color:--testimonials-nav-color) hover:border-(color:--testimonials-nav-hover-border-color) hover:text-(color:--testimonials-nav-hover-color) transition">
                        <svg width="20" height="20" fill="none" stroke="currentColor">
                            <path
                                d="M13 5l-5 5 5 5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <button className="testimonial-next w-(size:--testimonials-nav-size) h-(size:--testimonials-nav-size) rounded-(radius:--testimonials-nav-radius) border border-(color:--testimonials-nav-active-border-color) flex items-center justify-center text-(color:--testimonials-nav-active-color) hover:bg-(color:--testimonials-nav-active-hover-bg) transition">
                        <svg width="20" height="20" fill="none" stroke="currentColor">
                            <path
                                d="M7 5l5 5-5 5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsView;
