"use client";
import React, { ChangeEvent, useEffect, useState,useRef } from "react";
import DropdownMenu from "./Dropdown";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { useDispatch, useSelector } from "react-redux";
import ICategory, { ISubcategory } from "@/types/category";
import { fetchAllCategory } from "@/store/slices/category";
import { fetchAllProducts } from "@/store/slices/products";
import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";

const SecondaryNav = () => {
  const { data: categories } = useSelector(
    (state: RootState) => state.categories,
  );
  const { data: products } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch<AppDispatch>();
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const [searchString, setSearchString] = useState("");
  useEffect(() => {
    if (!categories?.length) {
      dispatch(fetchAllProducts());
    }
  }, [categories]);

  useEffect(() => {
    dispatch(fetchAllCategory());
  }, []);

  const router = useRouter();
  const matchedList = useSearch(searchString, products as [], "name");


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && 
          !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white">
      <div className="container mx-auto flex md:justify-between justify-around max-w-screen md:px-4 pr-2  border-box gap-2 py-2">
        <div className="flex items-center gap-2">
          <DropdownMenu
            data={
              categories?.map((category: ICategory) => ({
                lable: category.name,
                id: category.categoryId,
                submenu: Array.isArray(category?.subcategories)
                  ? category?.subcategories?.map(
                      (subcategory: ISubcategory) => ({
                        lable: subcategory.name,
                        id: subcategory.subcategoryId,
                        category: subcategory.categoryId,
                      }),
                    )
                  : null,
              })) || []
            }
          >
            <button className="flex cursor-pointer items-center gap-2 rounded-md bg-emerald-100/50 px-3 py-2 text-sm font-semibold text-emerald-500 transition hover:bg-emerald-500 hover:text-white md:px-4 md:text-base">
    <span className="material-symbols-rounded text-lg md:text-xl">grid_view</span>
    <span className="truncate">
      <span className="hidden md:inline">Browse All </span>
      Category
    </span>
    <span className="material-symbols-rounded text-lg md:text-xl">
      keyboard_arrow_down
    </span>
  </button>
          </DropdownMenu>
        </div>
        <div className="border-box" ref={searchContainerRef}>
          <div className="flex h-full md:min-w-sm  md:max-w-[250px] gap-2  items-center rounded bg-slate-100 border-box">
            <div className="grid size-4 md:size-10 place-items-center">
              <span className="material-symbols-rounded pl-1">search</span>
            </div>
            <input
              type="search"
              placeholder="Search for items..."
              className="grow md:py-2 md:pr-4 pr-2 text-sm outline-none w-full"
              value={searchString}
              onFocus={() => setShowResults(true)}
              onChange={({
                target: { value },
              }: ChangeEvent<HTMLInputElement>) => setSearchString(value)}
            />
            {showResults && searchString.length > 0 && (
              <div className="absolute top-32 max-h-96 md:max-w-sm max-w-[200px]  divide-y divide-gray-200 overflow-auto rounded-b-lg bg-white *:px-2 *:py-2 z-10">
                {matchedList.length === 0 ? (
                    <div className="text-gray-500">No products found</div>
                  ) : (
                    matchedList.map((product: any) => (
                      <button
                        onClick={() => {
                          router.push(`/products/${product.productId}`);
                        }}
                        className="w-full truncate text-left hover:bg-gray-100"
                        key={product.productId}
                      >
                        {product.name}
                      </button>
                    ))
                  )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 hidden lg:flex">
          <span className="material-symbols-rounded !text-4xl">
            headset_mic
          </span>
          <div>
            <p className="text-emerald-600">1900 789 564</p>
            <p className="text-xs">24/7 Support Center</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryNav;
