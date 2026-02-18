import { AxiosFetcher } from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../StoreProvider";

export const fetchAllCategory = createAsyncThunk(
  "category",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { latitude, longitude } = state.geolocation;

    // Prepare headers with geolocation if available
    const headers: Record<string, string> = {};
    if (latitude && longitude) {
      headers["x-latitude"] = latitude.toString();
      headers["x-longitude"] = longitude.toString();
      console.log("🌍 Adding geolocation to categories API headers:", {
        latitude,
        longitude,
      });
    }

    const response = await AxiosFetcher.get("/stores/categories/all", {
      headers,
    });
    if (response?.data?.Status) {
      return await response?.data;
    }
  }
);

const allCategory = createSlice({
  initialState: {
    data: [],
    error: false,
    isLoading: false,
  },
  name: "category",
  extraReducers: (builder) => {
    builder.addCase(fetchAllCategory.fulfilled, (state, action) => {
      state.data = action.payload?.Categories;
      state.isLoading = false;
    });
    builder.addCase(fetchAllCategory.pending, (state) => {
      state.isLoading = true;
      state.error = false;
    });
    builder.addCase(fetchAllCategory.rejected, (state) => {
      state.data = [];
      state.error = true;
      state.isLoading = false;
    });
  },
  reducers: {},
});

export const allCategoryReducer = allCategory.reducer;
