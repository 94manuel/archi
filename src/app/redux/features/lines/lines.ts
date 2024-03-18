import { LineProps } from "@/app/component/Line";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Lines {
  value: any[];
  lineStyle: LineStyle
}
export enum LineStyle {
  Solid = "0",
  Dotted = "1, 3",
  Dashed = "5,5",
  LongDash = "10, 10",
  DashDot = "5, 5, 1, 5"
}
const initialState: Lines = {
  value: [],
  lineStyle:  LineStyle.Dashed
};

export const linesSlice = createSlice({
  name: "lines",
  initialState,
  reducers: {
    addLine: (state, action: PayloadAction<LineProps[]>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = action.payload;
    },
    changeStyle: (state, action: PayloadAction<LineStyle>) => {
      state.lineStyle = action.payload;
    },
    deleteLine: (state, action: PayloadAction<string>) => {
      console.log(state.value)
      const result = state.value.findIndex(line => line.startBoxId == action.payload);
      state.value.splice(result, 1);
      console.log(result)
    }
  },
});

// Action creators are generated for each case reducer function
export const { addLine, changeStyle, deleteLine } = linesSlice.actions;

export default linesSlice.reducer;
