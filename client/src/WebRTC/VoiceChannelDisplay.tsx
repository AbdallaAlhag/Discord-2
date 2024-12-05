import { useEffect, useRef, forwardRef, LegacyRef } from "react";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import {
  Volume2,
  Users,
  Layout,
  MoreHorizontal,
  Mic,
  MicOff,
  Video,
  PhoneOff,
  Maximize,
  PictureInPicture,
  ScreenShare,
  HeadphoneOff,
  VideoOff,
} from "lucide-react";
// import { useWebRTC } from "./useWebRTC";
import { useWebRTCContext } from "./useWebRTCContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
      {[Users, Layout, MoreHorizontal].map((Icon, index) => (
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
        {/* <button className="bg-[#5865f2] text-white px-4 py-2 rounded-md hover:bg-[#4752c4] transition-colors">
          Choose an Activity
        </button> */}
      </div>
    </div>
  </div>
);

interface ControlButtonProps {
  onToggleFullScreen: () => void;
  onPictureInPicture: () => void;
}
// Controls Component
const Controls: React.FC<ControlButtonProps> = ({
  onToggleFullScreen,
  onPictureInPicture,
}) => {
  const {
    isVideoOff,
    setIsVideoOff,
    isMuted,
    setIsMuted,
    disInitializeMedia,
    toggleMute,
    toggleVideo,
  } = useWebRTCContext();
  const controlButtons = [
    {
      Icon: !isVideoOff ? Video : VideoOff,
      BgColor: !isVideoOff ? "#ffffff" : "#36373d",
      textColor: !isVideoOff ? "#000000" : "#ffffff",
      onClick: () => {
        toggleVideo();
        setIsVideoOff(!isVideoOff);
      },
    },
    {
      Icon: ScreenShare,
      BgColor: "#36373d",
      onClick: () => {},
    },
    {
      Icon: !isMuted ? Mic : MicOff,
      BgColor: !isMuted ? "#ffffff" : "#36373d",
      textColor: !isMuted ? "#000000" : "#ffffff",
      onClick: () => {
        toggleMute();
        setIsMuted(!isMuted);
      },
    },
    {
      Icon: PhoneOff,
      BgColor: "#ed4245",
      onClick: () => {
        disInitializeMedia();
        window.location.reload();
      },
    },
  ];

  const screenButtons = [
    {
      Icon: Maximize,
      onClick: () => onToggleFullScreen(),
    },
    {
      Icon: PictureInPicture,
      onClick: () => onPictureInPicture(),
    },
  ];
  return (
    <div className="h-20 flex items-center justify-center gap-2 px-4 py-2 transition-colors duration-300">
      <div className="flex-1" />
      {controlButtons.map(({ Icon, onClick, BgColor, textColor }, index) => (
        <button
          key={index}
          style={{
            backgroundColor: BgColor,
            color: textColor || "#ffffff",
          }}
          className="rounded-full p-3 hover:opacity-80 transition-opacity"
          onClick={onClick}
        >
          <Icon size={30} />
        </button>
      ))}

      <div className="flex-1 flex justify-end">
        {screenButtons.map(({ Icon, onClick }, index) => (
          <button
            key={index}
            className="p-3 text-[#949ba4] hover:text-white transition-colors"
            onClick={onClick}
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
  isDeafened?: boolean;
  isMuted?: boolean;
}> = ({
  stream,
  userId,
  muted = false,
  isLocal = false,
  isDeafened,
  isMuted,
}) => (
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

    {isMuted && !isDeafened && (
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded-full text-[#959ba7] text-sm">
        <FontAwesomeIcon icon={faMicrophoneSlash} />
      </div>
    )}
    {isDeafened && (
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 px-2 py-1 rounded-full text-[#959ba7] text-sm">
        <HeadphoneOff size={20} />
      </div>
    )}
  </div>
);

interface VoiceChannelDisplayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  ref: LegacyRef<HTMLDivElement> | undefined;
  onToggleFullScreen: () => void;
  onPictureInPicture: () => void;
}
// Main Component
const VoiceChannelDisplay: React.FC<VoiceChannelDisplayProps> = forwardRef<
  HTMLDivElement,
  VoiceChannelDisplayProps
>(({ onToggleFullScreen, onPictureInPicture, ...props }, ref) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const {
    userId,
    localStream,
    remoteStreams,
    streamMetadata,
    isMuted,
    isDeafened,
    // initializeMedia,
    // logCurrentStreamState,
  } = useWebRTCContext();

  // console.log("Checking remote stream in voice channel: ", remoteStreams);

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

  const gridColumns = Math.ceil(
    Math.sqrt(remoteStreams.length ? remoteStreams.length + 1 : 2)
  );

  return (
    <div
      ref={ref}
      {...props}
      className="h-screen flex-1 flex-col bg-black relative group overflow-hidden"
    >
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
              isDeafened={isDeafened}
              isMuted={isMuted}
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

          {remoteVideoRefs.current.length == 0 && localStream && <EmptyState />}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <Controls
          onToggleFullScreen={onToggleFullScreen}
          onPictureInPicture={onPictureInPicture}
        />
      </div>
    </div>
  );
});

export default VoiceChannelDisplay;
