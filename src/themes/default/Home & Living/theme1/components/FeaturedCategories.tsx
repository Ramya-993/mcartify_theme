"use client";
import React, { memo } from "react";
import { useFeaturedCategories } from "@/themes/hooks/useFeaturedCategories";
import FeaturedCategoriesView from "../views/FeaturedCategoriesView";
import ICategory from "@/types/category";

export interface FeaturedCategoriesConfig {
  title?: string;
  columns?: string;
  max_items?: number;
  featured_categories?: string[];
}

export interface FeaturedCategoriesProps {
  config?: FeaturedCategoriesConfig;
}

export interface FeaturedCategoriesViewProps {
  title: string;
  displayedCategories: ICategory[];
  gridCols: string;
}

const FeaturedCategories = memo(({ config = {} }: FeaturedCategoriesProps) => {
  const { categories } = useFeaturedCategories() as {
    categories: ICategory[];
    numPerPage: number;
  };

  // Extract configuration values with defaults
  const title = config.title || "Featured Categories";
  const maxItems = config.max_items || 20;
  const columns = parseInt(config.columns || "3", 10);
  const featuredCategoryIds = (config.featured_categories || []).map(Number);

  if (!categories?.length) return null;

  // Filter and limit categories based on config
  let filteredCategories = categories;
  if (featuredCategoryIds.length > 0) {
    filteredCategories = categories.filter((cat) =>
      featuredCategoryIds.includes(cat.categoryId)
    );
  }
  const displayedCategories = filteredCategories.slice(0, maxItems);

  // Responsive grid columns
  const gridCols =
    {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
      6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    }[columns] || "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";

  return (
    <FeaturedCategoriesView
      title={title}
      displayedCategories={displayedCategories}
      gridCols={gridCols}
    />
  );
});

FeaturedCategories.displayName = "FeaturedCategories";

export default FeaturedCategories;
