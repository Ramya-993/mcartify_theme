import { deleteAllFromCart, fetchCart } from "@/store/slices/cart";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { StoreData } from "@/types/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAddress } from "@/store/slices/address";
import { fetchCustomer, login, logout } from "@/store/slices/user";
import { fetchStore } from "@/store/slices/store";
import { togglePopModal, updatePopModalData } from "@/store/slices/modal";

import Pincode from "@/components/custom/pincode";
import LoginModal from "@/themes/default/Grocery/theme1/components/auth/LoginModal";

export const useNavbar = (store: StoreData) => {
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<string>("Location");
  console.log("userLocation in useNavbar: ", userLocation);

  const dispatch = useDispatch<AppDispatch>();

  const [addressPopupShowing, setAddressPopupShowing] = useState(false);
  const [cartPopupShowing, setCartPopupShowing] = useState(false);
  const [isLogoutPopup, setIsLogoutPopup] = useState(false);

  const { data: cart } = useSelector((state: RootState) => state.cart);
  const { isLoggedIn, isGuest, user } = useSelector(
    (state: RootState) => state.user
  );
  const { customer } = useSelector((state: RootState) => state.user);
  const { channel, store: storeDetails } = useSelector(
    (state: RootState) => state.store
  );
  console.log("storeDetails12dasdsad3456789", store);

  const profileLinks = [
    {
      lable: "My Profile",
      href: "/profile",
      onClick: () => {
        router.push("/profile");
      },
      icon: "account_circle",
      protected: true,
    },
    {
      lable: "Order History",
      href: "/profile/orders",
      onClick: () => {
        router.push("/profile/orders");
      },
      icon: "history",
      protected: true,
    },
    {
      lable: "Saved Addresses",
      href: "/profile/addresses",
      onClick: () => {
        router.push("/profile/addressess");
      },
      icon: "home_pin",
      protected: true,
    },
    {
      lable: "Help & Support",
      href: "/profile/support",
      onClick: () => {
        router.push("/profile/support");
      },
      icon: "help",
      protected: false,
    },
  ];

  // Load location from localStorage on initial load
  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setUserLocation(savedLocation);
    }
  }, []);

  useEffect(() => {
    // Only fetch store data if not already available (fallback for client-side navigation)
    if (!storeDetails?.Store?.storeName) {
      dispatch(fetchStore());
    }
  }, [dispatch, storeDetails?.Store?.storeName]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
      dispatch(fetchAddress());
      dispatch(fetchCustomer());
    }
  }, [dispatch, isLoggedIn]);

  // Auto-open location selector if customer doesn't have location set and no location in localStorage
  // useEffect(() => {
  //   // Small delay to ensure customer data is loaded
  //   const timer = setTimeout(() => {
  //     const savedLocation = localStorage.getItem("selectedLocation");
  //     const hasLocation =
  //       customer?.location || savedLocation || userLocation !== "Location";

  //     if (!hasLocation) {
  //       console.log("Auto-opening location selector - no location set");
  //       handlePincode();
  //     }
  //   }, 1000); // 1 second delay

  //   return () => clearTimeout(timer);
  // }, [customer, userLocation]); // Run when customer data or location changes

  useEffect(() => {
    const userToken =
      localStorage.getItem("token") || localStorage.getItem("guest_token");
    if (userToken && !isLoggedIn) {
      dispatch(login(userToken));
    }
  }, [dispatch, isLoggedIn]);

  const handleLocationChange = (name: string) => {
    console.log(
      "handleLocationChange in Navbar",
      name,
      "customer",
      customer,
      "isLoggedIn",
      isLoggedIn,
      "addressPopupShowing",
      addressPopupShowing,
      "channel",
      channel,
      "storeDetails",
      storeDetails,
      "cartPopupShowing",
      cartPopupShowing,
      "isLoggedIn",
      isLoggedIn,
      "isGuest",
      isGuest,
      "user",
      user,
      "store",
      store
    );

    // Update local state
    setUserLocation(name);

    // Persist to localStorage
    localStorage.setItem("selectedLocation", name);

    // Also update customer location if possible (this would need backend support)
    console.log("Location updated to:", name);
  };

  const handlePincode = () => {
    if (customer) {
      dispatch(
        updatePopModalData({
          content: (
            <Pincode saveLocation={handleLocationChange} store={store} />
          ),
          width: "max-w-xl",
        })
      );
      dispatch(togglePopModal(true));
    } else {
      dispatch(
        updatePopModalData({
          content: (
            <LoginModal
              storeImage={store.Store?.logo || ""}
              storeName={store.Store?.storeName || ""}
              asComponent={true}
            />
          ),
          width: "max-w-xl",
        })
      );
      dispatch(togglePopModal(true));
    }
  };

  const handleLogin = () => {
    dispatch(
      updatePopModalData({
        content: (
          <LoginModal
            storeImage={store.Store?.logo || ""}
            storeName={store.Store?.storeName || ""}
            asComponent={true}
          />
        ),
        width: "max-w-xl",
      })
    );
    dispatch(togglePopModal(true));
  };

  const handleLogout = () => {
    dispatch(logout());

    localStorage.clear();

    router.push("/");
    dispatch(deleteAllFromCart());
    setIsLogoutPopup(false);

    // Reset location on logout
    setUserLocation("Location");
  };

  const handleCancel = () => {
    setIsLogoutPopup(false);
  };

  return {
    location: userLocation,
    addressPopupShowing,
    cartPopupShowing,
    isLogoutPopup,
    cart,
    isLoggedIn,
    isGuest,
    user,
    customer,
    storeDetails,
    profileLinks,
    handleLocationChange,
    handlePincode,
    handleLogout,
    handleCancel,
    setAddressPopupShowing,
    setCartPopupShowing,
    setIsLogoutPopup,
    handleLogin,
  };
};
