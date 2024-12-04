import React, { useRef, useEffect } from "react";
import { useWebRTCContext } from "./useWebRTCContext";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { Video, HeadphoneOff } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ChannelWebRTC: React.FC = () => {
  const {
    userId,
    localStream,
    remoteStreams,
    isMuted,
    isVideoOff,
    isDeafened,
    streamMetadata,
    initializeMedia,
    logCurrentStreamState,
  } = useWebRTCContext();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Debug: log initial states
  useEffect(() => {
    console.log("Initializing media and logging stream state...");
    initializeMedia();
    logCurrentStreamState();

    if (localStream && localVideoRef.current) {
      console.log("Setting local stream to video element");
      localVideoRef.current.srcObject = localStream;
    } else {
      console.warn("Local stream or video element not found");
    }
  }, [initializeMedia, localStream, logCurrentStreamState]);

  useEffect(() => {
    // Debug: log incoming remote streams and metadata
    console.log("Updating remote streams...");
    console.log("Current remote streams:", remoteStreams);
    console.log("Stream metadata:", streamMetadata);

    const filteredRemoteStreams = remoteStreams.filter(
      (stream) => streamMetadata.get(stream)?.userId !== userId
    );

    // Debug: log the number of filtered remote streams
    console.log("Filtered remote streams:", filteredRemoteStreams.length);

    if (filteredRemoteStreams.length > remoteVideoRefs.current.length) {
      console.log(
        `Expanding remote video refs: ${filteredRemoteStreams.length} streams`
      );
      remoteVideoRefs.current = [
        ...remoteVideoRefs.current.slice(0, filteredRemoteStreams.length), // Keep refs for existing streams
        ...new Array(
          filteredRemoteStreams.length - remoteVideoRefs.current.length
        ).fill(null), // Add placeholders for new streams
      ];
    }

    // Debug: log the state of remoteVideoRefs after update
    console.log("Remote video refs updated:", remoteVideoRefs.current);

    filteredRemoteStreams.forEach((stream, index) => {
      if (remoteVideoRefs.current[index]) {
        console.log(`Assigning stream to video element at index ${index}`);
        remoteVideoRefs.current[index].srcObject = stream;
      }
    });
  }, [localStream, remoteStreams, userId, streamMetadata]);

  return (
    <div className="flex flex-col h-full w-full pl-10">
      {/* local user and remote users should show up */}
      <div className="flex items-center rounded-lg px-1 hover:bg-[#404249] ">
        <div className="w-5 h-5 rounded-full bg-gray-800 pl-2 mr-1"></div>
        <div className="p-2 rounded-lg w-full">
          <div className="flex items-center  justify-between">
            <span className="text-sm font-semibold text-[#8e9297] mr-2">
              You
            </span>
            <div className="flex items-center gap-2">
              {isMuted && (
                <FontAwesomeIcon
                  icon={faMicrophoneSlash}
                  className="w-4 h-4 text-[#8e9297]"
                />
              )}
              {isDeafened && (
                <HeadphoneOff className="w-4 h-4 text-[#8e9297]" />
              )}
              {!isVideoOff && <Video className="w-5 h-5 text-[#8e9297]" />}
            </div>
          </div>
        </div>
      </div>
      {/* remote users */}
      <div className="flex flex-col flex-grow w-full">
        {remoteStreams.map((stream, index) => {
          const streamUser = streamMetadata.get(stream)?.userId;
          return (
            <div
              key={index}
              className="flex items-center rounded-lg px-1 hover:bg-[#404249] "
            >
              <div className="w-5 h-5 rounded-full bg-gray-800 pl-2 mr-1"></div>
              <div className="p-2 rounded-lg max-w-[70%]">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-[#8e9297] mr-2">
                    {streamUser ? `User ${streamUser}` : "Unknown User"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

{
  /* Video Grid Container */
}
{
  /* <div className="grid gap-4 flex-grow w-full">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.ceil(
              Math.sqrt(remoteStreams.length + 1)
            )}, 1fr)`,
          }}
        > */
}
{
  /* Local Video */
}
{
  /* <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="w-full h-full object-cover"
              onError={(e) => console.error("Error loading video stream:", e)}
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
              You: {userId}
            </div>
          </div> */
}

{
  /* Remote Videos */
}
{
  /* {remoteStreams.map((stream, index) => {
            const metadata = streamMetadata.get(stream);

            return (
              <div
                key={stream.id}
                className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
              >
                <video
                  ref={(el) => {
                    if (el && el.srcObject !== stream) {
                      el.srcObject = stream;
                    }
                    remoteVideoRefs.current[index] = el;
                  }}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
                  Participant: {metadata?.userId ?? `Unknown (${index + 1})`}
                </div>
              </div>
            );
          })}
        </div> */
}

{
  /* Audio-only Mode */
}
{
  /* {type === "audio" && (
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
        )} */
}
{
  /* </div> */
}

{
  /* Controls */
}
{
  /* <div className="flex justify-center space-x-4 mt-4 p-4 bg-gray-800 rounded-lg">
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
      </div> */
}

export default ChannelWebRTC;
