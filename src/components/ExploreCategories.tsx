import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { fetchAllCategory } from "@/store/slices/category";
import ICategory from "@/types/category";
import CategoryCard from "./categoryCard";

const ExploreCategories = memo(() => {
  const { data: categories } = useSelector(
    (state: RootState) => state.categories
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, [dispatch]);

  return (
    <section className="container mx-auto md:mt-4 mt-2 max-w-7xl py-4 px-2">
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-semibold text-gray-800">
          Explore all Categories
        </h4>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
        {categories &&
          categories.map((item: ICategory) => {
            return <CategoryCard cardData={item} key={item.categoryId} />;
          })}
      </div>
    </section>
  );
});

ExploreCategories.displayName = "ExploreCategories";

export default ExploreCategories;
