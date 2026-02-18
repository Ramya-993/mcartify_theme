import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { AxiosFetcher } from "@/utils/axios";
import { toastSuccess, toastError } from "@/utils/toastConfig";
import {
  addToCart,
  clearCart,
  deleteFromCart,
  fetchCart,
} from "@/store/slices/cart";
import { togglePopModal, updatePopModalData } from "@/store/slices/modal";
import LoginModal from "@/themes/default/Grocery/theme1/components/auth/LoginModal";

export const useCart = () => {
  const [paymentMode, setPaymentMode] = useState<undefined | number>(1);
  const [couponCode, setCouponCode] = useState("");

  // Get data from Redux store
  const { data: cart } = useSelector((state: RootState) => state.cart);
  const { store } = useSelector((state: RootState) => state.store);
  const { isLoggedIn, isGuest } = useSelector((state: RootState) => state.user);
  const { data: addresses, defaultAddressIndex } = useSelector(
    (state: RootState) => state.address
  );
  console.log("dsdadasdsdsdasdsadasdasd", cart);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // Check if cart meets minimum order requirements
  const canProceedToCheckout = () => {
    if (!cart) return false;
    return cart.FinalPrice >= cart.MinOrderAmount;
  };

  // Handle promo code removal
  const deletePromocode = () => {
    if (cart?.PromocodeDiscount) {
      const guest_token = localStorage.getItem("guest_token") || null;
      AxiosFetcher.delete("/stores/promocode/remove", {
        headers: {
          Authorization: `Bearer ${guest_token}`,
        },
        withCredentials: true,
      }).then(() => {
        toastSuccess("Promocode removed");
        dispatch(fetchCart());
      });
    }
  };

  // Handle coupon application
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
            toastSuccess(res?.data?.Message || "Error occurred");
            setCouponCode("");
            dispatch(fetchCart());
          } else {
            dispatch(fetchCart());
            setCouponCode("");
          }
        });
      }
    } catch (e: unknown) {
      const error = e as { response?: { data?: { Message?: string } } };
      toastError(error?.response?.data?.Message || "Error occurred");
    }
  };

  // Handle order creation
  const handleOrder = () => {
    try {
      const guest_token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        null;
      if (guest_token) {
        AxiosFetcher.post(
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
        )
          .then((res) => res.data)
          .then((r) => {
            dispatch(fetchCart());
            router.replace(`order-success?orderId=${r.Order.OrderId}`);
          });
      }
    } catch (e: unknown) {
      const error = e as { response?: { data?: { Message?: string } } };
      toastError(error?.response?.data?.Message || "Error occurred");
    }
  };

  // Handle item quantity increment/decrement
  const handleQuantityChange = (
    productId: number,
    variantId: number,
    quantity: number
  ) => {
    if (quantity < 1) {
      dispatch(deleteFromCart(variantId));
    } else {
      dispatch(
        addToCart({
          productId,
          variantId,
          quantity,
        })
      );
    }
  };

  // Handle checkout process
  const handleCheckout = () => {
    // Check minimum order amount first
    if (!canProceedToCheckout()) {
      toastError(
        `Minimum order amount is ${cart?.MinOrderAmount}. Add ${
          (cart?.MinOrderAmount || 0) - (cart?.FinalPrice || 0)
        } more to proceed.`
      );
      return;
    }

    // Navigate to checkout for regular logged-in users
    if (isLoggedIn && !isGuest) {
      router.push("/checkout");
    }
    // Navigate to checkout for guest users if allowed
    else if (isGuest && store?.loginTypes?.[0]?.allowGuest) {
      router.push("/checkout");
    }
    // Show login modal for non-logged-in users
    else {
      dispatch(
        updatePopModalData({
          content: (
            <LoginModal
              storeImage={store?.Store?.logo || ""}
              storeName={store?.Channels?.title || ""}
              asComponent={true}
            />
          ),
          width: "max-w-xl",
        })
      );
      dispatch(togglePopModal(true));
    }
  };

  // Handle cart clearing
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // Handle item removal
  const handleRemoveItem = (variantId: number) => {
    dispatch(deleteFromCart(variantId));
  };

  return {
    cart,
    store,
    isLoggedIn,
    isGuest,
    addresses,
    defaultAddressIndex,
    paymentMode,
    setPaymentMode,
    couponCode,
    setCouponCode,
    canProceedToCheckout,
    deletePromocode,
    applyCoupon,
    handleOrder,
    handleQuantityChange,
    handleCheckout,
    handleClearCart,
    handleRemoveItem,
    router,
  };
};
