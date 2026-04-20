import { describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMsalAuth } from "../auth/use-msal-auth";
import { MsalProvider } from "@azure/msal-react";

const mockInstance = {
  loginRedirect: vi.fn(),
  logoutRedirect: vi.fn(),
};

vi.mock("@azure/msal-react", async () => {
  const actual = await vi.importActual<any>("@azure/msal-react");
  return {
    ...actual,
    useMsal: () => ({
      instance: mockInstance,
      accounts: [],
      inProgress: "none",
    }),
    useAccount: () => null,
  };
});

describe("useMsalAuth hook", () => {
  it("should return authentication helpers", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MsalProvider instance={{} as any}>{children}</MsalProvider>
    );

    const { result } = renderHook(() => useMsalAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    await act(async () => {
      await result.current.login();
    });
    expect(mockInstance.loginRedirect).toHaveBeenCalled();

    await act(async () => {
      await result.current.logout();
    });
    expect(mockInstance.logoutRedirect).toHaveBeenCalled();
  });
});
