import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:4000";

export function SocketIoClient() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const client = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    setSocket(client);

    client.on("connect", () => {
      setMessages((prev) => [...prev, `Connected as ${client.id}`]);
    });

    client.on("server-message", (payload: string) => {
      setMessages((prev) => [...prev, `Server: ${payload}`]);
    });

    return () => {
      client.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!socket || !inputValue.trim()) return;
    socket.emit("client-message", inputValue);
    setMessages((prev) => [...prev, `You: ${inputValue}`]);
    setInputValue("");
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <h2>Socket.IO Client Sample</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="Send event to server"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendMessage} style={{ padding: "8px 16px" }}>
          Emit
        </button>
      </div>
      <div style={{ background: "#fcfcfc", borderRadius: 8, padding: 16 }}>
        <h3>Event log</h3>
        <ul>
          {messages.map((message, idx) => (
            <li key={idx}>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
