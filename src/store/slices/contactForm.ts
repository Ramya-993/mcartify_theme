import { AxiosFetcher } from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../StoreProvider";

export interface FormField {
  type: string;
  label: string;
  options: string[] | null;
  fieldId: number;
  required: number;
  sortOrder: number;
  validation: {
    maxLength?: number;
    minLength?: number;
    email?: boolean;
    min?: number;
    max?: number;
  };
  conditional: any;
  placeholder: string;
}

export interface ContactForm {
  formId: number;
  name: string;
  description: string;
  settings: {
    successMessage: string;
    submitButtonText: string;
  };
  formFields: FormField[];
}

export interface ContactFormResponse {
  Status: number;
  ContactForm: ContactForm;
  IsDynamicForm: number;
}

interface ContactFormState {
  contactForm: ContactForm | null;
  loading: boolean;
  error: string | null;
  isDynamicForm: boolean;
}

const initialState: ContactFormState = {
  contactForm: null,
  loading: false,
  error: null,
  isDynamicForm: false,
};

export const fetchContactForm = createAsyncThunk(
  "contactForm/fetchContactForm",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = state.geolocation;

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("guest_token") ||
        "";
      if (!token) {
        console.warn("No token found for contact form API call");
        return rejectWithValue("Authentication required");
      }

      // Prepare headers with geolocation if available
      const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      if (latitude && longitude) {
        headers["x-latitude"] = latitude.toString();
        headers["x-longitude"] = longitude.toString();
        console.log("🌍 Adding geolocation to contactForm API headers:", {
          latitude,
          longitude,
        });
      }

      const response = await AxiosFetcher.get(`/stores/contactUs`, {
        headers,
      });

      if (!response?.data) {
        console.error(
          "Contact form data not found in API response",
          response?.data
        );
        return rejectWithValue("Contact form information not available");
      }

      return response.data as ContactFormResponse;
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { Message?: string } };
        message?: string;
      };
      console.error(
        "Error fetching contact form:",
        err?.response?.data || err.message
      );
      return rejectWithValue(
        err.response?.data?.Message ||
          "An error occurred while fetching contact form information"
      );
    }
  }
);

const contactFormSlice = createSlice({
  name: "contactForm",
  initialState,
  reducers: {
    clearContactFormError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactForm.fulfilled, (state, action) => {
        state.loading = false;
        state.contactForm = action.payload.ContactForm;
        state.isDynamicForm = action.payload.IsDynamicForm === 1;
      })
      .addCase(fetchContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Failed to fetch contact form information";
      });
  },
});

export const { clearContactFormError } = contactFormSlice.actions;
export const contactFormReducer = contactFormSlice.reducer;
