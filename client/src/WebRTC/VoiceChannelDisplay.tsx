import { useEffect, useRef } from "react";
import {
  Volume2,
  Users,
  Layout,
  MoreHorizontal,
  MessageSquare,
  Mic,
  Video,
  PhoneOff,
  Maximize,
  PictureInPicture,
  ScreenShare,
} from "lucide-react";
// import { useWebRTC } from "./useWebRTC";
import { useWebRTCContext } from "./useWebRTCContext";

// Types
// interface VoiceChannelDisplayProps {
//   socket: Socket;
//   channelId: number;
//   type?: "video" | "audio";
//   userId: number | null;
// }

interface StreamMetadata {
  userId: number;
}

// Header Component
const Header = () => (
  <div className="h-12 bg-transparent flex items-center justify-between px-4 transition-colors duration-300">
    <div className="flex items-center gap-2">
      <Volume2 className="text-white" size={20} />
      <span className="text-white font-medium">General</span>
    </div>
    <div className="flex items-center gap-4">
      {[Users, Layout, MessageSquare, MoreHorizontal].map((Icon, index) => (
        <Icon
          key={index}
          className="text-[#949ba4] hover:text-white cursor-pointer"
          size={20}
        />
      ))}
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="flex-1 bg-[#2b2d31] flex items-center justify-center rounded-lg">
    <div className="text-center">
      <h2 className="text-white text-xl font-medium mb-2">
        You're the only one here. Invite a friend to start chatting.
      </h2>
      <p className="text-[#949ba4] mb-6">
        Choose an Activity to play, watch, or collaborate together.
      </p>
      <div className="flex gap-4 justify-center">
        <button className="bg-[#4e5058] text-white px-4 py-2 rounded-md hover:bg-[#6d6f78] transition-colors">
          Invite Friends
        </button>
        <button className="bg-[#5865f2] text-white px-4 py-2 rounded-md hover:bg-[#4752c4] transition-colors">
          Choose an Activity
        </button>
      </div>
    </div>
  </div>
);

// Controls Component
const Controls = () => {
  const controlButtons = [
    { Icon: Video, color: "white" },
    { Icon: ScreenShare, color: "white" },
    { Icon: Users, color: "white" },
    { Icon: Mic, color: "white" },
    { Icon: PhoneOff, color: "white", special: true },
  ];

  return (
    <div className="h-20 flex items-center justify-center gap-2 px-4 py-2 transition-colors duration-300">
      <div className="flex-1" />

      {controlButtons.map(({ Icon, special }, index) => (
        <button
          key={index}
          className={`p-3 rounded-full ${
            special
              ? "bg-[#ed4245] text-white hover:bg-[#c03537]"
              : "bg-[#36373d] text-white hover:bg-[#4e5058]"
          } transition-colors`}
        >
          <Icon size={30} />
        </button>
      ))}

      <div className="flex-1 flex justify-end">
        {[Maximize, PictureInPicture].map((Icon, index) => (
          <button
            key={index}
            className="p-3 text-[#949ba4] hover:text-white transition-colors"
          >
            <Icon />
          </button>
        ))}
      </div>
    </div>
  );
};

// Video Component
const VideoElement: React.FC<{
  stream: MediaStream;
  userId?: number | null;
  muted?: boolean;
  isLocal?: boolean;
}> = ({ stream, userId, muted = false, isLocal = false }) => (
  <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
    <video
      ref={(el) => {
        if (el && el.srcObject !== stream) {
          el.srcObject = stream;
        }
      }}
      autoPlay
      playsInline
      muted={muted}
      className="w-full h-full object-cover"
    />
    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-sm">
      {isLocal ? `You: ${userId}` : `Participant: ${userId ?? "Unknown"}`}
    </div>
  </div>
);

// interface VoiceChannelDisplayProps {
//   socket: Socket;
//   channelId: number;
//   userId: number | null;
//   type?: "video" | "audio";
//   localStream: MediaStream | null;
//   remoteStreams: MediaStream[];
//   streamMetadata: WeakMap<MediaStream, { userId: number | null }>;
// }

// Main Component
const VoiceChannelDisplay: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const {
    // socket,
    // channelId,
    // type = "video",
    userId,
    localStream,
    remoteStreams,
    streamMetadata,
  } = useWebRTCContext();

  

  // const { localStream, remoteStreams, streamMetadata } = useWebRTC({
  //   socket,
  //   channelId,
  //   userId,
  //   type,
  // });
  // Effect to handle local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Effect to handle remote streams
  useEffect(() => {
    if (remoteStreams.length > 0) {
      // Update remote video refs
      remoteVideoRefs.current = remoteStreams.map(
        (_, index) => remoteVideoRefs.current[index] || null
      );

      // Set source objects for remote streams
      remoteStreams.forEach((stream, index) => {
        const videoElement = remoteVideoRefs.current[index];
        if (videoElement && stream) {
          videoElement.srcObject = stream;
        }
      });
    }
  }, [remoteStreams]);

  // console.log("checking remote stream: ", remoteStreams);

  // useEffect(() => {
  //   if (localStream && localVideoRef.current) {
  //     localVideoRef.current.srcObject = localStream;
  //   }
  //   // remoteStreams.forEach((remoteStream, index) => {
  //   //   if (remoteVideoRefs.current[index]) {
  //   //     console.log("", remoteStream);
  //   //     remoteVideoRefs.current[index]!.srcObject = remoteStream;
  //   //   }
  //   // });

  //   // console.log("checking remote null stream: ", remoteVideoRefs.current);

  //   const filteredRemoteStreams = remoteStreams.filter(
  //     (stream) => streamMetadata.get(stream)?.userId !== userId
  //   );

  //   if (filteredRemoteStreams.length > remoteVideoRefs.current.length) {
  //     remoteVideoRefs.current = [
  //       ...remoteVideoRefs.current.slice(0, filteredRemoteStreams.length), // Keep refs for existing streams
  //       ...new Array(
  //         filteredRemoteStreams.length - remoteVideoRefs.current.length
  //       ).fill(null), // Add placeholders for new streams
  //     ];
  //   }
  // }, [localStream, remoteStreams, streamMetadata, userId]);

  const gridColumns = Math.ceil(
    Math.sqrt(remoteStreams.length ? remoteStreams.length + 1 : 2)
  );

  return (
    <div className="h-screen flex-1 flex-col bg-black relative group overflow-hidden">
      <div className="absolute top-0 left-0 right-0 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
        <Header />
      </div>

      <div className="h-screen flex-1 flex items-center">
        <div
          className="flex-1 grid gap-4 p-4"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
            gridAutoRows: "1fr",
          }}
        >
          {localStream && (
            <VideoElement
              stream={localStream}
              userId={userId}
              muted={true}
              isLocal={true}
            />
          )}

          {remoteStreams.map((stream) => {
            const metadata = streamMetadata.get(stream) as StreamMetadata;
            return (
              <VideoElement
                key={stream.id}
                stream={stream}
                userId={metadata?.userId}
              />
            );
          })}

          {remoteVideoRefs.current.length == 0 && <EmptyState />}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <Controls />
      </div>
    </div>
  );
};

export default VoiceChannelDisplay;
