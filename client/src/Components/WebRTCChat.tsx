import React, { useState, useRef, useEffect } from "react";
import { Socket } from "socket.io-client";

interface WebRTCChatProps {
  socket: Socket;
  channelId: number;
  userId: number | null;
  type: "audio" | "video";
}

const WebRTCChat: React.FC<WebRTCChatProps> = ({
  socket,
  channelId,
  userId,
  type,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const peerConnectionsRef = useRef<{ [key: string]: RTCPeerConnection }>({});

  useEffect(() => {
    // Initialize media stream and WebRTC connection
    const initializeWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: type === "video",
          audio: true,
        });
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Join the room
        socket.emit("join_room", channelId);

        // Setup socket listeners for WebRTC signaling
        socket.on("user_joined", async (data) => {
          const peerConnection = createPeerConnection(data.socketId);

          // Add local stream tracks to peer connection
          stream
            .getTracks()
            .forEach((track) => peerConnection.addTrack(track, stream));

          // Create and send offer
          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socket.emit("offer", {
            to: data.socketId,
            offer: offer,
          });
        });

        socket.on("offer", async (data) => {
          const peerConnection = createPeerConnection(data.from);

          // Add local stream tracks to peer connection
          stream
            .getTracks()
            .forEach((track) => peerConnection.addTrack(track, stream));

          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );

          // Create and send answer
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit("answer", {
            to: data.from,
            answer: answer,
          });
        });

        socket.on("answer", async (data) => {
          const peerConnection = peerConnectionsRef.current[data.from];
          if (peerConnection) {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          }
        });

        socket.on("ice_candidate", async (data) => {
          const peerConnection = peerConnectionsRef.current[data.from];
          if (peerConnection) {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
          }
        });

        socket.on("peer_left", (data) => {
          // Clean up peer connection
          const peerConnection = peerConnectionsRef.current[data.socketId];
          if (peerConnection) {
            peerConnection.close();
            delete peerConnectionsRef.current[data.socketId];

            setRemoteStreams((prev) =>
              prev.filter((stream) => stream !== peerConnection.remoteStream)
            );
          }
        });
      } catch (error) {
        console.error("Error setting up WebRTC:", error);
      }
    };

    initializeWebRTC();

    // Cleanup on component unmount
    return () => {
      // Close all peer connections
      Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());

      // Stop local stream tracks
      localStream?.getTracks().forEach((track) => track.stop());

      // Leave the room
      socket.emit("leave_room", channelId);
    };
  }, [socket, channelId, type]);

  const createPeerConnection = (socketId: string) => {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add TURN servers here for better connectivity
      ],
    };

    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStreams((prev) => {
        // Prevent duplicate streams
        if (!prev.includes(remoteStream)) {
          return [...prev, remoteStream];
        }
        return prev;
      });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice_candidate", {
          to: socketId,
          candidate: event.candidate,
        });
      }
    };

    peerConnectionsRef.current[socketId] = peerConnection;
    return peerConnection;
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = isVideoOff;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="webrtc-container">
      {/* Local Video/Audio */}
      <video
        ref={localVideoRef}
        autoPlay
        muted
        className={`local-stream ${type === "audio" ? "hidden" : ""}`}
      />

      {/* Remote Streams */}
      {remoteStreams.map((stream, index) => (
        <video
          key={index}
          ref={(el) => (remoteVideoRefs.current[index] = el)}
          srcObject={stream}
          autoPlay
          className={`remote-stream ${type === "audio" ? "hidden" : ""}`}
        />
      ))}

      {/* Controls */}
      <div className="controls">
        <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
        {type === "video" && (
          <button onClick={toggleVideo}>
            {isVideoOff ? "Turn Video On" : "Turn Video Off"}
          </button>
        )}
      </div>
    </div>
  );
};

export default WebRTCChat;
