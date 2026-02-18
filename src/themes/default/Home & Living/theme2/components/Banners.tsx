"use client";

import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import Image from "next/image";

interface Banner {
  id: number;
  alt: string;
  image: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_type: string;
  custom_url: string;
  link_value: string;
  product_id: number | null;
  category_id: number | null;
}

interface BannerConfig {
  banners: Banner[];
  columns: string | number;
  auto_play: boolean;
  show_dots: boolean;
  show_arrows: boolean;
  auto_play_speed: number;
  gap?: string | number;
  border_radius?: string | number;
  layout?: "grid" | "carousel"; // Add layout
}

interface BannersProps {
  config?: BannerConfig;
}

const Banners = ({ config }: BannersProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  console.log("🎯 Banners component config:", config);

  if (!config || !config.banners || config.banners.length === 0) {
    console.log("🎯 No banners to display");
    return (
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">No banners configured</p>
      </div>
    );
  }

  const {
    banners,
    columns: rawColumns = 1,
    auto_play: autoplay = true,
    show_dots: showDots = true,
    show_arrows: showArrows = true,
    auto_play_speed: autoplaySpeed = 3000,
    gap: rawGap = "20",
    border_radius: rawBorderRadius = "8",
    layout, // <-- add layout
  } = config;

  // Convert columns to number
  const columns =
    typeof rawColumns === "string" ? parseInt(rawColumns, 10) : rawColumns;

  // Convert gap to number (in pixels)
  const gap = typeof rawGap === "string" ? parseInt(rawGap, 10) : rawGap;

  // Convert border_radius to number (in pixels)
  const borderRadius =
    typeof rawBorderRadius === "string"
      ? parseInt(rawBorderRadius, 10)
      : rawBorderRadius;

  console.log("🎯 Processed banner config:", {
    banners: banners.length,
    columns,
    autoplay,
    showDots,
    showArrows,
    autoplaySpeed,
    gap,
    borderRadius,
  });

  // Banner item component
  const BannerItem = ({
    banner,
    showDots,
    banners,
    currentSlide,
    swiperRef,
  }: {
    banner: Banner;
    showDots?: boolean;
    banners?: Banner[];
    currentSlide?: number;
    swiperRef?: React.RefObject<SwiperType | null>;
  }) => {
    const imageUrl = banner.image_url || banner.image;
    console.log("🖼️ Banner image URL:", { banner: banner.title, imageUrl });
    const [imgError, setImgError] = React.useState(false);

    return (
      <div
        className="relative w-full aspect-[16/8] overflow-hidden"
        style={{ borderRadius: `${borderRadius}px` }}
      >
        {!imgError ? (
          <Image
            src={imageUrl}
            alt={banner.alt || banner.title || "Banner"}
            fill
            className="object-fit w-full h-full"
            style={{ borderRadius: `${borderRadius}px` }}
            priority
            onError={() => {
              setImgError(true);
              console.error("🚨 Image load error for", banner.title, imageUrl);
            }}
          />
        ) : (
          <div
            className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500"
            style={{ borderRadius: `${borderRadius}px` }}
          >
            <span>Image not available</span>
          </div>
        )}

        {(banner.title || banner.subtitle) && (
          <div
            className="absolute left-0 bottom-0 bg-black/15 bg-opacity-40 flex flex-col justify-end items-start text-white p-8 md:p-12 z-20"
            style={{ borderRadius: `${borderRadius}px`, maxWidth: "70%" }}
          >
            {banner.title && (
              <h2 className="text-3xl md:text-4xl font-semibold mb-2 drop-shadow text-left">
                {banner.title}
              </h2>
            )}
            {banner.subtitle && (
              <p className="text-lg md:text-xl mb-6 drop-shadow text-left">
                {banner.subtitle}
              </p>
            )}
            {/* Show button if link is present */}
            {(banner.custom_url || banner.link_value) && (
              <a
                href={banner.custom_url || banner.link_value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-(color:--primary) hover:bg-(color:--primary-hover) text-white font-semibold px-8 py-3 rounded transition-colors duration-200 text-base md:text-lg shadow-md"
                tabIndex={0}
                aria-label={
                  banner.title ? `Discover ${banner.title}` : "Discover now"
                }
              >
                DISCOVER NOW!
              </a>
            )}
          </div>
        )}
        {/* Dots overlay directly on image */}
        {showDots &&
          banners &&
          banners.length > 1 &&
          typeof currentSlide === "number" && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex justify-center items-center z-20">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (swiperRef && swiperRef.current) {
                      swiperRef.current.slideToLoop(index);
                    }
                  }}
                  className={`transition-all duration-300 ease-in-out  outline-none focus:outline-none border-none p-0 m-0 ${
                    currentSlide === index
                      ? "w-16 h-3 bg-white shadow-lg rounded-none"
                      : "w-16 h-3 bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
      </div>
    );
  };

  // If layout is 'carousel', always render carousel layout
  if (layout === "carousel") {
    console.log("🎯 Rendering forced carousel layout due to layout=carousel");
    return (
      <section className="w-full" style={{ padding: `${gap}px` }}>
        <div className="w-full">
          <Swiper
            modules={[Pagination, Autoplay, EffectFade, Navigation]}
            spaceBetween={gap}
            slidesPerView={1}
            autoplay={
              autoplay
                ? {
                    delay: autoplaySpeed,
                    disableOnInteraction: false,
                  }
                : false
            }
            // Remove Swiper's built-in pagination for dots
            pagination={false}
            navigation={showArrows}
            loop={banners.length > 1}
            className="w-full"
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {banners.map((banner) => (
              <SwiperSlide
                key={banner.id}
                className="flex items-center justify-center"
              >
                <BannerItem
                  banner={banner}
                  showDots={showDots}
                  banners={banners}
                  currentSlide={currentSlide}
                  swiperRef={swiperRef}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    );
  }

  // Grid layout for multiple columns
  if (columns > 1) {
    console.log("🎯 Rendering grid layout with", columns, "columns");
    return (
      <section className="w-full" style={{ padding: `${gap}px` }}>
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: `repeat(${Math.min(
              columns,
              banners.length
            )}, 1fr)`,
            gap: `${gap}px`,
          }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full">
              <BannerItem
                banner={banner}
                showDots={false}
                banners={banners}
                currentSlide={currentSlide}
                swiperRef={swiperRef}
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Carousel layout for single column with multiple banners
  console.log("🎯 Rendering carousel layout");
  return (
    <section className="w-full" style={{ padding: `${gap}px` }}>
      <div className="w-full relative">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade, Navigation]}
          spaceBetween={gap}
          slidesPerView={1}
          autoplay={
            autoplay
              ? {
                  delay: autoplaySpeed,
                  disableOnInteraction: false,
                }
              : false
          }
          pagination={false}
          navigation={showArrows}
          loop={banners.length > 1}
          className="w-full"
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {banners.map((banner) => (
            <SwiperSlide
              key={banner.id}
              className="flex items-center justify-center"
            >
              <BannerItem
                banner={banner}
                showDots={showDots}
                banners={banners}
                currentSlide={currentSlide}
                swiperRef={swiperRef}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Banners;
