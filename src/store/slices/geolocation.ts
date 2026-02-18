import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

const initialState: GeolocationState = {
  latitude: null,
  longitude: null,
  isLoading: false,
  error: null,
  hasPermission: false,
};

// Async thunk to get current position
export const getCurrentLocation = createAsyncThunk(
  "geolocation/getCurrentLocation",
  async (_, { rejectWithValue }) => {
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      return new Promise<{ latitude: number; longitude: number }>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log("🌍 Geolocation obtained:", { latitude, longitude });
              resolve({ latitude, longitude });
            },
            (error) => {
              let errorMessage = "Unable to retrieve location";
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  errorMessage = "Location access denied by user";
                  break;
                case error.POSITION_UNAVAILABLE:
                  errorMessage = "Location information is unavailable";
                  break;
                case error.TIMEOUT:
                  errorMessage = "Location request timed out";
                  break;
              }
              console.error("🌍 Geolocation error:", errorMessage);
              reject(new Error(errorMessage));
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000, // Cache for 5 minutes
            }
          );
        }
      );
    } catch (error) {
      console.error("🌍 Geolocation error:", error);
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }
);

const geolocationSlice = createSlice({
  name: "geolocation",
  initialState,
  reducers: {
    clearGeolocation: (state) => {
      state.latitude = null;
      state.longitude = null;
      state.error = null;
      state.hasPermission = false;
    },
    setManualLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.hasPermission = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latitude = action.payload.latitude;
        state.longitude = action.payload.longitude;
        state.hasPermission = true;
        state.error = null;
      })
      .addCase(getCurrentLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.hasPermission = false;
      });
  },
});

export const { clearGeolocation, setManualLocation } = geolocationSlice.actions;
export const geolocationReducer = geolocationSlice.reducer;
