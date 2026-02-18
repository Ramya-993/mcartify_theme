import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/StoreProvider";

export const useFeaturedCategories = () => {
  const { data: categories } = useSelector(
    (state: RootState) => state.categories
  );
  const [numPerPage, setNumPerPage] = useState<number>(7);

  useEffect(() => {
    const updateNumPerPage = (): void => {
      const width = window.innerWidth;
      let perPage = 7;

      if (width < 640) {
        perPage = 2;
      } else if (width < 1024) {
        perPage = 4;
      }

      // Ensure we don't exceed the actual number of items
      setNumPerPage(Math.min(perPage, categories?.length || 1));
    };

    updateNumPerPage();
    window.addEventListener("resize", updateNumPerPage);

    return () => window.removeEventListener("resize", updateNumPerPage);
  }, [categories]);

  return {
    categories,
    numPerPage,
  };
};
