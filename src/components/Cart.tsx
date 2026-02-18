"use client";

import Breadcrumb from "@/components/ui/breadcrumbs";

import {
  addToCart,
  clearCart,
  deleteFromCart,
  fetchCart,
} from "@/store/slices/cart";
import { togglePopModal, updatePopModalData } from "@/store/slices/modal";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import ICartItem from "@/types/cartItem";
import IProduct from "@/types/product";
import { AxiosFetcher } from "@/utils/axios";
import { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toastSuccess, toastError } from "@/utils/toastConfig";

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

const Cart = () => {
  const [paymentMode, setPaymentMode] = useState<undefined | number>(1);
  const [couponCode, setCouponCode] = useState("");
  const { data: cart } = useSelector((state: RootState) => state.cart);
  const { store } = useSelector((state: RootState) => state.store);
  const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const { data: addresses, defaultAddressIndex } = useSelector(
    (state: RootState) => state.address
  );

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const deletePromocode = () => {
    if (cart?.PromocodeDiscount) {
      const guest_token = localStorage.getItem("guest_token") || null;
      AxiosFetcher.delete("/stores/promocode/remove", {
        headers: {
          Authorization: `Bearer ${guest_token}`,
        },
        withCredentials: true,
      }).then((res) => {
        toastSuccess("Promocode removed");
        dispatch(fetchCart());
      });
    }
  };

  const applyCoupon = () => {
    const guest_token = localStorage.getItem("guest_token") || null;
    try {
      if (couponCode) {
        AxiosFetcher.post(
          "/stores/promocode/apply",
          {
            promocode: couponCode.toUpperCase(),
          },
          {
            headers: {
              Authorization: `Bearer ${guest_token}`,
            },
            withCredentials: true,
          }
        ).then((res) => {
          if (res.data?.Message) {
            toastSuccess(res?.data?.Message || "Error occured");
            setCouponCode("");
            dispatch(fetchCart());
          } else {
            dispatch(fetchCart());
            setCouponCode("");
          }
        });
      }
    } catch (e: any) {
      toastError(e?.response?.data?.Message || "Error occured");
    }
  };

  const handleOrder = () => {
    try {
      const guest_token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        null;
      if (guest_token) {
        const req = AxiosFetcher.post(
          "/stores/order/create",
          {
            addressId: addresses?.[defaultAddressIndex]?.addressId,
            paymentType: paymentMode,
          },
          {
            headers: {
              Authorization: `Bearer ${guest_token}`,
            },
            withCredentials: true,
          }
        );
        const res = req
          .then((res) => res.data)
          .then((r) => {
            dispatch(fetchCart());
            router.replace(`order-success?orderId=${r.Order.OrderId}`);
          });
      }
    } catch (e: AxiosError | any) {
      toastError(e?.response?.data?.Message || "Error occured");
    }
  };

  return (
    <>
      <section className="container md:mx-auto max-w-7xl md:px-10 border-box">
        <Breadcrumb
          crumbItems={[
            { href: "/", label: "Home", isCurrent: false, isDisabled: false },
            {
              href: "/cart",
              label: "Cart",
              isCurrent: true,
              isDisabled: true,
            },
          ]}
          className="mx-auto max-w-6xl"
        ></Breadcrumb>
      </section>
      {cart?.CartItems?.length > 0 ? (
        <section className="bg-white md:px-10 px-2 py-3 lg:py-10">
          <div className="container md:mx-auto md:max-w-6xl border-box">
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="w-full border-box rounded-lg border border-solid border-gray-300 p-4 text-lg font-semibold">
                    {cart?.CartItems?.length && cart?.CartItems?.length} Items
                    Added in the cart
                  </h3>
                </div>
                <div className="flex flex-col md:gap-6 border-box">
                  <div className="overflow-x-auto border-box md:max-w-screen max-w-[300px] overflow-y-scroll max-h-[300px]">
                    <table className="w-full table-auto text-left">
                      <thead className="">
                        <tr className="border-b border-solid border-gray-300">
                          <th className="shrink-0 px-4 py-3 text-xs font-medium tracking-wider text-gray-500"></th>
                          <th className="px-4 py-3 text-xs font-medium tracking-wider text-gray-500">
                            Product
                          </th>
                          <th className="px-4 py-3 text-xs font-medium tracking-wider text-gray-500">
                            Price
                          </th>
                          <th className="px-4 py-3 text-xs font-medium tracking-wider text-gray-500">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-xs font-medium tracking-wider text-gray-500">
                            Subtotal
                          </th>
                          <th className="px-4 py-3 text-xs font-medium tracking-wider text-gray-500"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {cart &&
                          cart.CartItems.map((item: ICartItem, i: number) => {
                            const productInCart: ICartItem =
                              cart?.CartItems?.find(
                                (p: IProduct) => p.productId == item.productId
                              ) || null;

                            return (
                              <tr key={i}>
                                <td className="min-w-20 shrink-0 px-4 py-4 whitespace-nowrap">
                                  <Link href={`/products/${item.productId}`}>
                                    <Image
                                      width={90}
                                      height={90}
                                      src={item.image}
                                      alt={item.name}
                                      className="h-14 w-14 shrink-0 rounded object-cover"
                                    />
                                  </Link>
                                </td>
                                <td className="grow px-4 py-4">
                                  <div>
                                    <Link
                                      className="text-xs hover:underline"
                                      href={`/products/${item.productId}`}
                                    >
                                      {item.name} ({item.qty} {item.unit})
                                    </Link>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="font-medium text-gray-900">
                                    {item.currency}
                                    {item.offerPrice}
                                  </span>
                                </td>
                                <td>
                                  <div className="flex items-center">
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (productInCart.quantity > 1) {
                                          dispatch(
                                            addToCart({
                                              productId: item.productId,
                                              variantId: item.variantId,
                                              quantity: item.quantity - 1,
                                            })
                                          );
                                        } else {
                                          dispatch(
                                            deleteFromCart(item.variantId)
                                          );
                                        }
                                      }}
                                      className="grid size-7 cursor-pointer place-items-center rounded-full bg-gray-200"
                                    >
                                      <span className="material-symbols-rounded">
                                        remove
                                      </span>
                                    </span>
                                    <span className="min-w-8 text-center">
                                      {item.quantity}
                                    </span>
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(
                                          addToCart({
                                            productId: item.productId,
                                            variantId: item.variantId,
                                            quantity: item.quantity + 1,
                                          })
                                        );
                                      }}
                                      className="grid size-7 cursor-pointer place-items-center rounded-full bg-gray-200"
                                    >
                                      <span className="material-symbols-rounded">
                                        add
                                      </span>
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                  <span className="font-medium text-gray-900">
                                    {item.currency}
                                    {item.offerPrice * item.quantity}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-right whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      dispatch(deleteFromCart(item.variantId));
                                    }}
                                  >
                                    <span className="material-symbols-rounded cursor-pointer font-bold">
                                      close
                                    </span>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-2 border-box">
                    <button
                      className="text-emerald-600 rounded-md border border-emerald-600 px-6 py-2.5 text-center text-sm font-medium shadow-sm transition-all hover:bg-emerald-600 hover:text-white"
                      onClick={() => {
                        dispatch(clearCart());
                      }}
                    >
                      Remove All
                    </button>
                  </div>
                </div>
              </div>

              <div className="h-fit rounded-xl border border-solid border-gray-300 md:p-4 px-2 lg:col-span-4 max-w-screen border-box">
                <h3 className="mb-4 text-lg font-semibold uppercase">
                  Cart totals
                </h3>
                <div className="rounded-lg">
                  <div className="divide-y divide-gray-200">
                    <div className="flex items-center justify-between p-4">
                      <p className="text-base font-medium">Subtotal</p>
                      <h5 className="text-lg font-medium">
                        {cart?.Currency}
                        {cart?.FinalPrice}
                      </h5>
                    </div>

                    <div className="flex items-center justify-between p-4">
                      <p className="text-base font-medium">Total</p>
                      <h5 className="text-2xl font-semibold">
                        {cart?.Currency}
                        {cart?.FinalPrice}
                      </h5>
                    </div>

                    <div className="p-4">
                      <div className="mt-4 px-2">
                        <button
                          onClick={() => {
                            if (
                              isLoggedIn ||
                              (store && store?.loginTypes?.[0]?.allowGuest)
                            ) {
                              router.push("/checkout");
                            } else {
                              dispatch(
                                updatePopModalData({
                                  content: "You need to login to checkout",
                                  header: "Login Required",
                                  headerShown: true,
                                  width: "max-w-sm",
                                  footerShown: true,
                                })
                              );
                              dispatch(togglePopModal(true));
                            }
                          }}
                          className="hover:bg-emerald-600-600 flex w-full items-center justify-center rounded-md bg-emerald-600 px-6 py-2.5 text-base font-medium text-white transition-all"
                        >
                          Proceed to Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="grid min-h-[60vh] place-items-center gap-4 py-3 pb-10 lg:py-10">
          <div className="flex flex-col items-center">
            <div>
              <p className="font-semibold text-red-500 uppercase">
                Shopping Cart is Empty
              </p>
            </div>
            <div>
              <Image
                src={"/images/others/cart-empty.png"}
                height={100}
                width={100}
                className="mt-14 size-40"
                alt="empty cart"
              />
            </div>
            <div>
              <p className="mt-6 text-lg">
                You have no items in your shopping cart
              </p>
            </div>
            <button
              className="hover:border-emerald-600-600 mt-4 rounded-md border border-emerald-600 bg-emerald-600 px-6 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-emerald-700"
              onClick={() => {
                router.push("/");
              }}
            >
              Start Shopping
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default Cart;
