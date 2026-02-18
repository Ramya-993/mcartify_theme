import IInitialData from "@/types/redux-initial-response";
import { AxiosFetcher } from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Bounce, toast } from "react-toastify";
import { toastSuccess, toastError } from "@/utils/toastConfig";
import type { RootState } from "../StoreProvider";

const initialState: IInitialData = {
  data: null,
  error: null,
  isLoading: false,
};

export const fetchCart = createAsyncThunk(
  "fetchCart",
  async (_, { getState }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = state.geolocation;

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        "";

      // Prepare headers with geolocation if available
      const headers: Record<string, string> = {
        Authorization: token ? `Bearer ${token}` : "",
      };
      if (latitude && longitude) {
        headers["x-latitude"] = latitude.toString();
        headers["x-longitude"] = longitude.toString();
        console.log("🌍 Adding geolocation to fetchCart API headers:", {
          latitude,
          longitude,
        });
      }

      const response = await AxiosFetcher.get("/stores/cart", {
        headers,
      });

      // Save guest token from cart response
      localStorage.setItem("guest_token", response.data?.guestToken || "");

      return response.data; // Return only the data
    } catch (e) {
      console.log(e);
    }
  }
);

export const addToCart = createAsyncThunk(
  "addtocart",
  async (
    data: {
      productId: number;
      variantId: number;
      quantity: number;
    },
    { dispatch }
  ) => {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        null;
      if (token) {
        await AxiosFetcher.post(`/stores/cart/add`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }).then((res) => {
          console.log(res);
          //  toastSuccess("cart updated successfully")
          return res.data; // Return only the data
        });
      } else {
        await AxiosFetcher.post(`/stores/cart/add`, data, {
          withCredentials: true,
        })
          .then(() => {
            //  toastSuccess("cart updated successfully")
          })
          .then((res: any) => {
            localStorage.setItem(
              "guest_token",
              JSON.stringify(res.data?.guestToken) || ""
            );
            console.log(res);
            return res.data;
          });
      }
    } catch (e) {
      throw e;
    } finally {
      dispatch(fetchCart());
    }
  }
);

export const deleteFromCart = createAsyncThunk(
  "deleteFromCart",
  async (varientId: number, { dispatch }) => {
    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        "";
      if (token) {
        const response = await AxiosFetcher.delete(
          `/stores/cart/delete/${varientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        return response.data; // Return only the data
      }
    } catch (e) {
      throw e; // rethrow the error
    } finally {
      dispatch(fetchCart());
    }
  }
);

export const clearCart = createAsyncThunk(
  "clearCart",
  async (rest, { dispatch }) => {
    try {
      const guest_token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        "";
      if (guest_token) {
        const response = await AxiosFetcher.delete("/stores/cart/clear", {
          headers: {
            Authorization: `Bearer ${guest_token}`,
          },
          withCredentials: true,
        });
        return response.data; // Return only the data
      }
    } catch (e) {
      throw e; // rethrow the error
    } finally {
      dispatch(fetchCart());
    }
  }
);

export const cartSlice = createSlice({
  initialState: initialState,
  name: "cart",
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.data = action.payload; // No need for .data here
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.data = null;
        state.error = action.error.message; // Access error message
        state.isLoading = false;
      });

    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });

    builder
      .addCase(deleteFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFromCart.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
  reducers: {
    deleteAllFromCart(state) {
      state.data = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { deleteAllFromCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
