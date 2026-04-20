import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MsalAuthProvider } from "./msal-auth-provider";
import { PrivateMsalRoute } from "./private-msal-route";

function LoginPage() {
  return <div>Login page placeholder. Use msal loginRedirect or loginPopup here.</div>;
}

function DashboardPage() {
  return <div>Protected dashboard placeholder.</div>;
}

export function MsalAppShell() {
  return (
    <MsalAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateMsalRoute />}>
            <Route path="/" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MsalAuthProvider>
  );
}
