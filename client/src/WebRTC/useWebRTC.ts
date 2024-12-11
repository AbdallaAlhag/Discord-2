import { useState, useRef, useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";

interface UseWebRTCProps {
  socket: Socket | null;
  channelId: null | number;
  userId: number | null;
}

interface StreamMetadata {
  userId: number | null;
}

export const useWebRTC = ({ socket, channelId, userId }: UseWebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});
  const streamMetadata = useRef(new WeakMap<MediaStream, StreamMetadata>());

  // Utility function to log detailed stream information
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const logStreamDetails = (stream: MediaStream, streamType: string) => {
    if (!stream || alreadyJoined) {
      return;
    }
    console.log(`[DEBUG] ${streamType} Stream Details:`, {
      id: stream.id,
      audioTracks: stream.getAudioTracks().map((track) => ({
        id: track.id,
        enabled: track.enabled,
        muted: track.muted,
        readyState: track.readyState,
      })),
      videoTracks: stream.getVideoTracks().map((track) => ({
        id: track.id,
        enabled: track.enabled,
        muted: track.muted,
        readyState: track.readyState,
      })),
    });
  };

  // Utility function to log peer connection details
  const logPeerConnectionDetails = () => {
    // console.log(
    //   "[DEBUG] Peer Connections:",
    //   Object.entries(peerConnectionsRef.current).map(
    //     ([socketId, peerConnection]) => ({
    //       socketId,
    //       connectionState: peerConnection.connectionState,
    //       iceConnectionState: peerConnection.iceConnectionState,
    //       signalingState: peerConnection.signalingState,
    //       receivers: peerConnection.getReceivers().map((receiver) => ({
    //         track: {
    //           kind: receiver.track?.kind,
    //           id: receiver.track?.id,
    //           enabled: receiver.track?.enabled,
    //         },
    //       })),
    //       senders: peerConnection.getSenders().map((sender) => ({
    //         track: {
    //           kind: sender.track?.kind,
    //           id: sender.track?.id,
    //           enabled: sender.track?.enabled,
    //         },
    //       })),
    //     })
    //   )
    // );
  };
  const createPeerConnection = useCallback(
    (socketId: string, remoteUserId: number | null) => {
      // console.log(
      //   `[DEBUG] Creating peer connection for socketId: ${socketId}, remoteUserId: ${remoteUserId}`
      // );

      if (!socket) {
        // console.warn("[DEBUG] Cannot create peer connection: socket is null");
        return null;
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
          // console.log(
          //   `[DEBUG] ICE Candidate generated for socketId: ${socketId}`
          // );
          socket.emit("ice_candidate", {
            to: socketId,
            candidate: event.candidate,
          });
        }
      };

      peerConnection.ontrack = (event) => {
        // console.log(`[DEBUG] Remote track received for socketId: ${socketId}`);
        const remoteStream = event.streams[0];
        console.log("remoteStream:", remoteStream);
        console.log("event.streams:", event.streams);
        logStreamDetails(remoteStream, "Remote");

        setRemoteStreams((prev) => {
          // Prevent adding local stream to remote streams

          if (localStream && remoteStream.id === localStream.id) {
            // console.log(
            //   "[DEBUG] Skipping local stream addition to remote streams"
            // );
            return prev;
          }
          // Prevent duplicate streams
          // const streamExists = prev.some(
          //   (s) => s.id === remoteStream.id && streamMetadata.current.get(s)?.userId === streamMetadata.current.get(remoteStream)?.userId
          // );
          const streamExists = prev.some((s) => s.id === remoteStream.id);
          if (!streamExists) {
            // console.log(
            //   `[DEBUG] Adding new remote stream (ID: ${remoteStream.id})`
            // );
            // Store metadata using stream ID as key
            console.log("streamMetadata.current:", streamMetadata.current);
            streamMetadata.current.set(remoteStream, {
              userId: remoteUserId,
            });
            console.log("remoteStreams:", remoteStreams);
            return [...prev, remoteStream];
          }
          return prev;
        });
      };

      peerConnectionsRef.current[socketId] = peerConnection;
      return peerConnection;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const initializeMedia = async () => {
    // console.log(`[DEBUG] Initializing media for channelId: ${channelId}`);
    if (localStream || alreadyJoined) {
      // console.log(
      //   "[DEBUG] Local stream already exists, skipping initialization"
      // );
      return;
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const audioDevices = devices.filter(
        (device) => device.kind === "audioinput"
      );
      // Attempt to get user media with specific constraints
      // console.log(
      //   `[DEBUG] Available devices - Video: ${videoDevices.length}, Audio: ${audioDevices.length}`
      // );

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoDevices.length > 0,
        audio: audioDevices.length > 0,
      });
      // console.log(
      //   `[DEBUG] Local stream initialized with tracks - Audio: ${
      //     stream.getAudioTracks().length
      //   }, Video: ${stream.getVideoTracks().length}`
      // );
      logStreamDetails(stream, "New Local");
      setLocalStream(stream);
      setAlreadyJoined(true);
    } catch (error) {
      console.error("navigator.getUserMedia error", error);
    }
  };

  const disInitializeMedia = () => {
    console.log("local stream has been stopped.");
    if (localStream && socket) {
      setRemoteStreams((prevRemoteStreams) =>
        prevRemoteStreams.filter((stream) => stream.id !== localStream?.id)
      );
      const metadata = streamMetadata.current.get(localStream);
      if (metadata) {
        streamMetadata.current.delete(localStream);
      }
      setAlreadyJoined(false);
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
      socket.emit("leave_room", channelId, socket.id);
    }
    // console.log("local stream has been stopped.", localStream);
    // console.log("remote streams have been reset.", remoteStreams);
  };

  // Handle WebRTC connections
  useEffect(() => {
    // console.log(
    //   `[DEBUG] WebRTC Setup: Socket Connected: ${socket?.connected}, Channel: ${channelId}`
    // );
    if (!socket || !channelId || !localStream) {
      // console.log(
      //   `[DEBUG] WebRTC Setup: Missing socket or channelId or localStream, safely returned.`
      // );
      return;
    }

    // if (alreadyJoined) {
    //   console.log(`[DEBUG] WebRTC Setup: Already joined, safely returned.`);
    //   return;
    // }

    if (!socket || typeof socket.on !== "function") {
      console.error("Invalid socket object:", socket);
    }
    const currentLocalStream = localStream;
    let currentPeerConnections = peerConnectionsRef.current;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    socket?.on("disconnect", (reason) => {
      // console.log(`[DEBUG] Socket Disconnected - Reason: ${reason}`);
    });
    // Add connection event listeners
    socket?.on("connect", () => {
      // console.log("[DEBUG] Socket Connected Event Triggered");
    });
    // console.log(`[DEBUG] are we connected to join_room? ${socket.connected}`);
    // if (socket.connected) {

    socket.emit("join_room", channelId, localStream.id);

    socket.on("user_joined", async (data) => {
      // console.log(
      //   `[DEBUG] User Joined - SocketId: ${data.socketId}, UserId: ${data.userId}`
      // );

      try {
        const peerConnection = createPeerConnection(
          data.socketId,
          data.userId // Ensure this is always passed
        );
        if (peerConnection && currentLocalStream) {
          currentLocalStream.getTracks().forEach((track) => {
            console.log(
              "Adding track:",
              track.id,
              track.readyState,
              track.kind
            );
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
            console.log('Adding track":', track, track.readyState, track.kind);
            addTrackSafely(peerConnection, track, currentLocalStream);
          });

          const offer = new RTCSessionDescription(data.offer);
          await peerConnection.setRemoteDescription(offer);

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
        if (peerConnection) {
          const answer = new RTCSessionDescription(data.answer);
          await peerConnection.setRemoteDescription(answer);
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
      // console.log("peerConnection: ", peerConnection);
      // console.log("data.socketId: ", data.socketId);
      const metadata = streamMetadata.current.get(data.streamId);
      if (metadata) {
        streamMetadata.current.delete(data.streamId);
      }

      if (peerConnection) {
        peerConnection.close();
        delete currentPeerConnections[data.socketId];
        setRemoteStreams((prev) =>
          prev.filter((stream) => stream.id !== data.streamId)
        );
        // console.log("peer left: ", data.streamId);
      }
    });
    // }

    return () => {
      // if (socket?.connected) {
      //   socket.disconnect();
      // }
      Object.values(currentPeerConnections).forEach((pc) => pc.close());
      currentPeerConnections = {};

      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("user_joined");
        socket.off("offer");
        socket.off("answer");
        socket.off("ice_candidate");
        socket.off("peer_left");
        socket.emit("leave_room", channelId, socket.id);
      }
    };
  }, [
    socket,
    channelId,
    localStream,
    createPeerConnection,
    addTrackSafely,
    userId,
    alreadyJoined,
  ]);

  const toggleMute = useCallback(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [localStream, isMuted]);

  // mute and deafen
  const toggleDeafen = useCallback(() => {
    if (remoteStreams) {
      remoteStreams.forEach((stream) => {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !track.enabled; // Mute remote audio tracks
        });
      });
      setIsDeafened(!isDeafened);
    }

    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
      setIsMuted(true);
    }
  }, [remoteStreams, localStream, isDeafened]);

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

  // update all connected users
  const refreshStreams = () => {
    // console.log("tracks: ", localStream?.getTracks().length);
    setLocalStream((prev) => (prev ? { ...prev } : null));
    // setLocalStream((prev) => ({ ...prev }));

    setRemoteStreams((prev) => [...prev]);

    console.log("Are we connected: ", alreadyJoined);
  };
  // Add a method to log current stream state
  const logCurrentStreamState = useCallback(() => {
    console.log("[DEBUG] === Current Stream State ===");

    // Log local stream
    if (localStream) {
      console.log("[DEBUG] Local Stream active");
      logStreamDetails(localStream, "Local");
    } else {
      console.log("[DEBUG] No Local Stream");
    }

    // Log remote streams
    console.log("[DEBUG] Remote Streams:", remoteStreams.length);
    remoteStreams.forEach((stream, index) => {
      logStreamDetails(stream, `Remote Stream ${index + 1}`);
    });

    // Log peer connections
    logPeerConnectionDetails();
  }, [localStream, remoteStreams]);
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

  console.log("returning remote streams: ", remoteStreams);
  return {
    localStream,
    remoteStreams,
    isMuted,
    setIsMuted,
    isVideoOff,
    setIsVideoOff,
    isDeafened,
    setIsDeafened,
    toggleMute,
    toggleVideo,
    toggleDeafen,
    streamMetadata: streamMetadata.current,
    initializeMedia,
    disInitializeMedia,
    refreshStreams,
    logCurrentStreamState,
  };
};
