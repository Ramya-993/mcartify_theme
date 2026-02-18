"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setInitialData } from "@/store/slices/store";
import { AppDispatch } from "@/store/StoreProvider";
import { StoreData } from "@/types/store";

interface StoreInitializerProps {
  storeData: StoreData;
}

// Google Fonts API endpoint
const GOOGLE_FONTS_API =
  "https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=AIzaSyDoGjFAmieNYVWbVEL4qF5Nwjjv8vDTAM4";

// GoogleFont type for API response
interface GoogleFont {
  family: string;
  variants: string[];
  files: Record<string, string>;
}

// Minimal Store type for design/font logic
interface StoreWithDesign {
  design?: {
    primaryFont?: string;
    secondaryFont?: string;
  };
  storeId?: string | number;
  themeId?: string | number;
  serviceName?: string;
}

// In-memory cache for font list
let googleFontsCache: GoogleFont[] = [];

// Utility: Fetch Google Fonts list (with cache)
async function fetchGoogleFontsList(): Promise<GoogleFont[]> {
  if (googleFontsCache.length > 0) return googleFontsCache;
  try {
    const res = await fetch(GOOGLE_FONTS_API);
    const data = await res.json();
    googleFontsCache = data.items || [];
    return googleFontsCache;
  } catch {
    return [];
  }
}

// Utility: Find font object by family name (case-insensitive)
function findFontByFamily(
  fonts: GoogleFont[],
  family: string
): GoogleFont | undefined {
  return fonts.find((f) => f.family.toLowerCase() === family?.toLowerCase());
}

// Utility: Generate Google Fonts <link> href for one or more families
function generateGoogleFontsHref(families: string[]) {
  // Google Fonts expects spaces as '+' and multiple families as &family=...
  const familyParam = families
    .map((f) => f.replace(/ /g, "+"))
    .join("&family=");
  return `https://fonts.googleapis.com/css2?family=${familyParam}&display=swap`;
}

// Utility: Generate CSS variable overrides
function generateFontVarsCSS(primary: string, secondary: string) {
  return `:root {\n  --font-primary: '${primary}', system-ui;\n  --font-secondary: '${secondary}', system-ui;\n}`;
}

// Utility: Generate CSS variable overrides from design object
function generateDesignVarsCSS(design: Record<string, string | undefined>) {
  // Mapping from design keys to CSS variable names
  const keyToVar: Record<string, string> = {
    muted: "--muted",
    accent: "--accent",
    onMuted: "--on-muted",
    popover: "--popover",
    primary: "--primary",
    onPopover: "--on-popover",
    onPrimary: "--on-primary",
    secondary: "--secondary",
    textColor: "--text-color",
    accentHover: "--accent-hover",
    onSecondary: "--on-secondary",
    accentActive: "--accent-active",
    primaryHover: "--primary-hover",
    primaryFont: "--font-primary",
    primaryActive: "--primary-active",
    secondaryHover: "--secondary-hover",
    secondaryFont: "--font-secondary",
    mutedForeground: "--muted-foreground",
    secondaryActive: "--secondary-active",
    accentForeground: "--accent-foreground",
    backgroundColor: "--background",
    popoverForeground: "--popover-foreground",
    primaryForeground: "--primary-foreground",
    secondaryForeground: "--secondary-foreground",
    secondaryTextColor: "--secondary-text-color",
  };
  let css = ":root {\n";
  for (const [key, value] of Object.entries(design)) {
    if (keyToVar[key]) {
      // Font family needs quotes and fallback
      if (key === "primaryFont" || key === "secondaryFont") {
        css += `  ${keyToVar[key]}: '${value}', system-ui;\n`;
      } else {
        css += `  ${keyToVar[key]}: ${value};\n`;
      }
    }
  }
  css += "}";
  return css;
}

// DynamicFontLoader: Injects CSS into <head>
function DynamicFontLoader({ css }: { css: string }) {
  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = css;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, [css]);
  return null;
}

const StoreInitializer = ({ storeData }: StoreInitializerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [fontCSS, setFontCSS] = useState<string>("");

  useEffect(() => {
    if (storeData?.Store) {
      // Dispatch action to populate store immediately with server-side data
      dispatch(
        setInitialData({
          Store: storeData.Store,
          Channel: storeData.Channels,
        })
      );
      // Font and design logic
      (async () => {
        const store: StoreWithDesign = storeData.Store;
        const design = store.design || {};
        const primaryFont =
          typeof design.primaryFont === "string"
            ? design.primaryFont
            : "Poppins";
        const secondaryFont =
          typeof design.secondaryFont === "string"
            ? design.secondaryFont
            : "Afacad";
        const primaryFontName = primaryFont || "Poppins";
        const secondaryFontName = secondaryFont || "Afacad";
        // --- DYNAMIC LINK INJECTION ---
        // Remove any previous font links injected by this component
        const prevLinks = Array.from(
          document.head.querySelectorAll("[data-dynamic-font]")
        );
        prevLinks.forEach((link) => link.parentNode?.removeChild(link));
        // Preconnects
        const preconnect1 = document.createElement("link");
        preconnect1.rel = "preconnect";
        preconnect1.href = "https://fonts.googleapis.com";
        preconnect1.setAttribute("data-dynamic-font", "true");
        const preconnect2 = document.createElement("link");
        preconnect2.rel = "preconnect";
        preconnect2.href = "https://fonts.gstatic.com";
        preconnect2.crossOrigin = "anonymous";
        preconnect2.setAttribute("data-dynamic-font", "true");
        // Stylesheet
        const families = [primaryFontName, secondaryFontName].filter(
          (v, i, arr) => v && arr.indexOf(v) === i
        );
        const fontHref = generateGoogleFontsHref(families);
        const fontLink = document.createElement("link");
        fontLink.rel = "stylesheet";
        fontLink.href = fontHref;
        fontLink.setAttribute("data-dynamic-font", "true");
        document.head.appendChild(preconnect1);
        document.head.appendChild(preconnect2);
        document.head.appendChild(fontLink);
        // Set CSS variables for font families and design variables
        const fontVarsCSS = generateFontVarsCSS(
          primaryFontName,
          secondaryFontName
        );
        const designVarsCSS = generateDesignVarsCSS(design);
        setFontCSS(fontVarsCSS + "\n" + designVarsCSS);
        // Cleanup on unmount
        return () => {
          [preconnect1, preconnect2, fontLink].forEach((link) => {
            if (link.parentNode) link.parentNode.removeChild(link);
          });
        };
      })();
      // Debug
      const store: StoreWithDesign = storeData.Store;
      console.log("Store initialized with server-side data:", {
        storeId: store.storeId,
        themeId: store.themeId,
        serviceName: store.serviceName,
      });
    }
  }, [dispatch, storeData]);

  return <>{fontCSS && <DynamicFontLoader css={fontCSS} />}</>;
};

export default StoreInitializer;
