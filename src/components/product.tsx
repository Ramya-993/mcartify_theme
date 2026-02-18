"use client";

import Image from "next/image";
import IProduct from "@/types/product";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import AddToCart from "./addToCart";

const Product = ({ product }: { product: IProduct }) => {
  const router = useRouter();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  // const [addToCartObject, setAddToCartObject] = useState({
  //   productId: product.productId,
  //   variantId: product?.variants?.[selectedVariantIndex]?.variantId,
  //   quantity: 1,
  // });

  // const onVariantChange = (newVarientId: number) => {
  //   setAddToCartObject((state) => ({
  //     ...state,
  //     variantId: newVarientId,
  //   }));
  // };

  return (
    <div
      onClick={() => {
        router.push(`/products/${product.productId}`);
      }}
      className="relative flex cursor-pointer flex-col justify-end overflow-hidden rounded-xl border border-gray-200 bg-gray-50 duration-500 hover:border-emerald-600 "
    >
      {/**
       * @add_to_wishlist
       */}

      {/* <div className="group absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-gray-100 transition">
        <span className="material-symbols-rounded transition group-hover:text-emerald-600">
          favorite
        </span>
      </div> */}
      <div className="md:p-4 p-1 flex items-center justify-center border-box">
        <Image
          width={50}
          height={50}
          src={product?.imageURL || "/images/dummy/avocado.png"}
          alt="image"
          className=" md:h-40 lg:h-48 h-16 !important  w-full object-contain rounded-lg "
        />
      </div>

      <div className="border-t border-dashed border-gray-200 md:p-4 p-2 whitespace-nowrap">
        <div className="md:mb-4 mb-1">
          <span className="inline-block w-full truncate md:text-xl text-md font-semibold text-gray-600">
            {product.name}
          </span>
        </div>
        <div className="md:mb-4 mb-1">
          {product.variants.length > 1 ? (
            <select
              name="productvariant"
              id="productvariant"
              className="w-full rounded-sm border border-solid text-sm border-gray-300 md:px-2 px-1 py-1"
              onClick={(e) => {
                e.stopPropagation();
              }}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                // console.log(product.variants[selectedVariantIndex]);

                setSelectedVariantIndex(e.target.selectedIndex);
              }}
            >
              {product.variants.map((variant) => {
                return (
                  <option
                    key={variant.variantId}
                    value={variant.variantId}
                    className="text-sm"
                  >
                    {variant.qty} {variant.unit}
                  </option>
                );
              })}
            </select>
          ) : (
            <p className="rounded-sm border border-gray-300 text-sm px-2 py-1 text-center">
              {product?.variants?.[selectedVariantIndex].qty}{" "}
              {product?.variants?.[selectedVariantIndex].unit}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center  justify-between ">
            <h4 className="md:text-xl text-md font-semibold text-emerald-600">
              {product.variants[selectedVariantIndex]?.offerPrice}{" "}
              <span className="text-base text-gray-400 line-through">
                {product.variants[selectedVariantIndex]?.basePrice}
              </span>
            </h4>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <span className="material-symbols-rounded p-0.5">star</span>
                </span>
                <span className="from-inherit text-sm text-gray-950">4.5</span>
              </span>
            </div>
          </div>
          <AddToCart
            // product={product}
            productId={product.productId}
            variantId={product.variants[selectedVariantIndex].variantId}
            stock={product?.variants[selectedVariantIndex].stock}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
