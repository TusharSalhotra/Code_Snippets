import { describe, expect, it } from "vitest";
import { webSocketReadyStateMap } from "../websocket/use-websocket";

describe("WebSocket sample helpers", () => {
  it("should map ready state values to status strings", () => {
    expect(webSocketReadyStateMap[0]).toBe("CONNECTING");
    expect(webSocketReadyStateMap[1]).toBe("OPEN");
    expect(webSocketReadyStateMap[2]).toBe("CLOSING");
    expect(webSocketReadyStateMap[3]).toBe("CLOSED");
  });
});
