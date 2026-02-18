"use client";
import React, { memo } from "react";
import TestimonialsView from "../views/TestimonialsView";

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

  return (
    <TestimonialsView
      title={title}
      testimonials={testimonials}
    />
  );
});

Testimonials.displayName = "Testimonials";

export default Testimonials;
