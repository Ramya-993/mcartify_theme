import type { Metadata } from "next";
import Breadcrumb from "@/components/ui/breadcrumbs";
import DynamicExploreCategoriesWrapper from "@/components/dynamic/DynamicExploreCategories";

export const metadata: Metadata = {
  title: "Product Categories",
  description:
    "Browse our wide range of product categories. Find everything you need in one place.",
  openGraph: {
    title: "Product Categories",
    description:
      "Browse our wide range of product categories. Find everything you need in one place.",
  },
};

const Categories = () => {
  return (
    <div>
      <div className="container max-w-7xl px-4">
        <Breadcrumb
          crumbItems={[
            { href: "/", label: "Home", isCurrent: false, isDisabled: false },
            {
              href: "/categories",
              label: "Categories",
              isCurrent: true,
              isDisabled: false,
            },
          ]}
        />
      </div>
      <DynamicExploreCategoriesWrapper />
    </div>
  );
};

export default Categories;
