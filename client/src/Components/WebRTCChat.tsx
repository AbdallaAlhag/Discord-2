import React, { useState, useRef, useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";

interface WebRTCChatProps {
  socket: Socket;
  channelId: number;
  userId: number | null;
  type: "audio" | "video";
}

interface EnhancedRTCPeerConnection extends RTCPeerConnection {
  remoteStream?: MediaStream;
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

  const streamMetadata = new WeakMap<MediaStream, { userId: number | null }>();

  // Move createPeerConnection to useCallback to avoid dependency issues
  const createPeerConnection = useCallback((socketId: string) => {
    // Cause: If createPeerConnection is called multiple times for the same socketId, it will create duplicate connections, leading to multiple events being fired.
    // Solution: Check if a peerConnection already exists for the socketId:

    if (peerConnectionsRef.current[socketId]) {
      return peerConnectionsRef.current[socketId];
    }
    const configuration: RTCConfiguration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const peerConnection = new RTCPeerConnection(
      configuration
    ) as EnhancedRTCPeerConnection;

    peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      console.log("Received new remote stream:", remoteStream.id);
      // Multiple ontrack Triggers
      // The ontrack event might fire multiple times due to how WebRTC handles streams:
      // Each track (audio or video) results in a separate ontrack event.
      // If multiple tracks are being sent (e.g., one video and one audio track), you will see multiple triggers.

      if (streamMetadata.has(remoteStream)) return; // Avoid duplicate processing
      streamMetadata.set(remoteStream, { userId });
      peerConnection.remoteStream = remoteStream; // Store the remote stream

      // Associate metadata with the MediaStream

      setRemoteStreams((prev) => {
        // Avoid adding the same stream twice
        const streamExists = prev.some(
          (stream) => stream.id === remoteStream.id
        );
        if (!streamExists) {
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
  }, []);

  useEffect(() => {
    let currentLocalStream: MediaStream | null = null;
    const currentPeerConnections = peerConnectionsRef.current;

    const initializeWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: type === "video",
          audio: true,
        });

        setLocalStream(stream);
        currentLocalStream = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        socket.emit("join_room", channelId);

        console.log("Adding socket listener for 'user_joined'");
        socket.on("user_joined", async (data) => {
          const peerConnection = createPeerConnection(data.socketId);
          // console.log("peerConnection: ", peerConnection);
          console.log("localStream on user joining: ", currentLocalStream);
          if (currentLocalStream) {
            currentLocalStream
              .getTracks()
              .forEach((track) =>
                peerConnection.addTrack(track, currentLocalStream!)
              );
          }

          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          socket.emit("offer", {
            to: data.socketId,
            offer: offer,
          });
        });

        socket.on("offer", async (data) => {
          const peerConnection = createPeerConnection(data.from);

          if (currentLocalStream) {
            currentLocalStream
              .getTracks()
              .forEach((track) =>
                peerConnection.addTrack(track, currentLocalStream!)
              );
          }

          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit("answer", {
            to: data.from,
            answer: answer,
          });
        });

        socket.on("answer", async (data) => {
          const peerConnection = currentPeerConnections[data.from];
          if (peerConnection) {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          }
        });

        socket.on("ice_candidate", async (data) => {
          const peerConnection = currentPeerConnections[data.from];
          if (peerConnection) {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
          }
        });

        socket.on("peer_left", (data) => {
          const peerConnection = currentPeerConnections[
            data.socketId
          ] as EnhancedRTCPeerConnection;
          if (peerConnection) {
            if (peerConnection.remoteStream) {
              setRemoteStreams((prev) =>
                prev.filter((stream) => stream !== peerConnection.remoteStream)
              );
            }
            peerConnection.close();
            delete currentPeerConnections[data.socketId];
          }
        });
      } catch (error) {
        console.error("Error setting up WebRTC:", error);
      }
    };

    initializeWebRTC();

    // Cleanup function
    return () => {
      Object.values(currentPeerConnections).forEach((pc) => pc.close());
      if (currentLocalStream) {
        currentLocalStream.getTracks().forEach((track) => track.stop());
      }
      socket.emit("leave_room", channelId);

      // Clean up socket listeners
      socket.off("user_joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice_candidate");
      socket.off("peer_left");
    };
  }, []);

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
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
  };

  console.log("remote streams: ", remoteStreams);
  console.log("local stream: ", localStream);
  console.log("metadata: ", streamMetadata);
  return (
    <div className="flex flex-col h-full w-full bg-gray-900 p-4">
      {/* Video Grid Container */}
      <div className="grid gap-4 flex-grow w-full">
        {type === "video" && (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${Math.ceil(
                Math.sqrt(remoteStreams.length + 1)
              )}, 1fr)`,
            }}
          >
            {/* Local Video */}
            <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                You: {userId}
              </div>
            </div>

            {/* Remote Videos */}
            {remoteStreams.map((stream, index) => {
              const metadata = streamMetadata.get(stream); // Retrieve userId or other metadata
              // console.log("metadata: ", metadata);
              return (
                <div
                  key={stream.id}
                  className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
                >
                  <video
                    ref={(el) => {
                      if (el) {
                        el.srcObject = stream; // Set the MediaStream to the video element
                      }
                      remoteVideoRefs.current[index] = el;
                    }}
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                    Participant: {metadata?.userId || `Unknown (${index + 1})`}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Audio-only Mode */}
        {type === "audio" && (
          <div className="flex flex-wrap gap-4 p-4">
            <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">You</span>
              </div>
              <span className="text-white">
                Speaking: {!isMuted ? "Yes" : "No"}
              </span>
            </div>
            {remoteStreams.map((stream, index) => (
              <div
                key={stream.id}
                className="flex items-center space-x-2 bg-gray-800 rounded-lg p-3"
              >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{index + 1}</span>
                </div>
                <span className="text-white">Connected</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4 mt-4 p-4 bg-gray-800 rounded-lg">
        <button
          onClick={toggleMute}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white flex items-center space-x-2"
        >
          {isMuted ? (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span>Unmute</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              <span>Mute</span>
            </>
          )}
        </button>

        {type === "video" && (
          <button
            onClick={toggleVideo}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white flex items-center space-x-2"
          >
            {isVideoOff ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Turn Video On</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>Turn Video Off</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default WebRTCChat;
