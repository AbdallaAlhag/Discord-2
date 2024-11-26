import  { createContext } from "react";
import { UseWebRTCProps } from "./types";

export const WebRTCContext = createContext<UseWebRTCProps | null>(null);
