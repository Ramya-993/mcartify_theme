import { AxiosFetcher } from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Order, OrderPagination } from "@/types/order-response";
import type { RootState } from "../StoreProvider";

interface OrdersState {
  data: Order[];
  pagination: OrderPagination | null;
  error: boolean;
  isLoading: boolean;
}

export const fetchAllOrders = createAsyncThunk(
  "orders",
  async (orderConfig: { page: number; size: number }, { getState }) => {
    const state = getState() as RootState;
    const { latitude, longitude } = state.geolocation;

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("guest_token") ||
      "";

    // Prepare headers with geolocation if available
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };
    if (latitude && longitude) {
      headers["x-latitude"] = latitude.toString();
      headers["x-longitude"] = longitude.toString();
      console.log("🌍 Adding geolocation to orders API headers:", {
        latitude,
        longitude,
      });
    }

    const response = await AxiosFetcher.get(
      `stores/orders?page=${orderConfig.page}&size=${orderConfig.size}`,
      {
        headers,
      }
    );
    return await response.data;
  }
);

const ordersSlice = createSlice({
  initialState: {
    data: [],
    pagination: null,
    error: false,
    isLoading: false,
  } as OrdersState,
  name: "orders",
  extraReducers: (builder) => {
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      console.log(action.payload);
      state.data = action.payload?.Orders || [];
      state.pagination = action.payload?.Pagination || null;
      state.isLoading = false;
    });
    builder.addCase(fetchAllOrders.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchAllOrders.rejected, (state) => {
      state.data = [];
      state.pagination = null;
      state.error = true;
      state.isLoading = false;
    });
  },
  reducers: {},
});

export const ordersReducer = ordersSlice.reducer;
