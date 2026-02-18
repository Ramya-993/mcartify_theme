import ICategory from "@/types/category";
import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";

export const useCategoryCard = (category: ICategory) => {
  const { slug } = category;
  const { store } = useSelector((state: RootState) => state.store);

  // SEO-friendly URL using path-based routing instead of query parameters
  
  const categoryLink = `/products/category/${slug}`;
  console.log("categoryLink",categoryLink)
  return {
    categoryLink,
  };
};
