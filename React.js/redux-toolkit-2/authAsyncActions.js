import { createAsyncThunk } from "@reduxjs/toolkit";
import { getShortOrgApi, getUserApi } from "./authApi";

export const getUser = createAsyncThunk("auth/getUser", async () => {
  const response = await getUserApi();
  return response.data;
});

export const getShortOrg = createAsyncThunk("auth/getShortOrg", async (payload) => {
  const response = await getShortOrgApi(payload);
  return response.data;
});