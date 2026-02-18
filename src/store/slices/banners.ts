import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosFetcher } from "@/utils/axios";
import type { RootState } from "../StoreProvider";

interface Banner {
  name: string;
  image: string;
}

interface BannerState {
  banners: Banner[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: BannerState = {
  banners: [],
  isLoading: false,
  error: null,
};

// Explicitly define return type as `Banner[]`
export const fetchBanners = createAsyncThunk<Banner[], void>(
  "banners/fetchBanners",
  async (_, { getState }) => {
    const state = getState() as RootState;
    const { latitude, longitude } = state.geolocation;

    // Prepare headers with geolocation if available
    const headers: Record<string, string> = {};
    if (latitude && longitude) {
      headers["x-latitude"] = latitude.toString();
      headers["x-longitude"] = longitude.toString();
      console.log("🌍 Adding geolocation to banners API headers:", {
        latitude,
        longitude,
      });
    }

    const response = await AxiosFetcher.get("/stores/banners", {
      headers,
    });
    return response.data.Banners; // Make sure the API response matches this type
  }
);

const bannersSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.isLoading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load banners";
      });
  },
});

export default bannersSlice.reducer;
