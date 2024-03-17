import { configureStore } from "@reduxjs/toolkit";
import umlSliceReducer from "./features/UMLBoxs/UMLBoxes";
import linesSliceReducer from "./features/lines/lines";

export const store = configureStore({
  reducer: {
    uml: umlSliceReducer,
    line: linesSliceReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
