import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Lines {
  value: any[];
  lineStyle: string
}

const initialState: Lines = {
  value: [],
  lineStyle:"dotted"
};

export const linesSlice = createSlice({
  name: "lines",
  initialState,
  reducers: {
    addLine: (state, action: PayloadAction<any[]>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
    changeStyle: (state, action: PayloadAction<string>) => {
      state.lineStyle = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { addLine, changeStyle} = linesSlice.actions;

export default linesSlice.reducer;
