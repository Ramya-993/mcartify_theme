import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";
import IProduct from "@/types/product";

export const useTopSellingProducts = () => {
  const { data: products } = useSelector((state: RootState) => state.products);

  // In a real app, we might fetch top selling products specifically
  // or filter/sort them based on popularity metrics
  // For now, we'll cast the products to IProduct[] since we know the API returns this shape
  return {
    products: products as unknown as IProduct[],
  };
};
