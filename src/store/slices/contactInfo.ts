import { AxiosFetcher } from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../StoreProvider";

export interface ContactInfo {
  address?: {
    address?: string;
    apartmentBuilding?: string;
    areaLocation?: string;
    stateCity?: string;
    country?: string;
    pincode?: string;
    enabled?: number;
  };
  email?: string;
  phone?: string;
  alternatePhone?: string;
  storeTimings?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  // Properties used in the ContactUs components - updated to match API structure
  emailAddresses?: {
    [key: string]: string | number;
  };
  phoneNumbers?: {
    [key: string]: string | number;
  };
  // GetInTouchFields for dynamic form rendering
  getInTouchFields?: {
    email?: string;
    phone?: string;
    message?: string;
    subject?: string;
    userName?: string;
    enabled?: number;
  };
}

interface ContactState {
  contactInfo: ContactInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  contactInfo: null,
  loading: false,
  error: null,
};

export const fetchContact = createAsyncThunk(
  "contactInfo/fetchContact",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = state.geolocation;

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        "";
      if (!token) {
        console.warn("No token found for store info API call");
        return rejectWithValue("Authentication required");
      }

      // Prepare headers with geolocation if available
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      if (latitude && longitude) {
        headers["x-latitude"] = latitude.toString();
        headers["x-longitude"] = longitude.toString();
        console.log("🌍 Adding geolocation to contactInfo API headers:", {
          latitude,
          longitude,
        });
      }

      const response = await AxiosFetcher.get(`/stores/info?channelType=1`, {
        headers,
      });

      if (!response?.data?.Store) {
        console.error("Store data not found in API response", response?.data);
        return rejectWithValue("Store information not available");
      }

      return response.data?.Store;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { Message?: string } };
        message?: string;
      };
      console.error(
        "Error fetching contact info:",
        err?.response?.data || err.message
      );
      return rejectWithValue(
        err.response?.data?.Message ||
          "An error occurred while fetching contact information"
      );
    }
  }
);

const contactSlice = createSlice({
  name: "contactInfo",
  initialState,
  reducers: {
    clearContactError: (state) => {
      state.error = null;
    },
    setFallbackContactInfo: (state) => {
      // Provide fallback contact information when API fails
      state.contactInfo = {
        address: {
          address:
            "123 Main Street, Business District, New York, NY 10001, United States",
          apartmentBuilding: "123 Main Street",
          areaLocation: "Business District",
          stateCity: "New York, NY",
          country: "United States",
          pincode: "10001",
          enabled: 1,
        },
        email: "support@example.com",
        phone: "+1 (555) 123-4567",
        alternatePhone: "+1 (555) 987-6543",
        storeTimings: "Mon-Fri: 9am-6pm, Sat-Sun: 10am-4pm",
        // Updated to match the new structure
        emailAddresses: {
          "1": "support@example.com",
          "2": "info@example.com",
          enabled: 1,
        },
        phoneNumbers: {
          "1": "+1 (555) 123-4567",
          "2": "+1 (555) 987-6543",
          enabled: 1,
        },
        // Add getInTouchFields for form rendering
        getInTouchFields: {
          email: "Email Address",
          phone: "Phone Number",
          message: "Your Message",
          subject: "Subject",
          userName: "Full Name",
          enabled: 1,
        },
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contactInfo = action.payload;
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch contact information";
      });
  },
});

export const { clearContactError, setFallbackContactInfo } =
  contactSlice.actions;
export const contactReducer = contactSlice.reducer;
