"use client";
import React, { memo } from "react";
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

interface TestimonialsConfig {
  title?: string;
  testimonials?: TestimonialItem[];
  layout?: "carousel" | "grid";
  columns?: number;
}

interface TestimonialsProps {
  config?: TestimonialsConfig;
}

const Testimonials = memo(({ config }: TestimonialsProps) => {
  if (
    !config ||
    !Array.isArray(config.testimonials) ||
    config.testimonials.length === 0
  ) {
    return null;
  }

  const { title, testimonials } = config;

  // Render stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? "fill-(color:--primary) text-(color:--primary)"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <section className="py-12 relative">
      <div className="container mx-auto max-w-5xl">
        {/* Title section matching the image */}
        <div className="flex flex-col items-center mb-8">
          <TestimonialsIcon size={52} alt="Testimonials" />
          <span className="text-xs text-gray-400 tracking-widest mt-2 mb-1">
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
                <p className="text-gray-900 mb-4 leading-relaxed font-semibold text-2xl">
                  &ldquo;{testimonial.review}&rdquo;
                </p>
                <div className="flex justify-center mb-3">
                  <div className="flex gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                <p className="font-medium text-gray-800">
                  {testimonial.customer_name}
                </p>
                {testimonial.designation && (
                  <p className="text-gray-400 text-sm mt-1">
                    {testimonial.designation}
                  </p>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Custom navigation */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="testimonial-prev w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-(color:--primary) hover:text-(color:--primary) transition">
            <svg width="20" height="20" fill="none" stroke="currentColor">
              <path
                d="M13 5l-5 5 5 5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="testimonial-next w-8 h-8 rounded-full border border-(color:--primary) flex items-center justify-center text-(color:--primary) hover:bg-red-50 transition">
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
});

Testimonials.displayName = "Testimonials";

export default Testimonials;
