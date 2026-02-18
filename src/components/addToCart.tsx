"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import ICartItem from "@/types/cartItem";
import { addToCart, deleteFromCart } from "@/store/slices/cart";
import { togglePopModal, updatePopModalData } from "@/store/slices/modal";
import LoginModal from "@/themes/default/Grocery/components/auth/LoginModal";
import { toastInfo } from "@/utils/toastConfig";
interface ICartCard {
  productId: number;
  variantId: number;
  stock: number;
}

const AddToCart = ({ productId, variantId, stock }: ICartCard) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: cart } = useSelector((state: RootState) => state.cart);
  const { store } = useSelector((state: RootState) => state.store);
  const { isLoggedIn } = useSelector((state: RootState) => state.user);

  const productInCart: ICartItem =
    cart?.CartItems?.find(
      (item: ICartItem) =>
        item.productId == productId && item.variantId == variantId
    ) || null;

  return (
    <span>
      {productInCart ? (
        <span className="md:mt-4 mt-1 flex cursor-pointer items-center divide-x divide-gray-300 rounded-full border border-gray-300 text-sm sm:text-base">
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (productInCart.quantity > 1) {
                dispatch(
                  addToCart({
                    productId: productId,
                    variantId: variantId,
                    quantity: productInCart.quantity - 1,
                  })
                );
              } else {
                dispatch(deleteFromCart(variantId));
              }
            }}
            className="grid h-full place-items-center rounded-l-full bg-gray-100 px-3 py-1 sm:px-4 sm:py-2 transition hover:bg-gray-200"
          >
            <span className="material-symbols-rounded text-sm sm:text-base">
              remove
            </span>
          </span>
          <span className="min-w-10 sm:min-w-14 grow py-1 sm:py-1.5 text-center">
            {productInCart.quantity}
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (stock > productInCart.quantity) {
              dispatch(
                addToCart({
                  productId: productId,
                  variantId: variantId,
                  quantity: productInCart.quantity + 1,
                  })
                );
              } else {
                toastInfo("stock limit is reached");
              }
            }}
            className="grid h-full place-items-center rounded-r-full bg-emerald-100 px-3 py-1 sm:px-4 sm:py-2 transition hover:bg-emerald-200"
          >
            <span className="material-symbols-rounded text-sm sm:text-base">
              add
            </span>
          </span>
        </span>
      ) : (
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (!isLoggedIn) {
              dispatch(
                updatePopModalData({
                  content: (
                    <LoginModal
                      storeImage={store?.Store?.logo}
                      storeName={store?.Channels?.title}
                      asComponent={true}
                    />
                  ),
                  width: "max-w-xl",
                })
              );
              dispatch(togglePopModal(true));
            } else {
              dispatch(
                addToCart({
                  productId: productId,
                  variantId: variantId,
                  quantity: 1,
                })
              );
            }
          }}
          className="mt-3 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-emerald-600 px-1 py-1 md:px-4 md:py-2 text-sm sm:text-base text-emerald-600 transition hover:bg-emerald-600 hover:text-white"
        >
          <span className="material-symbols-rounded mr-2 text-sm sm:text-base">
            local_mall
          </span>
          <span>Add to cart</span>
        </span>
      )}
    </span>
  );
};

export default AddToCart;
