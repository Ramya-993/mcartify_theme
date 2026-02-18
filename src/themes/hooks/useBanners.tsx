import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBanners } from "@/store/slices/banners";
import { RootState, AppDispatch } from "@/store/StoreProvider";

export const useBanners = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { banners, isLoading } = useSelector(
    (state: RootState) => state.banners
  );

  useEffect(() => {
    // Only fetch banners if not already loaded
    if (!banners?.length && !isLoading) {
      dispatch(fetchBanners());
    }
  }, [dispatch, banners?.length, isLoading]);

  return {
    banners,
    isLoading,
  };
};
