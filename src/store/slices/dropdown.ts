// store/dropdownSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DropdownState {
  isOpen: boolean;
  position: { x: number; y: number } | null;
  content: React.ReactNode | null;
}

const initialState: DropdownState = {
  isOpen: false,
  position: null,
  content: null,
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    toggleOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
    openDropdownAtPosition: (
      state,
      action: PayloadAction<{ x: number; y: number; content: React.ReactNode }>,
    ) => {
      state.isOpen = true;
      state.position = { x: action.payload.x, y: action.payload.y };
      state.content = action.payload.content;
    },
    closeDropdown: (state) => {
      state.isOpen = false;
      state.position = null;
      state.content = null;
    },
    setDropdownContent: (state, action: PayloadAction<React.ReactNode>) => {
      state.content = action.payload;
    },
  },
});

export const {
  setIsOpen,
  toggleOpen,
  openDropdownAtPosition,
  closeDropdown,
  setDropdownContent,
} = dropdownSlice.actions;
export const dropdownReducer = dropdownSlice.reducer;
