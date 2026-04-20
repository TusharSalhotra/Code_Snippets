import { createAsyncThunk } from "@reduxjs/toolkit";
import { endUserSessionApi, getUserApi } from "./authApi";

export const getUser = createAsyncThunk("auth/getUser", async () => {
  const response = await getUserApi();
  return response.data;
});

export const endUserSession = createAsyncThunk("auth/endUserSession", async () => {
  const response = await endUserSessionApi();
  return response.data;
});
