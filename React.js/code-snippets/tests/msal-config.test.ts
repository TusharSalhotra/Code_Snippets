import { describe, expect, it } from "vitest";
import { msalConfig, loginRequest, protectedResources } from "../auth/msal-config";

describe("MSAL auth configuration", () => {
  it("should define auth and redirect settings", () => {
    expect(msalConfig.auth).toBeDefined();
    expect(msalConfig.auth?.clientId).toBeDefined();
    expect(msalConfig.auth?.redirectUri).toBeDefined();
    expect(msalConfig.auth?.authority).toContain("https://login.microsoftonline.com");
  });

  it("should define Graph scopes for login and protected resource", () => {
    expect(loginRequest.scopes).toContain("User.Read");
    expect(protectedResources.graphMe.scopes).toContain("User.Read");
  });
});
