import { AxiosFetcher } from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../StoreProvider";

// Enhanced thunk with condition to prevent duplicate calls
export const fetchAllProducts = createAsyncThunk(
  "products",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { latitude, longitude } = state.geolocation;

    // Prepare headers with geolocation if available
    const headers: Record<string, string> = {};
    if (latitude && longitude) {
      headers["x-latitude"] = latitude.toString();
      headers["x-longitude"] = longitude.toString();
      console.log("🌍 Adding geolocation to products API headers:", {
        latitude,
        longitude,
      });
    }

    const response = await AxiosFetcher.post(
      "/stores/products/list",
      {
        isFeatured: 1,
      },
      {
        headers,
      }
    );
    if (response?.data?.Status) {
      return response?.data;
    }
    return null;
  },
  {
    // Only fetch if we don't already have data or are not currently loading
    // condition: (_, { getState }) => {
    //   const state = getState() as RootState;
    //   const { data, isLoading } = state.products;
    //   console.log("datadasdasdasdasdsadadasdsaadweqwe", data, isLoading);
    //   // Don't fetch if we already have data or are currently loading
    //   return !isLoading && (!data || data.length === 0);
    // },
  }
);

// Define a type for the product item structure based on your API response
interface Product {
  productId: string;
  // Add other product properties as needed
  [key: string]: any; // For other dynamic properties
}

interface ProductsState {
  data: Product[];
  error: boolean;
  isLoading: boolean;
  lastFetched: number | null;
}

const allProducts = createSlice({
  initialState: {
    data: [],
    error: false,
    isLoading: false,
    lastFetched: null,
  } as ProductsState,
  name: "products",
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      if (action.payload?.Products) {
        state.data = action.payload.Products;
        state.lastFetched = Date.now();
      }
      state.isLoading = false;
    });
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchAllProducts.rejected, (state) => {
      // Keep existing data on error, but update error state
      state.error = true;
      state.isLoading = false;
    });
  },
  reducers: {
    // Add a reset action if needed
    resetProductsState: (state) => {
      state.data = [];
      state.error = false;
      state.isLoading = false;
      state.lastFetched = null;
    },
  },
});

export const allProductsReducer = allProducts.reducer;
