"use client";
import React, { memo } from "react";
import { Star } from "lucide-react";

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

  const { title, testimonials, columns } = config;

  // Render stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {title}
            </h2>
          </div>
        )}
        {/* Testimonials Grid */}
        <div
          className={`grid gap-6 ${
            columns === 1
              ? "grid-cols-1"
              : columns === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="text-center p-6 bg-white rounded-lg"
            >
              {/* Stars */}
              <div className="flex justify-center mb-3">
                <div className="flex gap-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
              {/* Review */}
              <p className="text-gray-600 mb-4 leading-relaxed">
                &ldquo;{testimonial.review}&rdquo;
              </p>
              {/* Customer Name */}
              <p className="font-medium text-gray-800">
                {testimonial.customer_name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

Testimonials.displayName = "Testimonials";

export default Testimonials;
