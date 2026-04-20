import { useMemo } from "react";
import { useAccount, useMsal } from "@azure/msal-react";
import { loginRequest, logoutRequest } from "./msal-config";

export function useMsalAuth() {
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || null);
  const isAuthenticated = accounts.length > 0;

  const login = async () => {
    if (!isAuthenticated) {
      return instance.loginRedirect(loginRequest);
    }

    return Promise.resolve();
  };

  const logout = async () => instance.logoutRedirect(logoutRequest);

  return useMemo(
    () => ({
      account,
      activeAccount: account,
      isAuthenticated,
      inProgress,
      login,
      logout,
      instance,
    }),
    [account, inProgress, instance, isAuthenticated],
  );
}
