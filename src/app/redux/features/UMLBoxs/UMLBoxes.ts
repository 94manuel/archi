import { UMLBoxProps } from "@/app/UMLBox.client";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Boxes {
  value: UMLBoxProps[];
}

const initialState: Boxes = {
  value: [],
};

export const umlSlice = createSlice({
  name: "uml",
  initialState,
  reducers: {
    addBoxs: (state, action: PayloadAction<UMLBoxProps[]>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
    deleteBox: (state, action: PayloadAction<string>) => {
      const result = state.value.findIndex((box) => box.id === action.payload);
      state.value.splice(result, 1);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addBoxs, deleteBox } = umlSlice.actions;

export default umlSlice.reducer;
