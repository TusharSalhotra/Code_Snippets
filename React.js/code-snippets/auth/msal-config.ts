import { BrowserCacheLocation, Configuration, LogLevel, PopupRequest, RedirectRequest, EndSessionRequest } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "<YOUR_CLIENT_ID>",
    authority:
      import.meta.env.VITE_AZURE_AUTHORITY || "https://login.microsoftonline.com/<TENANT_ID>",
    redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }

        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
    },
  },
};

export const loginRequest: PopupRequest | RedirectRequest = {
  scopes: ["User.Read"],
};

export const logoutRequest: EndSessionRequest = {
  postLogoutRedirectUri: window.location.origin,
};

export const protectedResources = {
  graphMe: {
    endpoint: "https://graph.microsoft.com/v1.0/me",
    scopes: ["User.Read"],
  },
};
