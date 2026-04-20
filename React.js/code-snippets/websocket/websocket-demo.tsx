import { useMemo, useState } from "react";
import { useWebSocket } from "./use-websocket";

const ECHO_SERVER_URL = "wss://echo.websocket.events";

export function WebSocketDemo() {
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const { status, lastMessage, sendMessage, closeSocket } = useWebSocket(
    ECHO_SERVER_URL,
    (event) => {
      setHistory((prev) => [...prev, `Received: ${event.data}`]);
    },
  );

  const connectionStatus = useMemo(() => status.toLowerCase(), [status]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setHistory((prev) => [...prev, `Sent: ${inputValue}`]);
    setInputValue("");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
      <h2>WebSocket Demo</h2>
      <p>Status: <strong>{connectionStatus}</strong></p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Enter a message"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={handleSend} style={{ padding: "8px 16px" }}>
          Send
        </button>
      </div>
      <button onClick={closeSocket} style={{ marginBottom: 16, padding: "8px 16px" }}>
        Close Connection
      </button>
      <div style={{ background: "#f8f8f8", borderRadius: 8, padding: 16 }}>
        <h3>Message history</h3>
        {history.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          <ul>
            {history.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        {lastMessage && <p>Last message: {lastMessage.data}</p>}
      </div>
    </div>
  );
}
