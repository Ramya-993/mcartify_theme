"use client";

import { useRef, useEffect, useState } from "react";
import { Swiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { SwiperOptions } from "swiper/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface SliderProps extends SwiperOptions {
  /** Number of slides per view (on larger screens) */
  numPerView?: number;
  /** Number of slides per view on mobile */
  numPerViewMobile?: number;
  /** Gap between slides */
  spaceBetween?: number;
  /** Custom class name for the container */
  className?: string;
  /** Custom class for navigation buttons */
  navButtonClassName?: string;
  /** Show pagination dots */
  showPagination?: boolean;
  /** Custom pagination class */
  paginationClass?: string;
  /** Show navigation arrows */
  showNavigation?: boolean;
  /** Children elements (slides) */
  children: React.ReactNode;
}

/**
 * A responsive slider component built on Swiper
 */
export default function Slider({
  numPerView = 4,
  numPerViewMobile = 1.2,
  spaceBetween = 16,
  className,
  navButtonClassName,
  showPagination = false,
  paginationClass,
  showNavigation = true,
  children,
  ...rest
}: SliderProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const [swiperInitialized, setSwiperInitialized] = useState(false);

  // Responsive breakpoints
  const breakpoints = {
    320: {
      slidesPerView: numPerViewMobile,
      spaceBetween: spaceBetween / 2,
    },
    640: {
      slidesPerView: Math.min(2, numPerView),
      spaceBetween: spaceBetween,
    },
    768: {
      slidesPerView: Math.min(3, numPerView),
      spaceBetween: spaceBetween,
    },
    1024: {
      slidesPerView: numPerView,
      spaceBetween: spaceBetween,
    },
  };

  // Update navigation when Swiper is initialized
  useEffect(() => {
    if (prevRef.current && nextRef.current && !swiperInitialized) {
      setSwiperInitialized(true);
    }
  }, [swiperInitialized]);

  return (
    <div className={cn("relative group", className)}>
      {showNavigation && (
        <>
          <button
            ref={prevRef}
            aria-label="Previous slide"
            className={cn(
              "absolute left-0 top-1/2 z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md ring-1 ring-border/5 transition-all hover:bg-background hover:ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "opacity-0 group-hover:opacity-100 group-hover:-translate-x-4",
              navButtonClassName
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            ref={nextRef}
            aria-label="Next slide"
            className={cn(
              "absolute right-0 top-1/2 z-10 flex h-8 w-8 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md ring-1 ring-border/5 transition-all hover:bg-background hover:ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "opacity-0 group-hover:opacity-100 group-hover:translate-x-4",
              navButtonClassName
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}

      <Swiper
        breakpoints={breakpoints}
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
          disabledClass: "opacity-30 cursor-not-allowed",
        }}
        pagination={showPagination ? {
          clickable: true,
          el: "." + (paginationClass || "swiper-pagination"),
          bulletClass: "inline-block w-2 h-2 mx-1 rounded-full bg-muted-foreground/20 transition-all",
          bulletActiveClass: "bg-primary w-3 h-3",
        } : false}
        onBeforeInit={(swiper) => {
          // Update navigation elements
          if (swiper.params.navigation) {
            const nav = swiper.params.navigation as { prevEl?: HTMLElement | null; nextEl?: HTMLElement | null };
            nav.prevEl = prevRef.current;
            nav.nextEl = nextRef.current;
          }
        }}
        className="w-full"
        {...rest}
      >
        {children}
      </Swiper>

      {showPagination && (
        <div className={cn("mt-4 flex justify-center", paginationClass || "swiper-pagination")} />
      )}
    </div>
  );
}
