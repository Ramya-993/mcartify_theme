"use client";

import React, { memo } from "react";
import { useExploreCategories } from "@/themes/hooks/useExploreCategories";
import ExploreCategoriesView from "../views/ExploreCategoriesView";
import ICategory from "@/types/category";

export interface ExploreCategoriesProps {
  storeID: string;
  themeID: string;
}

export interface ExploreCategoriesViewProps {
  categories: ICategory[];
  error: any;
}

const ExploreCategories: React.FC<ExploreCategoriesProps> = memo(
  ({ storeID, themeID }) => {
    const { categories, loading, error } = useExploreCategories();

    return <ExploreCategoriesView categories={categories} error={error} />;
  }
);

ExploreCategories.displayName = "ExploreCategories";

export default ExploreCategories;
