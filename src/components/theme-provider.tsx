"use client";

import path from "path";
import * as React from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";
import { useEffect, useState } from "react";
export interface StoreThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: StoreThemeProviderProps) {
  const { store, isLoading } = useSelector((state: RootState) => state.store);
  const [isThemeReady, setIsThemeReady] = useState(false);
  const storeID = store?.storeId || "default";
  const themeID = store?.themeId || "default";
  const useDefaultTheme = store?.useDefaultTheme || 0;
  const selectedTheme = store?.selectedTheme ? store.selectedTheme : "theme1";
  // Define allowed service names for future extensibility
  const allowedServiceNames = [
    "Clothing & Fashion",
    "Food & Beverages",
    "Toys & Kids",
    "Home & Living",
    "Electronics & Gadgets",
  ];
  const serviceName = allowedServiceNames.includes(store?.serviceName || "")
    ? store.serviceName
    : "Grocery";

  //  const pathName = checkFolderExists(path.dirname("./themes/"+storeID+"/"+themeID))
  console.log("pathName", path.dirname("./themes/" + storeID + "/" + themeID));
  // Apply store-specific theme attributes and debug
  let themeKey = `${storeID}-${themeID}`;
  if (useDefaultTheme === 1) {
    themeKey = `default-${serviceName}-${selectedTheme}`;
  }
  useEffect(() => {
    const html = document.documentElement;

    // Set loading state initially
    if (!isThemeReady && !store) {
      html.classList.add("theme-loading");
      html.classList.remove("theme-loaded");
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;

    // When store data is available and not loading, mark theme as ready
    if (!isLoading && store && !isThemeReady) {
      setIsThemeReady(true);
      html.classList.remove("theme-loading");
      html.classList.add("theme-loaded");

      console.log("Theme ready - flicker prevention activated");
    }
  }, [isLoading, store, isThemeReady]);

  useEffect(() => {
    const html = document.documentElement;

    console.log("themeKey", themeKey);
    html.setAttribute("data-store-theme", themeKey);
    html.setAttribute("data-store-id", storeID);
    html.setAttribute("data-theme-id", themeID);

    // Debug logging
    console.log("Theme Debug:", {
      appliedTheme: themeKey,
      currentClasses: html.className,
      storeThemeAttribute: html.getAttribute("data-store-theme"),
      storeId: html.getAttribute("data-store-id"),
      themeId: html.getAttribute("data-theme-id"),
      isThemeReady,
      isLoading,
      computedStyles: {
        primary: getComputedStyle(html).getPropertyValue("--primary"),
        accent: getComputedStyle(html).getPropertyValue("--accent"),
        background: getComputedStyle(html).getPropertyValue("--background"),
      },
    });
  }, [storeID, themeID, themeKey, isThemeReady, isLoading]);

  return <>{children}</>;
}
