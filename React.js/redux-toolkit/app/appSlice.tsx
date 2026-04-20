import { createSlice } from "@reduxjs/toolkit";
import i18n from "locale/i18n";
import { RootState } from "../rootReducer";

export interface AppState {
  isSideNav: boolean;
  activeLanguage: string;
}

export const initialState: AppState = {
  isSideNav: true,
  activeLanguage: "en",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setActiveLanguage: (state, lang: any) => {
      i18n.changeLanguage(lang?.payload);
      return {
        ...state,
        activeLanguage: lang?.payload,
      };
    },

    openSideNav: (state: AppState) => {
      return {
        ...state,
        isSideNav: true,
      };
    },
    closeSideNav: (state: AppState) => {
      return {
        ...state,
        isSideNav: false,
      };
    },

    toggleSideNav: (state) => {
      return {
        ...state,
        isSideNav: !state.isSideNav,
      };
    },
  },
});

export const { openSideNav, closeSideNav, toggleSideNav, setActiveLanguage } = appSlice.actions;

export const authSelector = (state: RootState) => state.auth;

export default appSlice.reducer;
