import IInitialData from "@/types/redux-initial-response";
import { AxiosFetcher } from "@/utils/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../StoreProvider";

// Define proper interfaces
interface Store {
  storeId: string;
  themeId: string;
  name: string;
  [key: string]: unknown;
}

interface Channel {
  id: string;
  type: number;
  [key: string]: unknown;
}

interface StoreStatus {
  isActive: boolean;
  [key: string]: unknown;
}

interface ServiceLocation {
  latitude?: number;
  longitude?: number;
  [key: string]: unknown;
}

interface PromocodeAllowed {
  allowed: boolean;
  [key: string]: unknown;
}

interface CustomLayoutSection {
  id: string;
  type: string;
  order: number;
  config: Record<string, unknown>;
  enabled: boolean;
  component: string;
}

interface CustomLayout {
  layout: {
    sections: CustomLayoutSection[];
  };
  theme: {
    spacing: {
      sectionGap: string;
      containerPadding: string;
    };
    layout: {
      maxWidth: string;
      centerContent: boolean;
    };
  };
}

const initialState: IInitialData & {
  store: Store | null;
  channel: Channel | null;
  storestatus: StoreStatus | null;
  serviceLocation: ServiceLocation | null;
  promocodeAllowed: PromocodeAllowed | null;
  customLayout: CustomLayout | null;
  announcement:
    | [
        {
          id: number;
          storeId: number;
          barName: string;
          text: string;
          barPosition: string;
          displayOnPage: string;
          backgroundColor: string;
          status: string;
          startTime: string;
          endTime: string;
          titleSize: number;
          titleColor: string;
          subHeadingSize: number;
          subHeadingColor: string;
          textAlignment: string;
          buttonEnabled: number;
          buttonColor: string;
          buttonSubTextSize: number;
          buttonSubTextColor: string;
          buttonCornerRadius: number;
          buttonLink: string;
          createdAt: string;
          updatedAt: string;
        }
      ]
    | null;
} = {
  error: null,
  store: null,
  channel: null,
  storestatus: null,
  serviceLocation: null,
  isLoading: false,
  promocodeAllowed: null,
  customLayout: null,
};

export const fetchStore = createAsyncThunk(
  "fetchStoreDetails",
  async (_, { getState }) => {
    try {
      const state = getState() as RootState;
      const { latitude, longitude } = state.geolocation;

      // Prepare headers with geolocation if available
      const headers: Record<string, string> = {};
      if (latitude && longitude) {
        headers["x-latitude"] = latitude.toString();
        headers["x-longitude"] = longitude.toString();
        console.log("🌍 Adding geolocation to store API headers:", {
          latitude,
          longitude,
        });
      }

      const response = await AxiosFetcher.get("/stores/info?channelType=1", {
        headers,
      });
      console.log("hulkinfdsadasdadsdasdo123456", response.data);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }
);

const storeSlice = createSlice({
  initialState: initialState,
  name: "storeDetails",
  reducers: {
    setInitialData: (state, action) => {
      state.store = action.payload.Store;
      state.channel = action.payload.Channel;
      state.serviceLocation = action.payload.ServiceLocation;
      state.storestatus = action.payload.StoreStatus;
      state.promocodeAllowed = action.payload.PromocodeAllowed;
      state.customLayout = action.payload.CustomLayout;
      state.announcement = action.payload.Announcement;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStore.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStore.fulfilled, (state, action) => {
        state.store = action.payload.Store;
        state.serviceLocation = action.payload.ServiceLocation;
        state.channel = action.payload.Channel;
        state.storestatus = action.payload.StoreStatus;
        state.promocodeAllowed = action.payload.PromocodeAllowed;
        state.customLayout = action.payload.CustomLayout;
        state.announcement = action.payload.Announcements;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchStore.rejected, (state, action) => {
        state.store = null;
        state.channel = null;
        state.serviceLocation = null;
        state.storestatus = null;
        state.promocodeAllowed = null;
        state.customLayout = null;
        state.announcement = null;
        state.error = action.error.message;
        state.isLoading = false;
      });
  },
});

export const { setInitialData } = storeSlice.actions;
export const storeDetailsReducer = storeSlice.reducer;
