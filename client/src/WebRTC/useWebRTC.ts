import { useState, useRef, useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";

interface UseWebRTCProps {
  socket: Socket | null;
  channelId: string | number;
  userId: number | null;
  type?: "audio" | "video";
}

interface StreamMetadata {
  userId: number | null;
}

export const useWebRTC = ({
  socket,
  channelId,
  userId,
}: // type = "video",
// type,
UseWebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});
  const streamMetadata = useRef(new WeakMap<MediaStream, StreamMetadata>());

  const createPeerConnection = useCallback(
    (socketId: string, remoteUserId: number | null) => {
      if (!socket) return null;

      // Close existing connection if it exists
      if (peerConnectionsRef.current[socketId]) {
        const existingConnection = peerConnectionsRef.current[socketId];
        existingConnection.close();
        delete peerConnectionsRef.current[socketId];
      }

      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          // Consider adding TURN servers for better connectivity
        ],
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
        // console.log("Ontrack triggered", {
        //   streamId: remoteStream.id,
        //   isLocalStream: localStream && remoteStream.id === localStream.id,
        //   localStreamId: localStream?.id,
        // });
        setRemoteStreams((prev) => {
          // Prevent adding local stream to remote streams
          if (localStream && remoteStream.id === localStream.id) {
            return prev;
          }
          // Prevent duplicate streams
          const streamExists = prev.some((s) => s.id === remoteStream.id);
          if (!streamExists) {
            // Store metadata using stream ID as key
            streamMetadata.current.set(remoteStream, {
              userId: remoteUserId,
            });
            return [...prev, remoteStream];
          }
          return prev;
        });
      };

      peerConnectionsRef.current[socketId] = peerConnection;
      return peerConnection;
    },
    [localStream, socket]
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
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );
        console.log("devices: ", devices);
        // Attempt to get user media with specific constraints
        const stream = await navigator.mediaDevices.getUserMedia({
          video: videoDevices.length > 0,
          audio: audioDevices.length > 0,
        });

        // const stream = await navigator.mediaDevices.getUserMedia({
        //   // video: type === "video",
        //   video: true,
        //   audio: true,
        // });
        // console.log("stream: ", stream);
        setLocalStream(stream);
      } catch (error) {
        console.error("navigator.getUserMedia error", error);
      }
    };

    initializeMedia();

    return () => {
      localStream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle WebRTC connections
  useEffect(() => {
    if (!socket || !channelId || !localStream) return;

    if (!socket || typeof socket.on !== "function") {
      console.error("Invalid socket object:", socket);
    }
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
            prev.filter((stream) => stream.id !== data.socketId)
          );
          peerConnection.close();
          delete currentPeerConnections[data.socketId];
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


  // console.log("checking remote stream before returning: ", remoteStreams);
  // console.log("checking local stream before returning: ", localStream);
  // console.log("Remote Streams Debug:", {
  //   streamCount: remoteStreams.length,
  //   streams: remoteStreams.map((stream) => ({
  //     id: stream.id,
  //     audioTracks: stream.getAudioTracks().length,
  //     videoTracks: stream.getVideoTracks().length,
  //   })),
  // });

  return {
    localStream,
    remoteStreams,
    isMuted,
    isVideoOff,
    isConnected,
    toggleMute,
    toggleVideo,
    streamMetadata: streamMetadata.current,
  };
};
