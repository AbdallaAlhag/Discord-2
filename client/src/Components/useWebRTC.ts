import { useState, useRef, useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";

interface UseWebRTCProps {
  socket: Socket | null;
  channelId: string | number;
  userId: number | null;
  type: "audio" | "video";
}

interface StreamMetadata {
  userId: number | null;
}

export const useWebRTC = ({
  socket,
  channelId,
  userId,
  // type,
}: UseWebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStates, setConnectionStates] = useState<{
    [key: string]: RTCPeerConnectionState;
  }>({});

  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});
  const streamMetadata = useRef(new WeakMap<MediaStream, StreamMetadata>());

  const createPeerConnection = useCallback(
    (socketId: string, remoteUserId: number | null) => {
      if (!socket) return null;

      // Close existing connection if it's in a closed or failed state
      if (peerConnectionsRef.current[socketId]) {
        const existingConnection = peerConnectionsRef.current[socketId];
        if (
          existingConnection.connectionState === "closed" ||
          existingConnection.connectionState === "failed"
        ) {
          existingConnection.close();
          delete peerConnectionsRef.current[socketId];
        } else {
          return existingConnection;
        }
      }

      const configuration: RTCConfiguration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };

      const peerConnection = new RTCPeerConnection(configuration);

      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit("ice_candidate", {
            to: socketId,
            candidate: event.candidate,
          });
        }
      };

      peerConnection.ontrack = (event) => {
        const remoteStream = event.streams[0];
        // console.log("Remote Stream Received:", {
        //   streamId: remoteStream.id,
        //   tracks: remoteStream.getTracks().length,
        //   userId: remoteUserId,
        // });

        setRemoteStreams((prev) => {
          const streamExists = prev.some(
            (stream) => stream.id === remoteStream.id
          );
          if (!streamExists) {
            // console.log("Adding New Remote Stream", {
            //   userId: remoteUserId,
            //   streamId: remoteStream.id,
            // });
            streamMetadata.current.set(remoteStream, { userId: remoteUserId });
            return [...prev, remoteStream];
          }
          return prev;
        });
      };

      peerConnectionsRef.current[socketId] = peerConnection;
      return peerConnection;
    },
    [socket]
  );

  const addTrackSafely = useCallback(
    async (
      peerConnection: RTCPeerConnection,
      track: MediaStreamTrack,
      stream: MediaStream
    ) => {
      try {
        if (peerConnection.connectionState === "closed") {
          throw new Error("Connection is closed");
        }
        peerConnection.addTrack(track, stream);
      } catch (error) {
        console.error("Error adding track:", error);
        // Let the calling code handle the error
        throw error;
      }
    },
    []
  );

  // Initialize media stream
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          // video: type === "video",
          // hardcode video to true for now
          // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          video: true,
          audio: true,
        });
        // console.log("Media access granted:", stream);
        setLocalStream(stream);
        return stream;
      } catch (error) {
        console.error("Error accessing media devices:", error);
        return null;
      }
    };

    initializeMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle WebRTC connections
  useEffect(() => {
    if (!socket || !channelId || !localStream) return;

    const currentLocalStream = localStream;
    const currentPeerConnections = peerConnectionsRef.current;

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    setIsConnected(socket.connected);

    if (socket.connected) {
      socket.emit("join_room", channelId);

      socket.on("user_joined", async (data) => {
        try {
          const peerConnection = createPeerConnection(
            data.socketId,
            data.userId // Ensure this is always passed
          );
          if (peerConnection && currentLocalStream) {
            currentLocalStream.getTracks().forEach((track) => {
              // Explicitly add tracks
              addTrackSafely(peerConnection, track, currentLocalStream);
            });

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit("offer", {
              to: data.socketId,
              offer: offer,
              userId: userId, // Consistently send local user ID
              fromSocketId: socket.id, // Optional: add socket context
            });
          }
        } catch (error) {
          console.error("Error handling user joined:", error);
        }
      });

      socket.on("offer", async (data) => {
        try {
          const peerConnection = createPeerConnection(data.from, data.userId); // Pass remote userId
          // console.log("soon to be our remote userid from offer: ", data.userId);

          if (peerConnection && currentLocalStream) {
            currentLocalStream.getTracks().forEach((track) => {
              // Explicitly add tracks
              addTrackSafely(peerConnection, track, currentLocalStream);
            });

            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);
            socket.emit("answer", {
              to: data.from,
              answer: answer,
              userId: userId, // Send local userId
            });
          }
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      });

      socket.on("answer", async (data) => {
        try {
          const peerConnection = currentPeerConnections[data.from];
          if (peerConnection && peerConnection.connectionState !== "closed") {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          }
        } catch (error) {
          console.error("Error handling answer:", error);
        }
      });

      socket.on("ice_candidate", async (data) => {
        try {
          const peerConnection = currentPeerConnections[data.from];
          if (peerConnection && peerConnection.connectionState !== "closed") {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
          }
        } catch (error) {
          console.error("Error handling ICE candidate:", error);
        }
      });

      socket.on("peer_left", (data) => {
        const peerConnection = currentPeerConnections[data.socketId];
        if (peerConnection) {
          setRemoteStreams((prev) =>
            prev.filter((stream) => !streamMetadata.current.has(stream))
          );
          peerConnection.close();
          delete currentPeerConnections[data.socketId];
          setConnectionStates((prev) => {
            const newStates = { ...prev };
            delete newStates[data.socketId];
            return newStates;
          });
        }
      });
    }

    return () => {
      Object.values(currentPeerConnections).forEach((pc) => pc.close());

      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("user_joined");
        socket.off("offer");
        socket.off("answer");
        socket.off("ice_candidate");
        socket.off("peer_left");
        socket.emit("leave_room", channelId);
      }
    };
  }, [
    socket,
    channelId,
    localStream,
    createPeerConnection,
    addTrackSafely,
    userId,
  ]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);

  const toggleVideo = useCallback(() => {
    const localStreamId = localStream?.id;
    const remoteStream = remoteStreams.find(
      (stream) => stream.id === localStreamId
    );
    if (remoteStream) {
      remoteStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
    }
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  }, [localStream, remoteStreams, isVideoOff]);

  return {
    localStream,
    remoteStreams,
    isMuted,
    isVideoOff,
    isConnected,
    connectionStates,
    toggleMute,
    toggleVideo,
    streamMetadata: streamMetadata.current,
  };
};
