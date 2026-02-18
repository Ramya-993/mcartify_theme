"use client";

import { deleteAllFromCart, fetchCart } from "@/store/slices/cart";
import { AppDispatch, RootState } from "@/store/StoreProvider";
import { StoreData } from "@/types/store";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Pincode from "@/components/custom/pincode";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import AddressPopUp from "@/components/custom/ui/address-popup";
import { fetchAddress } from "@/store/slices/address";
import CartPopup from "@/components/custom/cart-popup";
import { togglePopModal, updatePopModalData } from "@/store/slices/modal";
import LoginModal from "@/themes/default/Grocery/components/auth/LoginModal";
import { fetchCustomer, login, logout } from "@/store/slices/user";
import { fetchStore } from "@/store/slices/store";
import Logout from "./auth/logout";
import { ModeToggle } from "@/components/mode-toggle";

const Navbar = ({ store }: { store: StoreData }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [location, setLocation] = useState<string>("Location");

  const dispatch = useDispatch<AppDispatch>();

  const [addressPopupShowing, setAddressPopupShowing] = useState(false);
  const [cartPopupShowing, setCartPopupShowing] = useState(false);
  const [isLogoutPopup, setIsLogoutPopup] = useState(false);

  const { data: cart } = useSelector((state: RootState) => state.cart);
  const { isLoggedIn, user } = useSelector((state: RootState) => state.user);
  const { customer } = useSelector((state: RootState) => state.user);
  const { channel, store: storeDetails } = useSelector(
    (state: RootState) => state.store
  );
  console.log("storeDetailsdsaddadasd", storeDetails);

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
  // console.log(storeDetails);

  useEffect(() => {
    // Only fetch store data if not already available (fallback for client-side navigation)
    if (!storeDetails) {
      dispatch(fetchStore());
    }
  }, [storeDetails, dispatch]);

  useEffect(() => {
    console.log(isLoggedIn);
    if (isLoggedIn) {
      // console.log(!isLoggedIn && !storeDetails?.loginTypes?.[0]?.allowGuest);
      dispatch(fetchCart());
      dispatch(fetchAddress());
      dispatch(fetchCustomer());
    }
  }, [dispatch, storeDetails, isLoggedIn]);

  useEffect(() => {
    const userToken =
      localStorage.getItem("token") || localStorage.getItem("guest_token");
    if (userToken) {
      console.log("loggin");
      dispatch(login(userToken));
    }
  }, [storeDetails, dispatch]);

  const handleLocationChange = (name: string) => {
    setLocation(name);
  };

  const handlePincode = () => {
    if (customer) {
      dispatch(
        updatePopModalData({
          content: <Pincode saveLocation={handleLocationChange} />,
          width: "max-w-xl",
        })
      ),
        dispatch(togglePopModal(true));
    } else {
      dispatch(
        updatePopModalData({
          content: (
            <LoginModal
              storeImage={store.Store.logo}
              storeName={store.Channels.title}
              asComponent={true}
            />
          ),
          width: "max-w-xl",
        })
      ),
        dispatch(togglePopModal(true));
    }
  };

  useEffect(() => {
    toast.dismiss();
    window.scrollTo(0, 0);
    dispatch(togglePopModal(false));
    dispatch(updatePopModalData({ title: "", content: null }));
  }, [pathName, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    router.push("/");
    // dispatch(fetchCart());
    dispatch(deleteAllFromCart());
    setIsLogoutPopup(false);
  };

  const handleCancel = () => {
    setIsLogoutPopup(false);
  };

  return (
    <div className="fixed top-0 z-30 w-full border-b border-solid border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 px-2 py-2 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src={store.Store.logo}
            alt={store.Channels.title}
            className="size-12 rounded"
            width={50}
            height={50}
          />
          <span className="textx-lg font-bold text-emerald-600 dark:text-emerald-400 md:text-2xl">
            {store.Channels.title}
          </span>
          <div
            // onMouseOver={() => {
            //   setAddressPopupShowing(true);
            // }}
            // onMouseLeave={() => {
            //   setAddressPopupShowing(false);
            // }}
            onClick={handlePincode}
            className="relative mr-2 flex cursor-pointer items-center gap-2 rounded-md p-1 font-[600] text-emerald-500 dark:text-emerald-400 shadow-sm transition hover:shadow-xl md:px-4 md:py-3"
          >
            <span className="material-symbols-rounded">pin_drop</span>
            <span className="hidden md:inline-block">
              {" "}
              {customer
                ? customer.location
                  ? customer.location
                  : "Location"
                : "Location"}
            </span>
            <span className="material-symbols-rounded">
              keyboard_arrow_down
            </span>
            {addressPopupShowing && (
              <AddressPopUp saveLocation={handleLocationChange} />
            )}
          </div>
        </div>
        <div className="hidden gap-6 font-[500] tracking-wide lg:flex">
          {storeDetails?.menu &&
            storeDetails.menu
              .filter((item: any) => item.enabled === 1)
              .sort((a: any, b: any) => a.priority - b.priority)
              .map((item: any, ind: number) => (
                <div
                  key={ind}
                  onClick={() => {
                    router.push(item.path);
                  }}
                  className={`cursor-pointer transition hover:text-emerald-600 dark:hover:text-emerald-400 ${
                    pathName.split("/")[1] == item.path.split("/")[1]
                      ? "text-emerald-600 dark:text-emerald-400"
                      : ""
                  }`}
                >
                  <span>{item.itemName}</span>
                </div>
              ))}
        </div>
        <div className="flex gap-4 *:cursor-pointer">
          {/* Mode Toggle */}
          <ModeToggle />

          <button
            onClick={() => {
              if (storeDetails?.loginTypes?.[0]?.allowGuest) {
                setCartPopupShowing(false);
                router.push("/cart");
              }
            }}
            onMouseOver={() => {
              if (pathName !== "/cart") {
                setCartPopupShowing(true);
              }
            }}
            onMouseLeave={() => {
              setCartPopupShowing(false);
            }}
            className="group relative grid size-10 place-items-center rounded-full bg-gray-100 dark:bg-gray-800 transition"
          >
            <div className="absolute -top-0.5 left-6 grid h-4 place-items-center rounded-full bg-emerald-600 dark:bg-emerald-500">
              {cart?.CartItems?.length > 0 && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 dark:bg-emerald-300 opacity-75"></span>
              )}
              <span className="px-1.5 text-[10px] leading-none text-white">
                {(cart?.CartItems?.length && cart?.CartItems?.length) ?? 0}{" "}
              </span>
            </div>

            <span className="material-symbols-rounded cursor-pointer transition group-hover:text-emerald-600 dark:text-gray-300 dark:group-hover:text-emerald-400">
              local_mall
            </span>
            {cartPopupShowing && <CartPopup />}
          </button>

          {isLoggedIn ? (
            <>
              <div className="lg:hidden">
                <Menu>
                  <MenuButton>
                    <div className="group grid size-10 place-items-center rounded-full bg-gray-100 dark:bg-gray-800 transition">
                      <span className="material-symbols-rounded transition group-hover:text-emerald-600 dark:text-gray-300 dark:group-hover:text-emerald-400">
                        account_circle
                      </span>
                    </div>
                  </MenuButton>
                  <MenuItems
                    anchor="bottom"
                    className="absolute left-4 z-20 -ml-2 flex flex-col rounded-md border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-2 py-1.5"
                  >
                    {profileLinks.map((profile, i) => (
                      <MenuItem key={i}>
                        <button
                          className="flex min-w-[200px] items-center gap-2 rounded-sm px-4 py-2 data-[focus]:bg-emerald-100 dark:data-[focus]:bg-emerald-900"
                          onClick={profile.onClick}
                        >
                          <span className="material-symbols-rounded text-gray-600 dark:text-gray-400">
                            {profile.icon}
                          </span>
                          <span>{profile.lable}</span>
                        </button>
                      </MenuItem>
                    ))}
                    <div>
                      <button
                        className="flex min-w-[250px] items-center gap-2 rounded-sm px-4 py-2 data-[focus]:bg-emerald-100 dark:data-[focus]:bg-emerald-900"
                        onClick={() => setIsLogoutPopup(!isLogoutPopup)}
                      >
                        <span className="material-symbols-rounded text-gray-600 dark:text-gray-400">
                          account_circle
                        </span>
                        <span>Logout</span>
                      </button>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
              {!pathName.startsWith("/profile") && (
                <div className="hidden lg:block">
                  <Menu>
                    <MenuButton>
                      <div className="group grid size-10 place-items-center rounded-full bg-gray-100 dark:bg-gray-800 transition">
                        <span className="material-symbols-rounded transition group-hover:text-emerald-600 dark:text-gray-300 dark:group-hover:text-emerald-400">
                          account_circle
                        </span>
                      </div>
                    </MenuButton>
                    <MenuItems
                      anchor="bottom"
                      className="absolute left-4 z-20 -ml-2 flex flex-col rounded-md border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 px-2 py-1.5"
                    >
                      {profileLinks.map((profile, i) => (
                        <MenuItem key={i}>
                          <button
                            className="flex min-w-[200px] items-center gap-2 rounded-sm px-4 py-2 data-[focus]:bg-emerald-100 dark:data-[focus]:bg-emerald-900"
                            onClick={profile.onClick}
                          >
                            <span className="material-symbols-rounded text-gray-600 dark:text-gray-400">
                              {profile.icon}
                            </span>
                            <span>{profile.lable}</span>
                          </button>
                        </MenuItem>
                      ))}
                      <div>
                        <button
                          className="flex min-w-[250px] items-center gap-2 rounded-sm px-4 py-2 data-[focus]:bg-emerald-100 dark:data-[focus]:bg-emerald-900"
                          onClick={() => setIsLogoutPopup(!isLogoutPopup)}
                        >
                          <span className="material-symbols-rounded text-gray-600 dark:text-gray-400">
                            account_circle
                          </span>
                          <span>Logout</span>
                        </button>
                      </div>
                    </MenuItems>
                  </Menu>
                </div>
              )}
            </>
          ) : (
            <div
              onClick={() => {
                dispatch(
                  updatePopModalData({
                    content: (
                      <LoginModal
                        storeImage={store.Store.logo}
                        storeName={store.Channels.title}
                        asComponent={true}
                      />
                    ),
                    width: "max-w-xl",
                  })
                ),
                  dispatch(togglePopModal(true));
              }}
            >
              <div className="group grid size-10 place-items-center rounded-full bg-gray-100 dark:bg-gray-800 transition">
                <span className="material-symbols-rounded transition group-hover:text-emerald-600 dark:text-gray-300 dark:group-hover:text-emerald-400">
                  account_circle
                </span>
              </div>
            </div>
          )}
        </div>
        {isLogoutPopup && (
          <Logout onLogout={handleLogout} onCancel={handleCancel} />
        )}
      </div>
    </div>
  );
};

export default Navbar;
