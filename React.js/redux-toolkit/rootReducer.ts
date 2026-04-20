import { combineReducers } from "@reduxjs/toolkit";
import appSlice from "./app/appSlice";
import authSlice from "./auth/authSlice";

const rootReducer = combineReducers({
  auth: authSlice,
  app: appSlice,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
