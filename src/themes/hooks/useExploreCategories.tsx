import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { fetchAllCategory } from "@/store/slices/category";
import ICategory from "@/types/category";

export const useExploreCategories = () => {
  const {
    data: categories,
    loading,
    error,
  } = useSelector((state: RootState) => state.categories);
  const dispatch = useDispatch<AppDispatch>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("useExploreCategories: Fetching categories");

    if (!isInitialized) {
      dispatch(fetchAllCategory())
        .then(() => {
          console.log("useExploreCategories: Categories fetched successfully");
          setIsInitialized(true);
        })
        .catch((err) => {
          console.error("useExploreCategories: Error fetching categories", err);
          setIsInitialized(true);
        });
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    console.log("useExploreCategories state:", {
      categoriesCount: categories?.length || 0,
      loading,
      error,
      isInitialized,
    });
  }, [categories, loading, error, isInitialized]);

  return {
    categories,
    loading,
    error,
    isInitialized,
  };
};
