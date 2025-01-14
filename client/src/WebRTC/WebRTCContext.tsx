import React, { ReactNode, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useWebRTC } from "./useWebRTC"; // Import your WebRTC hook
import { WebRTCContext } from "./WebRTCHelper"; // Import your WebRTC context

export const WebRTCProvider: React.FC<{
  socket: Socket;
  channelId: string | null;
  userId: string | null;
  type: "video" | "audio";
  children: ReactNode;
}> = ({ socket, channelId, userId, children }) => {
  const webRTCState = useWebRTC({ socket, channelId, userId });

  // const refreshStreams = webRTCState.refreshStreams;

  useEffect(() => {
    // console.log("WebRTC Provider - Params changed", {
    //   socket: !!socket,
    //   channelId,
    //   userId,
    //   type,
    // });
    console.log("updating all states");
    // refreshStreams();
  }, [children]);

  return (
    <WebRTCContext.Provider
      value={{ socket, channelId: channelId ?? '', userId, ...webRTCState }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};
