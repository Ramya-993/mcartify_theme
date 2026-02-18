"use client";

import Ichild from "@/types/react-children";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { allCategoryReducer } from "./slices/category";
import { allProductsReducer } from "./slices/products";
import { cartReducer } from "./slices/cart";
import { dropdownReducer } from "./slices/dropdown";
import { addressReducer } from "./slices/address";
import { popModalReducer } from "./slices/modal";
import { userReducer } from "./slices/user";
import { storeDetailsReducer } from "./slices/store";
import { ordersReducer } from "./slices/orders";
import bannersReducer from "./slices/banners";
import { contactReducer } from "./slices/contactInfo";
import { contactFormReducer } from "./slices/contactForm";
import { geolocationReducer } from "./slices/geolocation";

export const makeStore = () => {
  return configureStore({
    reducer: {
      categories: allCategoryReducer,
      products: allProductsReducer,
      cart: cartReducer,
      store: storeDetailsReducer,

      // dropdowns and popups
      dropdown: dropdownReducer,
      modal: popModalReducer,

      // address
      address: addressReducer,
      banners: bannersReducer,

      // user section
      user: userReducer,
      contact: contactReducer,
      contactForm: contactFormReducer,
      orders: ordersReducer,

      // geolocation
      geolocation: geolocationReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });
};

const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

const StoreProvider = ({ children }: Ichild) => {
  return <Provider store={store}> {children} </Provider>;
};

export default StoreProvider;
