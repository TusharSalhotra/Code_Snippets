import React from "react";
import { MsalProvider, PublicClientApplication } from "@azure/msal-react";
import { msalConfig } from "./msal-config";

const msalInstance = new PublicClientApplication(msalConfig);

export function MsalAuthProvider(props: React.PropsWithChildren) {
  return <MsalProvider instance={msalInstance}>{props.children}</MsalProvider>;
}
