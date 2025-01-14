import { Socket } from "socket.io-client";

export interface UseWebRTCProps {
  socket: Socket;
  channelId: string | null;
  userId: string | null;
  localStream: MediaStream | null;
  remoteStreams: MediaStream[];
  isDeafened: boolean;
  setIsDeafened: React.Dispatch<React.SetStateAction<boolean>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isVideoOff: boolean;
  setIsVideoOff: React.Dispatch<React.SetStateAction<boolean>>;
  toggleDeafen: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  streamMetadata: WeakMap<MediaStream, { userId: string | null }>;
  initializeMedia: () => Promise<void>;
  disInitializeMedia: () => void;
  refreshStreams: () => void;
  logCurrentStreamState: () => void;
}
