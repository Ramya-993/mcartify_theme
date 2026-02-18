import dynamic from "next/dynamic";

// Static fallback component for SSR/crawlers - NO animations or spinners
const SSRFallback = () => (
  <div className="border rounded-lg p-3 bg-white shadow-sm">
    <div className="aspect-square bg-gray-100 rounded mb-2"></div>
    <div className="h-4 bg-gray-100 rounded mb-1"></div>
    <div className="h-3 bg-gray-100 rounded w-2/3 mb-2"></div>
    <div className="h-4 bg-emerald-100 rounded w-1/2"></div>
  </div>
);

// Loading spinner component that ONLY shows on client-side
const LoadingSpinner = () => {
  // Only render spinner if we're in the browser
  if (typeof window === "undefined") {
    return <SSRFallback />;
  }

  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
    </div>
  );
};

// Generic cache to support deeply nested paths and multiple themes
const componentCache = new Map();

/**
 * Generic function to dynamically load React components
 *
 * @param componentPath - Relative path inside the `components/` folder (e.g., 'profile/ProfileCard')
 * @param storeID - Store identifier (e.g., 'store1')
 * @param themeID - Theme identifier (e.g., 'themeA')
 * @returns A dynamically imported React component
 */
export function getDynamicComponent(
  componentPath: string,
  storeID: string,
  themeID: string,
  useDefaultTheme: number = 0,
  serviceName: string = "default",
  selectedTheme: string = "theme1"
) {
  // Apply the same theme resolution logic as in ThemeProvider
  let resolvedThemeID = themeID;
  let resolvedStoreID = storeID;

  if (useDefaultTheme === 1) {
    resolvedThemeID = serviceName;
    resolvedStoreID = "default";
  }
  const normalizedPath = componentPath.replace(/^\.?\//, "");
  const cacheKey = `${resolvedStoreID}-${resolvedThemeID}-${normalizedPath}`;

  // Return cached component if already loaded
  if (componentCache.has(cacheKey)) {
    console.log(`Using cached component: ${cacheKey}`);
    return componentCache.get(cacheKey);
  }

  console.log(`Creating new dynamic component: ${cacheKey}`);

  const Component = dynamic(
    async () => {
      const componentModule = await import(
        `@/themes/${resolvedStoreID}/${resolvedThemeID}/components/${normalizedPath}`
      ).catch(
        () =>
          // Fallback to default theme if component not found
          import(
            `@/themes/default/${
              serviceName || "default"
            }/${selectedTheme}/components/${normalizedPath}`
          )
      );
      return componentModule;
    },
    {
      loading: () => {
        // CRITICAL: Always return static fallback for SSR to prevent loading indicators
        return <SSRFallback />;
      },
      ssr: true,
    }
  );

  componentCache.set(cacheKey, Component);
  return Component;
}

/**
 * Preloads one or more components in the background
 *
 * @param components Array of { path, storeID, themeID } objects
 */
export function preloadComponents(
  components: {
    path: string;
    storeID: string;
    themeID: string;
    useDefaultTheme?: number;
    serviceName?: string;
  }[]
) {
  components.forEach(
    ({
      path,
      storeID,
      themeID,
      useDefaultTheme = 0,
      serviceName = "default",
    }) => {
      // Apply the same theme resolution logic as in ThemeProvider
      let resolvedThemeID = themeID;
      let resolvedStoreID = storeID;

      if (useDefaultTheme === 1) {
        resolvedThemeID = serviceName;
        resolvedStoreID = "default";
      }

      const normalizedPath = path.replace(/^\.?\//, "");
      const cacheKey = `${resolvedStoreID}-${resolvedThemeID}-${normalizedPath}`;

      if (!componentCache.has(cacheKey)) {
        console.log(`Preloading component: ${cacheKey}`);
        import(
          `@/themes/${resolvedStoreID}/${resolvedThemeID}/components/${normalizedPath}`
        )
          .catch(() => {
            console.warn(
              `Preload failed for component "${path}" from theme "${storeID}/${themeID}"; falling back to default`
            );
            return import(
              `@/themes/default/${
                serviceName || "default"
              }/components/${normalizedPath}`
            );
          })
          .then((module) => {
            const Component = dynamic(() => Promise.resolve(module), {
              ssr: true,
              loading: () => <SSRFallback />,
            });
            componentCache.set(cacheKey, Component);
          });
      } else {
        console.log(`Component already cached: ${cacheKey}`);
      }
    }
  );
}
