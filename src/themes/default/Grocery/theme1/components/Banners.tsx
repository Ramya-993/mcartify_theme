"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";

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
  layout?: "grid" | "carousel"; // Add layout to config
}

interface BannersProps {
  config?: BannerConfig;
}

const Banners = ({ config }: BannersProps) => {
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
  const BannerItem = ({ banner }: { banner: Banner }) => {
    const imageUrl = banner.image_url || banner.image;
    console.log("🖼️ Banner image URL:", { banner: banner.title, imageUrl });
    const [imgError, setImgError] = React.useState(false);

    const content = (
      <div
        className="relative w-full aspect-[16/6] overflow-hidden"
        style={{ borderRadius: `${borderRadius}px` }}
      >
        {!imgError ? (
          <Image
            src={imageUrl}
            alt={banner.alt || banner.title || "Banner"}
            fill
            sizes="100vw"
            className="object-cover"
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
            className="absolute inset-0 bg-black/15 bg-opacity-40 flex flex-col justify-center items-center text-white text-center p-4"
            style={{ borderRadius: `${borderRadius}px` }}
          >
            {banner.title && (
              <h2 className="text-2xl md:text-4xl font-bold mb-2 drop-shadow">
                {banner.title}
              </h2>
            )}
            {banner.subtitle && (
              <p className="text-lg md:text-xl mb-4 drop-shadow">
                {banner.subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    );

    // Wrap with link if provided
    if (banner.link_value || banner.custom_url) {
      const linkUrl = banner.link_value || banner.custom_url;
      return (
        <Link href={linkUrl} className="block">
          {content}
        </Link>
      );
    }

    return content;
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
            pagination={showDots ? { clickable: true } : false}
            navigation={showArrows}
            loop={banners.length > 1}
            className="w-full"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <BannerItem banner={banner} />
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
              <BannerItem banner={banner} />
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
          pagination={showDots ? { clickable: true } : false}
          navigation={showArrows}
          loop={banners.length > 1}
          className="w-full"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <BannerItem banner={banner} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Banners;
