import React, { createContext, useContext, ReactNode } from "react";
import { Socket } from "socket.io-client";
import { useWebRTC } from "./useWebRTC"; // Import your WebRTC hook

interface UseWebRTCProps {
  socket: Socket;
  channelId: string | number;
  userId: number | null;
  type: "video" | "audio";
  localStream: MediaStream | null;
  remoteStreams: MediaStream[];
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMute: () => void;
  toggleVideo: () => void;
  streamMetadata: WeakMap<MediaStream, { userId: number | null }>;
}

const WebRTCContext = createContext<UseWebRTCProps | null>(null);

export const WebRTCProvider: React.FC<{
  socket: Socket;
  channelId: string | number;
  userId: number | null;
  type: "video" | "audio";
  children: ReactNode;
}> = ({ socket, channelId, userId, type, children }) => {
  const webRTCState = useWebRTC({ socket, channelId, userId, type });

  return (
    <WebRTCContext.Provider
      value={{ socket, channelId, userId, type, ...webRTCState }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};

export const useWebRTCContext = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error("useWebRTCContext must be used within a WebRTCProvider");
  }
  return context;
};
