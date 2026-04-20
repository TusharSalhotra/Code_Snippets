import { useCallback, useEffect, useRef, useState } from "react";

export type WebSocketStatus = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

export const webSocketReadyStateMap: Record<number, WebSocketStatus> = {
  0: "CONNECTING",
  1: "OPEN",
  2: "CLOSING",
  3: "CLOSED",
};

export function useWebSocket(url: string, onMessage?: (event: MessageEvent) => void) {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WebSocketStatus>("CONNECTING");
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

  const sendMessage = useCallback((message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
    }
  }, []);

  const closeSocket = useCallback(() => {
    socketRef.current?.close();
  }, []);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => setStatus(webSocketReadyStateMap[socket.readyState]);
    socket.onclose = () => setStatus(webSocketReadyStateMap[socket.readyState]);
    socket.onerror = () => setStatus("CLOSED");
    socket.onmessage = (event) => {
      setLastMessage(event);
      onMessage?.(event);
    };

    return () => {
      socket.close();
    };
  }, [url, onMessage]);

  return {
    status,
    lastMessage,
    sendMessage,
    closeSocket,
    socket: socketRef.current,
  };
}
