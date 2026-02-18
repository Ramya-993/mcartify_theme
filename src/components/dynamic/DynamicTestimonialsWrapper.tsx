"use client";
import { useDynamicComponent } from "@/hooks/useDynamicComponent";
import Loading from "@/app/loading";
import ErrorBoundary from "../ErrorBoundary";

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
  auto_play?: boolean;
  auto_play_speed?: number;
  showDots?: boolean;
  showArrows?: boolean;
  layout?: "carousel" | "grid";
  columns?: number;
}

interface TestimonialsProps {
  config?: TestimonialsConfig;
}

export default function DynamicTestimonialsWrapper({
  config,
}: TestimonialsProps) {
  const fallbackComponent = (
    <div className="w-full">
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-500">
          Error loading Testimonials
        </h1>
        <p className="text-sm text-gray-600">
          Please check your theme configuration and try again.
        </p>
      </div>
    </div>
  );

  const DynamicTestimonials = useDynamicComponent("Testimonials");

  return (
    <ErrorBoundary
      fallback={fallbackComponent}
      onError={(error) => console.error("Error in DynamicTestimonials:", error)}
    >
      <DynamicTestimonials config={config} />
    </ErrorBoundary>
  );
}
 