// useSocket.ts
import { useEffect, useMemo, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../AuthContext";

export function useSocket() {
  const { userId } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const socket = useMemo(() => {
    if (!userId) return null;

    const newSocket = io(API_URL, {
      query: { userId },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return newSocket;
  }, [userId, API_URL]);

  const joinServer = useCallback(
    (serverId: string) => {
      socket?.emit("join_server", serverId);
    },
    [socket]
  );

  const joinChannel = useCallback(
    (channelId: string) => {
      socket?.emit("join_channel", channelId);
    },
    [socket]
  );

  const leaveChannel = useCallback(
    (channelId: string) => {
      socket?.emit("leave_channel", channelId);
    },
    [socket]
  );

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  return { socket, joinServer, joinChannel, leaveChannel };
}
