import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Canvas {
  zoom: boolean;
}

const initialState: Canvas = {
  zoom: false,
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    changeZoom: (state, action: PayloadAction<boolean>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.zoom = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeZoom } = canvasSlice.actions;

export default canvasSlice.reducer;
