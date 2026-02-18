"use client";
import React, { useRef } from "react";
import { Swiper } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ISliderProps {
  numPerPage: number;
  children: React.ReactNode;
  className?: string;
}

export default function Slider({
  numPerPage,
  children,
  className,
  ...rest
}: ISliderProps) {
  const prev = useRef(null);
  const next = useRef(null);

  return (
    <div className={cn("relative mt-4 flex items-center bg-(--slider-bg)", className)}>
      {numPerPage && (
        <Button
          ref={prev}
          variant="outline"
          size="icon"
          className="absolute -left-4 z-10 h-9 w-9 rounded-(--slider-nav-radius) bg-(--slider-nav-bg) border-(--slider-nav-border) text-(--slider-nav-color) shadow-(--slider-nav-shadow) hover:bg-(--slider-nav-hover-bg) hover:text-(--slider-nav-hover-color)"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}
      <Swiper
        className="!ml-0 flex max-w-fit justify-start"
        watchSlidesProgress={true}
        modules={[Navigation]}
        slidesPerView={numPerPage}
        spaceBetween={20}
        {...rest}
        navigation={{
          prevEl: prev.current,
          nextEl: next.current,
        }}
      >
        {children}
      </Swiper>

      {numPerPage && (
        <Button
          ref={next}
          variant="outline"
          size="icon"
          className="absolute -right-4 z-10 h-9 w-9 rounded-(--slider-nav-radius) bg-(--slider-nav-bg) border-(--slider-nav-border) text-(--slider-nav-color) shadow-(--slider-nav-shadow) hover:bg-(--slider-nav-hover-bg) hover:text-(--slider-nav-hover-color)"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
