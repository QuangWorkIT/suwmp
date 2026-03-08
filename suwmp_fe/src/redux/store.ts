import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./features/userSlice"
import assignedTaskReducer from "./features/assignedTaskSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    assignedTask: assignedTaskReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispath = typeof store.dispatch;
