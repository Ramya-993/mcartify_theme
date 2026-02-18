import IInitialData from "@/types/redux-initial-response";
import { AxiosFetcher } from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { togglePopModal } from "./modal";
import { Bounce, toast } from "react-toastify";
import { toastSuccess, toastError } from "@/utils/toastConfig";
import type { RootState } from "../StoreProvider";

const initialState: IInitialData & { defaultAddressIndex: number } = {
  data: null,
  defaultAddressIndex: 0,
  error: null,
  isLoading: false,
};

export const fetchAddress = createAsyncThunk(
  "fetchAddress",
  async (_, { getState }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = state.geolocation;

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        null;

      // Prepare headers with geolocation if available
      const headers: Record<string, string> = {
        Authorization: token ? `Bearer ${token}` : "",
      };
      if (latitude && longitude) {
        headers["x-latitude"] = latitude.toString();
        headers["x-longitude"] = longitude.toString();
        console.log("🌍 Adding geolocation to fetchAddress API headers:", {
          latitude,
          longitude,
        });
      }

      const response = await AxiosFetcher.get("/stores/addresses", {
        headers,
      });

      return response.data; // Return only the data
    } catch (e) {
      console.log(e);
    }
  }
);

export const addNewAddress = createAsyncThunk(
  "addNewAddress",
  async (addressData: any, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = state.geolocation;

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        null;

      // Prepare headers with geolocation if available
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      if (latitude && longitude) {
        headers["x-latitude"] = latitude.toString();
        headers["x-longitude"] = longitude.toString();
        console.log("🌍 Adding geolocation to addNewAddress API headers:", {
          latitude,
          longitude,
        });
      }

      const response = await AxiosFetcher.post(
        `/stores/address/add`,
        addressData,
        {
          headers,
          withCredentials: true,
        }
      );

      if (response.data?.Status) {
        dispatch(togglePopModal(false));
        toastSuccess("Address added Successfully");
      } else {
        console.log(response.data);
        throw new Error(response.data);
      }
      return response.data; // Return only the data
    } catch (e: any) {
      // console.log(e?.response?.data?.Message);

      toastError(
        e?.response?.data?.Message || "Can not Add address right now."
      );
    } finally {
      dispatch(fetchAddress());
    }
  }
);

export const updateAddress = createAsyncThunk(
  "updateAddress",
  async (addressData: any, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = state.geolocation;

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        null;

      // Prepare headers with geolocation if available
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      if (latitude && longitude) {
        headers["x-latitude"] = latitude.toString();
        headers["x-longitude"] = longitude.toString();
        console.log("🌍 Adding geolocation to updateAddress API headers:", {
          latitude,
          longitude,
        });
      }

      const response = await AxiosFetcher.post(
        `/stores/address/update`,
        addressData,
        {
          headers,
          withCredentials: true,
        }
      );

      if (response.data?.Status) {
        dispatch(togglePopModal(false));
        toastSuccess("Updated address Successfully");
      } else {
        console.log(response.data);
        throw new Error(response.data);
      }
      return response.data;
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(fetchAddress());
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "deleteAddress",
  async (addressId: string, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = state.geolocation;

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        null;

      // Prepare headers with geolocation if available
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      if (latitude && longitude) {
        headers["x-latitude"] = latitude.toString();
        headers["x-longitude"] = longitude.toString();
        console.log("🌍 Adding geolocation to deleteAddress API headers:", {
          latitude,
          longitude,
        });
      }

      const response = await AxiosFetcher.delete(
        `/stores/address/delete/${addressId}`,
        {
          headers,
          withCredentials: true,
        }
      );

      if (response.data?.Status) {
        dispatch(togglePopModal(false));
        toastSuccess("Updated address Successfully");
      } else {
        console.log(response.data);
        throw new Error(response.data);
      }
      return response.data;
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(fetchAddress());
    }
  }
);

const addressSlice = createSlice({
  initialState: initialState,
  name: "address",
  reducers: {
    changeAddressIndex: (state, action) => {
      state.defaultAddressIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAddress.fulfilled, (state, action) => {
        state.data = action.payload.Addresses; // No need for .data here
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchAddress.rejected, (state, action) => {
        state.data = null;
        state.error = action.error.message; // Access error message
        state.isLoading = false;
      });

    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewAddress.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { changeAddressIndex } = addressSlice.actions;
export const addressReducer = addressSlice.reducer;
