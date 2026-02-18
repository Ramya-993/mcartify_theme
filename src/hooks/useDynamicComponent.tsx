import { getDynamicComponent } from "@/components/dynamic/DynamicComponents";
import { RootState } from "@/store/StoreProvider";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export function useDynamicComponent(componentPath: string) {
  const { store } = useSelector((state: RootState) => state.store);
  const storeID = store?.storeId || "default";
  const themeID = store?.themeId || "default";
  const useDefaultTheme = store?.useDefaultTheme || 0;
  console.log("storedsaasdasdasddasdd21435467", store?.selectedTheme);
  const selectedTheme = store?.selectedTheme ? store?.selectedTheme : "theme1";

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
  console.log("serviceNamedsadadsad", serviceName);
  return useMemo(
    () =>
      getDynamicComponent(
        componentPath,
        storeID,
        themeID,
        useDefaultTheme,
        serviceName,
        selectedTheme
      ),
    [
      componentPath,
      storeID,
      themeID,
      useDefaultTheme,
      serviceName,
      selectedTheme,
    ]
  );
}
