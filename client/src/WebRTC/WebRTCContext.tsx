import React, { ReactNode, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useWebRTC } from "./useWebRTC"; // Import your WebRTC hook
import { WebRTCContext } from "./WebRTCHelper"; // Import your WebRTC context

export const WebRTCProvider: React.FC<{
  socket: Socket;
  channelId: string | number;
  userId: number | null;
  type: "video" | "audio";
  children: ReactNode;
}> = ({ socket, channelId, userId, type, children }) => {
  const webRTCState = useWebRTC({ socket, channelId, userId, type });

  useEffect(() => {
    // console.log("WebRTC Provider - Params changed", {
    //   socket: !!socket,
    //   channelId,
    //   userId,
    //   type,
    // });
    console.log("updating all states");
  }, [children]);

  return (
    <WebRTCContext.Provider
      value={{ socket, channelId, userId, type, ...webRTCState }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};
