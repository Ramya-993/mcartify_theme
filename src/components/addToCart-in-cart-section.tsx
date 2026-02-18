"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import ICartItem from "@/types/cartItem";
import IProduct from "@/types/product";
import { addToCart, deleteFromCart } from "@/store/slices/cart";

interface ICartCard {
  product: ICartItem;
}

const AddToCart = ({ product }: ICartCard) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: cart } = useSelector((state: RootState) => state.cart);

  const productInCart: ICartItem =
    cart?.CartItems?.find(
      (item: IProduct) => item.productId == product.productId,
    ) || null;

  return (
    <div>
      {productInCart ? (
        <div className="mt-4 flex cursor-pointer items-center divide-x divide-gray-300 rounded-full border border-gray-300">
          <div
            onClick={(e) => {
              e.stopPropagation();
              if (productInCart.quantity > 1) {
                dispatch(
                  addToCart({
                    productId: product.productId,
                    variantId: product.variantId,
                    quantity: productInCart.quantity - 1,
                  }),
                );
              } else {
                dispatch(deleteFromCart(product.variantId));
              }
            }}
            className="grid h-full place-items-center rounded-l-full bg-gray-100 px-4 py-2 transition hover:bg-gray-200"
          >
            <span className="material-symbols-rounded">remove</span>
          </div>
          <div className="grow py-1.5 text-center min-w-16">
            {productInCart.quantity}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              dispatch(
                addToCart({
                  productId: product.productId,
                  variantId: product.variantId,
                  quantity: productInCart.quantity + 1,
                }),
              );
            }}
            className="grid h-full place-items-center rounded-r-full bg-emerald-100 px-4 py-2 transition hover:bg-emerald-200"
          >
            <span className="material-symbols-rounded">add</span>
          </div>
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            dispatch(
              addToCart({
                productId: product.productId,
                variantId: product.variantId,
                quantity: 1,
              }),
            );
          }}
          className="mt-4 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-emerald-600 px-4 py-2 text-emerald-600 transition hover:bg-emerald-600 hover:text-white"
        >
          <span className="material-symbols-rounded mr-2">local_mall</span>
          <span>Add to cart</span>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
