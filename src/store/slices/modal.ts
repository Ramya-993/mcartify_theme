import { createSlice } from "@reduxjs/toolkit";

export const popModal = createSlice({
  name: "popmodal",
  initialState: {
    isOpened: false,
    modalData: {
      content: "",
      headerShown: false,
      footerShown: false,
      onPrimaryButtonClick: () => {},
      onSecondaryButtonClick: () => {},
      heading: "Warning!",
      primaryActionName: "OK",
      secondaryActionName: "Cancel",
      width: "md:max-w-2xl",
    },
  },
  reducers: {
    togglePopModal: (state, action) => {
      state.isOpened = action.payload;
    },
    updatePopModalData: (state, action) => {
      state.modalData = { ...state.modalData, ...action.payload };
    },
  },
});

export const { togglePopModal, updatePopModalData } = popModal.actions;
export const popModalReducer = popModal.reducer;
