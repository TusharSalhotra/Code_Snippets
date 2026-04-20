import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../rootReducer";
import { getUser } from "./authAsyncActions";

export interface AuthError {
  message: string;
}

export interface AuthState {
  isAuth: boolean;
  currentUser?: CurrentUser;
  isLoading: boolean;
  error: AuthError;
}

export interface CurrentUser {
  id: string;
  display_name: string;
  email: string;
  photo_url: string;
}
export const initialState: AuthState = {
  isAuth: false,
  isLoading: false,
  error: { message: "An Error occurred" },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    extraReducers: (builder: any) => {
      builder
        .addCase(getUser.pending, (state: AuthState) => {
          state.isLoading = true;
        })
        .addCase(
          getUser.fulfilled,
          (state: AuthState, { payload: { data } }: { payload: { data: CurrentUser } }) => {
            state.currentUser = data;
            state.isLoading = true;
          },
        )
        .addCase(getUser.rejected, (state: AuthState) => {
          state.isLoading = true;
        });
    },
  },
});

export const authSelector = (state: RootState) => state.auth;

export default authSlice.reducer;
