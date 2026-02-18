"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBanners } from "@/store/slices/banners";
import { RootState, AppDispatch } from "@/store/StoreProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const BannerCarousel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banners, isLoading } = useSelector((state: RootState) => state.banners);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  return (
    <div className="relative w-full mx-auto">
      {/* Loader */}
      {isLoading && (
        <div className="loaderDiv">
          <div className="loader"></div>
        </div>
      )}

      {/* Swiper Carousel */}
      {banners && banners.length > 0 && (
        <Swiper
          modules={[Pagination]}
          spaceBetween={50}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="relative rounded-lg shadow-lg p-4"
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.name}>
              <div className="relative w-full h-50 md:h-100">
                <img
                  src={banner.image}
                  alt={`Banner ${banner.name}`}
                  className="w-full h-full md:object-cover object-fit"
                />
                {/* Pagination dots inside the banner */}
                <div className="swiper-pagination absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default BannerCarousel;
