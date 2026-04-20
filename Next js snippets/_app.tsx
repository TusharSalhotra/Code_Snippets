import { CacheProvider, EmotionCache } from "@emotion/react";
import { Box, Stack } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { Theme, ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { SnackbarProvider } from "notistack";
import React, { ReactElement, ReactNode, useMemo } from "react";
import { FirebaseAppProvider } from "reactfire";
import { SWRConfig } from "swr";
import { Header } from "~/components/Header";
import { ReactFireWrapper } from "~/components/ReactFireWrapper";
import { SidebarNav } from "~/components/SidebarNav";
import { NetworkState } from "~/components/auth/NetworkState";
import { createEmotionCache } from "~/lib/browser-util";
import { config as firebaseConfig } from "~/lib/firebase";
import { localStorageProvider } from "~/lib/swr";
import { basePalette, themeWithOverrides } from "../theme";
import { Amplitude } from "~/components/global/Amplitude";

const DynamicGlobalAlerts = dynamic(() => import("~/components/GlobalAlerts"), {
  ssr: false,
});

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

declare module "@mui/styles/defaultTheme" {
  interface DefaultTheme extends Theme {}
}

const globalStyles = (
  <GlobalStyles
    styles={(theme) => ({
      a: { color: theme.palette.primary.main },
    })}
  />
);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
};

export default function MyApp(props: AppPropsWithLayout): React.ReactElement {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [primaryColor, setPrimaryColor] = React.useState<string>();
  const getLayout = Component.getLayout || ((page) => page);
  const main = primaryColor || basePalette().primary.main;
  const themeOverrides = {
    palette: {
      primary: {
        main,
      },
    },
  };

  console.count("App");
  console.log("App", {
    pdfjsVersion: process.env.pdfjsVersion,
    main,
    themeOverrides,
    primaryColor,
    basePalette,
  });

  // use useMemo to ensure the theme is not recalculated on every render which
  // would cause the entire app to re-render
  const t = useMemo(
    () => {
      console.count("App recompute themeWithOverrides");
      return themeWithOverrides(themeOverrides);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [main]
  );

  // elements rendered here will persist across client-side navigation events
  return (
    <CacheProvider value={emotionCache}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <Amplitude />
        <ReactFireWrapper>
          <ThemeProvider theme={t}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SnackbarProvider />
              <SWRConfig value={{ provider: localStorageProvider }}>
                <CssBaseline enableColorScheme />
                {globalStyles}

                <NetworkState setPrimaryColor={setPrimaryColor} />
                <DynamicGlobalAlerts />

                {/* minHeight: 100vh is required to prevent the sidebar from
                  vertically shrinking between page loads
                  */}
                <Stack direction="row" sx={{ minHeight: "100vh" }}>
                  <SidebarNav />
                  <Box
                    id="content-wrapper"
                    sx={{
                      flexGrow: 1,
                    }}
                  >
                    <Header />
                    <Head>
                      {/* https://mui.com/material-ui/getting-started/usage/ */}
                      <meta
                        name="viewport"
                        content="initial-scale=1, width=device-width"
                      />
                    </Head>
                    <Box sx={{ mx: 0 }} id="component-wrapper">
                      {/* pages can optionally define a getLayout function. if
                        they don't it's a no-op */}
                      {getLayout(<Component {...pageProps} />)}
                    </Box>
                  </Box>
                </Stack>
              </SWRConfig>
            </LocalizationProvider>
          </ThemeProvider>
        </ReactFireWrapper>
      </FirebaseAppProvider>
    </CacheProvider>
  );
}