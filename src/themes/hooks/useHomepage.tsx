"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";

// Define types for our configuration that match the page-builder structure
export interface HomepageComponentConfig {
  id: string;
  type: string;
  component: string;
  enabled: boolean;
  order: number;
  config: Record<string, unknown>;
}

export interface HomepageConfig {
  layout: {
    sections: HomepageComponentConfig[];
  };
  theme: {
    spacing: {
      sectionGap: string;
      containerPadding: string;
    };
    layout: {
      maxWidth: string;
      centerContent: boolean;
    };
  };
}

export const useHomepage = () => {
  // Get customLayout from Redux store
  const { customLayout } = useSelector((state: RootState) => state.store);

  // State for config and loading status
  const [config, setConfig] = useState<HomepageConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    try {
      if (customLayout && customLayout.layout && customLayout.layout.sections) {
        setConfig(customLayout);
        setIsLoading(false);
        console.log(
          "✅ Loaded homepage config from customLayout:",
          customLayout
        );
      } else {
        setConfig(null);
        setIsLoading(true);
        // Optionally, set an error if you want to handle missing config
        // setError("Homepage configuration not available");
      }
    } catch (err) {
      console.error("❌ Failed to process homepage configuration:", err);
      setError("Failed to load homepage configuration");
      setConfig(null);
      setIsLoading(false);
    }
  }, [customLayout]);

  // Sort and filter only if config is available
  const sortedSections = config?.layout?.sections
    ? [...config.layout.sections].sort((a, b) => a.order - b.order)
    : [];
  const enabledSections = sortedSections.filter((section) => section.enabled);

  // Get theme settings (with fallback for possible missing properties)
  const spacing = config?.theme?.spacing || {
    sectionGap: "py-6 md:py-10",
    containerPadding: "px-4 md:px-6",
  };
  const layout = config?.theme?.layout || {
    maxWidth: "max-w-7xl",
    centerContent: true,
  };

  return {
    sections: enabledSections,
    spacing,
    layout,
    config,
    isLoading,
    error,
  };
};

export default useHomepage;
