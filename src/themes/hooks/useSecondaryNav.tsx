import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { fetchAllProducts } from "@/store/slices/products";
import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import { fetchAllCategory } from "@/store/slices/category";

export const useSecondaryNav = () => {
  const { data: categories } = useSelector(
    (state: RootState) => state.categories
  );
  const { data: products } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch<AppDispatch>();
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchString, setSearchString] = useState("");
  const router = useRouter();

  // Fetch categories once on mount - with proper dependencies
  useEffect(() => {
    if (!categories?.length) {
      console.log("Fetching categories from useSecondaryNav");
      dispatch(fetchAllCategory());
    }
  }, [dispatch, categories?.length]);

  // Only fetch products if needed and not already loaded - with proper dependencies
  useEffect(() => {
    if (!products?.length && categories?.length) {
      console.log("Fetching products from SecondaryNav hook");
      dispatch(fetchAllProducts());
    }
  }, [dispatch, products?.length, categories?.length]);

  // Handle search functionality
  const matchedList = useSearch(searchString, products as [], "name");
  console.log("matchedListdasda", matchedList);
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoize navigation functions to prevent recreating on every render
  const navigateToProduct = useCallback(
    (slug: string) => {
      router.push(`/products/${slug}`);
      setShowResults(false);
    },
    [router]
  );

  const navigateToCategory = useCallback(
    (slug: string) => {
      // Use the SEO-friendly URL structure
      router.push(`/products/category/${slug}`);
    },
    [router]
  );

  const navigateToSubcategory = useCallback(
    (categorySlug: string, subcategoryId: number) => {
      // Keep subcategory as query parameter with numeric ID per user request
      router.push(
        `/products/category/${categorySlug}?subcategory=${subcategoryId}`
      );
    },
    [router]
  );

  return {
    categories,
    products,
    searchString,
    setSearchString,
    showResults,
    setShowResults,
    searchContainerRef,
    matchedList,
    navigateToProduct,
    navigateToCategory,
    navigateToSubcategory,
  };
};
