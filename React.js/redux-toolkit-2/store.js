import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../auth/authSlice";
import appSlice from "./slices/appSlice";

const reducers = combineReducers({
  auth: authReducer,
  app: appSlice,
});

export const store = configureStore({
  reducer: reducers,
});