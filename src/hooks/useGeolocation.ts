import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { getCurrentLocation } from "@/store/slices/geolocation";

export const useGeolocation = (autoFetch: boolean = false) => {
  const dispatch = useDispatch<AppDispatch>();
  const geolocationState = useSelector((state: RootState) => state.geolocation);

  const fetchLocation = () => {
    dispatch(getCurrentLocation());
  };

  useEffect(() => {
    if (
      autoFetch &&
      !geolocationState.latitude &&
      !geolocationState.longitude &&
      !geolocationState.isLoading
    ) {
      console.log("🌍 Auto-fetching geolocation...");
      fetchLocation();
    }
  }, [
    autoFetch,
    dispatch,
    geolocationState.latitude,
    geolocationState.longitude,
    geolocationState.isLoading,
  ]);

  return {
    ...geolocationState,
    fetchLocation,
  };
};
