import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import ICartItem from "@/types/cartItem";
import { addToCart, deleteFromCart, fetchCart } from "@/store/slices/cart";
import { toastInfo } from "@/utils/toastConfig";
import { loginAndFetchCustomer } from "@/store/slices/user";

interface AddToCartProps {
  productId: number;
  variantId: number;
  stock: number;
}

export const useAddToCart = ({
  productId,
  variantId,
  stock,
}: AddToCartProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: cart } = useSelector((state: RootState) => state.cart);

  const productInCart: ICartItem =
    cart?.CartItems?.find(
      (item: ICartItem) =>
        item.productId == productId && item.variantId == variantId
    ) || null;

  const handleDecrement = (e: React.MouseEvent) => {
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
  };

  const handleIncrement = (e: React.MouseEvent) => {
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
      toastInfo("Stock limit is reached");
    }
  };

  const continueAsGuest = async () => {
    const guestToken = localStorage.getItem("guest_token");
    if (guestToken) {
      // Use existing guest token
      dispatch(loginAndFetchCustomer({ token: guestToken }));

      // Add item to cart
      dispatch(
        addToCart({
          productId: productId,
          variantId: variantId,
          quantity: 1,
        })
      );
    } else {
      try {
        // Fetch cart will create a guest token if none exists
        await dispatch(fetchCart());

        // Get the newly created guest token
        const newGuestToken = localStorage.getItem("guest_token");

        // Login as guest and fetch customer details
        if (newGuestToken) {
          dispatch(loginAndFetchCustomer({ token: newGuestToken }));
        }

        // Add item to cart
        dispatch(
          addToCart({
            productId: productId,
            variantId: variantId,
            quantity: 1,
          })
        );
      } catch (error) {
        console.error("Error during guest checkout:", error);
      }
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Since guest tokens are now created automatically when the website loads,
    // we can directly add to cart without checking login status
    dispatch(
      addToCart({
        productId: productId,
        variantId: variantId,
        quantity: 1,
      })
    );
  };

  return {
    productInCart,
    handleDecrement,
    handleIncrement,
    handleAddToCart,
    continueAsGuest,
  };
};
