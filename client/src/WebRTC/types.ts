import { Socket } from "socket.io-client";

export interface UseWebRTCProps {
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
