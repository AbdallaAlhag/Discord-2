import { useContext } from "react";
import { WebRTCContext } from "./WebRTCHelper";

export const useWebRTCContext = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error("useWebRTCContext must be used within a WebRTCProvider");
  }
  return context;
};
