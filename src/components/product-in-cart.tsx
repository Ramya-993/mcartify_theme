import React from "react";

import ICartItem from "@/types/cartItem";
import AddToCart from "./addToCart-in-cart-section";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/StoreProvider";
import { deleteFromCart } from "@/store/slices/cart";

const CartProduct = ({ product }: { product: ICartItem }) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="rounded-lg border border-gray-200 duration-500 hover:border-emerald-600">
      <div className="p-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex shrink-0 items-center">
            <Image
              alt={product.name}
              className="h-auto w-40"
              src={product.image}
              width={300}
              height={300}
            />
          </div>
          <div className="flex flex-grow">
            <div className="flex flex-grow flex-col">
              <div className="shrink">
                <h4 className="text-xl font-semibold">{product.name}</h4>
              </div>
              <div className="mb-2 shrink">
                <h4 className="text-gray-400 font-semibold">
                  {product.qty} {product.unit}
                </h4>
              </div>
              <div className="flex grow items-end gap-4">
                <AddToCart product={product} />{" "}
                <div
                  onClick={() => {
                    dispatch(deleteFromCart(product.variantId));
                  }}
                  className="grid place-items-center rounded-md bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                >
                  <span className="material-symbols-rounded cursor-pointer">
                    delete
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between text-end">
              {/* <span className="material-symbols-rounded">favorite</span> */}
              <div className="mt-auto">
                <h5 className="text-lg font-medium">
                  <span>{product.currency}</span>
                  <span>{product.basePrice.toFixed(2)}</span>
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProduct;
