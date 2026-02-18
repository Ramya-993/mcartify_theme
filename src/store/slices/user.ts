import { AxiosFetcher } from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toastSuccess } from "@/utils/toastConfig";
import { AppDispatch } from "../StoreProvider";
import type { RootState } from "../StoreProvider";
import { fetchCart } from "./cart";

interface UserData {
  token?: string;
  userId?: number;
  email?: string;
  name?: string;
  mobile?: string;
}

interface CustomerDetails {
  id?: number;
  name?: string;
  email?: string;
  mobile?: string;
  gender?: string;
  customerId?: string;
  countryCode?: string;
  dob?: string;
  storeId?: number;
  phone?: string;
  altCountryCode?: string | null;
  altPhone?: string | null;
  areaPincode?: string | null;
  city?: string | null;
  customerType?: number;
  genderValue?: string;
  avatar?: string;
  location?: string;
  addresses?: Array<{
    id: number;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: number;
  }>;
  [key: string]: unknown; // Index signature with unknown instead of any
}

interface AuthState {
  user: UserData | null;
  customer: CustomerDetails | null;
  isLoggedIn: boolean;
  isGuest: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  customer: null,
  isLoggedIn: false,
  isGuest: false,
  isInitialized: false,
};

export const fetchCustomer = createAsyncThunk(
  "users/fetchCustomer", // Use correct action type prefix to match the slice name
  async (_, { getState }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = state.geolocation;

      // Force getting token from localStorage to ensure we have the latest
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        "";

      if (!token) {
        throw new Error("No token available");
      }

      // Prepare headers with geolocation if available
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      if (latitude && longitude) {
        headers["x-latitude"] = latitude.toString();
        headers["x-longitude"] = longitude.toString();
        console.log("🌍 Adding geolocation to fetchCustomer API headers:", {
          latitude,
          longitude,
        });
      }

      const response = await AxiosFetcher.get(`/customer/details`, {
        headers,
      });

      console.log("Customer API response:", response.data);
      return response.data;
    } catch (e) {
      console.error("Error fetching customer details:", e);
      throw e;
    }
  }
);

// Thunk to handle login and then fetch customer details
export const loginAndFetchCustomer =
  (userData: UserData) => async (dispatch: AppDispatch) => {
    // First login to set the token in localStorage
    dispatch(login(userData));

    // Wait a tick to ensure localStorage is updated before fetching customer
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Only fetch customer details for non-guest tokens
    const token = localStorage.getItem("token");
    if (token) {
      // Then fetch customer details with the updated token
      try {
        const result = await dispatch(fetchCustomer());

        // Check if the fetch was successful but returned empty customer details
        if (
          result.payload &&
          ((result.payload.CustomerDetails &&
            Object.keys(result.payload.CustomerDetails).length === 0) ||
            Object.keys(result.payload).length === 0)
        ) {
          console.log(
            "Empty customer details detected - user deleted from admin panel"
          );

          // Reset to guest and fetch cart to get guest token
          dispatch(resetToGuest());
          await dispatch(fetchCart());

          // Get the guest token from localStorage and update user state
          const guestToken = localStorage.getItem("guest_token");
          if (guestToken) {
            dispatch(login({ token: guestToken }));
          }
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
    }
  };

const userSlice = createSlice({
  initialState,
  name: "users",
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      // Check if user is a guest (based on token type)
      // If we have a regular token, user is not a guest
      // If we only have guest_token and no regular token, user is a guest
      const regularToken = localStorage.getItem("token");
      const guestToken = localStorage.getItem("guest_token");
      state.isGuest = !regularToken && !!guestToken;
      console.log("isGuest12356", state.isGuest);
      console.log("regularToken12356", regularToken);
      console.log("guestToken12356", guestToken);
      state.isInitialized = true;
      // Note: Customer details will be fetched by the loginAndFetchCustomer thunk
    },
    logout: (state) => {
      state.user = null;
      state.customer = null;
      state.isLoggedIn = false;
      state.isGuest = false;
      state.isInitialized = false;
      localStorage.clear();
      toastSuccess("logout successful");
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
    // New action to reset user to guest when deleted from admin panel
    resetToGuest: (state) => {
      console.log("Resetting user to guest due to admin deletion");
      state.user = null;
      state.customer = null;
      state.isLoggedIn = false;
      state.isGuest = true; // Will be set to true temporarily, will be updated when new guest token is created
      state.isInitialized = false; // Reset to allow re-initialization with new guest token
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomer.pending, () => {
        // Will be implemented if loading state is needed
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        console.log("Customer details received:", action.payload);

        // Check if we have CustomerDetails in the payload
        if (action.payload && action.payload.CustomerDetails) {
          // Check if CustomerDetails is an empty object (user deleted from admin)
          const customerDetails = action.payload.CustomerDetails;
          const isEmptyObject =
            customerDetails &&
            typeof customerDetails === "object" &&
            Object.keys(customerDetails).length === 0;

          if (isEmptyObject) {
            console.log(
              "CustomerDetails is empty - user was deleted from admin panel"
            );
            // Don't set customer details, trigger guest token creation instead
            // This will be handled by the resetToGuest action and fetchCart
            return;
          }

          state.customer = customerDetails;
        } else if (action.payload) {
          // Fallback if API response structure is different
          // Also check if this is an empty object
          const isEmptyObject =
            action.payload &&
            typeof action.payload === "object" &&
            Object.keys(action.payload).length === 0;

          if (isEmptyObject) {
            console.log(
              "Customer payload is empty - user was deleted from admin panel"
            );
            return;
          }

          state.customer = action.payload;
        }
        state.isInitialized = true;
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        console.error("Failed to fetch customer details:", action.error);
        state.isInitialized = true;
        // Optional: You could set an error state here if needed
      })
      .addCase(fetchCart.fulfilled, (state) => {
        // When cart is fetched and we have a guest token, update user state if needed
        // This handles the case where fetchCart creates a new guest token
        const guestToken = localStorage.getItem("guest_token");
        const regularToken = localStorage.getItem("token");

        // Only update user state if:
        // 1. We have a guest token from cart
        // 2. We're not already logged in with a regular token
        // 3. We're in a state where we need to initialize as guest
        if (guestToken && !regularToken && !state.isLoggedIn) {
          console.log("Guest token received from cart, updating user state");
          state.user = { token: guestToken };
          state.isLoggedIn = true;
          state.isGuest = true;
          state.isInitialized = true;
        } else if (guestToken && !regularToken && state.isGuest) {
          // Update token if we're already a guest but token changed
          state.user = { token: guestToken };
        }
      });
  },
});

export const userReducer = userSlice.reducer;
export const { login, logout, setInitialized, resetToGuest } =
  userSlice.actions;
