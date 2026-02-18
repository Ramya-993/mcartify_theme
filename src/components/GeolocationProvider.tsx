"use client";

import { useGeolocation } from "@/hooks/useGeolocation";
import { useEffect } from "react";

interface GeolocationProviderProps {
  children: React.ReactNode;
  autoFetch?: boolean;
}

const GeolocationProvider = ({
  children,
  autoFetch = true,
}: GeolocationProviderProps) => {
  const { latitude, longitude, isLoading, error, hasPermission } =
    useGeolocation(autoFetch);

  useEffect(() => {
    if (latitude && longitude) {
      console.log("🌍 Geolocation available in provider:", {
        latitude,
        longitude,
      });
    }
    if (error) {
      console.warn("🌍 Geolocation error in provider:", error);
    }
  }, [latitude, longitude, error]);

  return <>{children}</>;
};

export default GeolocationProvider;
