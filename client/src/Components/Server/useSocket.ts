// // useSocket.ts
// import { useEffect, useMemo, useCallback } from "react";
// import { io } from "socket.io-client";
// import { useAuth } from "../../AuthContext";
// // im going to keep this socket seperate from the webRTC socket
// export function useSocket() {
//   const { userId } = useAuth();
//   const API_URL = import.meta.env.VITE_API_BASE_URL;

//   const socket = useMemo(() => {
//     if (!userId) {
//       console.warn("No user ID, cannot create socket");
//       return null;
//     }

//     const newSocket = io(API_URL, {
//       query: { userId },
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//     });

//     newSocket.on("connect", () => {
//       console.log("Chat Socket connected:", newSocket.id);
//     });

//     newSocket.on("disconnect", () => {
//       console.log("Chat Socket disconnected");
//     });

//     return newSocket;
//   }, [userId, API_URL]);

//   const joinServer = useCallback(
//     (serverId: string) => {
//       socket?.emit("join_server", serverId);
//     },
//     [socket]
//   );

//   const joinChannel = useCallback(
//     (channelId: string) => {
//       socket?.emit("join_channel", channelId);
//     },
//     [socket]
//   );

//   const leaveChannel = useCallback(
//     (channelId: string) => {
//       socket?.emit("leave_channel", channelId);
//     },
//     [socket]
//   );

//   const isSocketConnected = useCallback(() => {
//     return socket && socket.connected;
//   }, [socket]);

//   useEffect(() => {
//     return () => {
//       if (socket) {
//         console.log("disconnecting chat socket");
//         socket?.disconnect();
//       }
//     };
//   }, [socket]);

//   return { socket, joinServer, joinChannel, leaveChannel, isSocketConnected };
// }

// useSocket.ts
import { useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../AuthContext";

type UseSocketReturnType = {
  socket: Socket | null;
  joinServer: (serverId: string) => void;
  joinChannel: (channelId: string) => void;
  leaveChannel: (channelId: string) => void;
  isSocketConnected: () => boolean;
};

export function useSocket(): UseSocketReturnType {
  const { userId } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Use ref to store the socket instance and ensure it persists across renders
  const socketRef = useRef<Socket | null>(null);

  const initializeSocket = useCallback(() => {
    if (!userId || !API_URL) {
      console.warn("Cannot initialize socket: Missing userId or API_URL");
      return null;
    }

    const newSocket = io(API_URL, {
      query: { userId },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Event listeners
    newSocket.on("connect", () => {
      console.log("Chat Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Chat Socket disconnected");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    newSocket.on("reconnect_attempt", (attempt) => {
      console.log(`Reconnect attempt ${attempt}`);
    });

    return newSocket;
  }, [userId, API_URL]);

  useEffect(() => {
    // Initialize socket when userId changes
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    if (userId) {
      socketRef.current = initializeSocket();
    }

    return () => {
      if (socketRef.current) {
        console.log("Cleaning up chat socket");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, initializeSocket]);

  const joinServer = useCallback((serverId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("join_server", serverId);
    }
  }, []);

  const joinChannel = useCallback((channelId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("join_channel", channelId);
    }
  }, []);

  const leaveChannel = useCallback((channelId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("leave_channel", channelId);
    }
  }, []);

  const isSocketConnected = useCallback(() => {
    return socketRef.current ? socketRef.current.connected : false;
  }, []);

  return {
    socket: socketRef.current,
    joinServer,
    joinChannel,
    leaveChannel,
    isSocketConnected,
  };
}
