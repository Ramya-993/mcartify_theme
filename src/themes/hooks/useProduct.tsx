import { ChangeEvent, useState } from "react";
import IProduct from "@/types/product";

export const useProduct = (product: IProduct) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const handleVariantChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariantIndex(e.target.selectedIndex);
  };

  return {
    selectedVariantIndex,
    setSelectedVariantIndex,
    handleVariantChange,
  };
};
