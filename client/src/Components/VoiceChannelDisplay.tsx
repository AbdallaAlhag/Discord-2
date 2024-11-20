/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";


function Header() {
  return (
    <div className="h-12 bg:transparent  flex items-center justify-between px-4 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <Volume2 className="text-white" size={20} />
        <span className="text-white font-medium">General</span>
      </div>
      <div className="flex items-center gap-4">
        <Users
          className="text-[#949ba4] hover:text-white cursor-pointer"
          size={20}
        />
        <Layout
          className="text-[#949ba4] hover:text-white cursor-pointer"
          size={20}
        />
        <MessageSquare
          className="text-[#949ba4] hover:text-white cursor-pointer"
          size={20}
        />
        <MoreHorizontal
          className="text-[#949ba4] hover:text-white cursor-pointer"
          size={20}
        />
      </div>
    </div>
  );
}


function EmptyState() {
  return (
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
}

function Controls() {
  return (
    <div className="h-20  flex items-center justify-center gap-2 px-4 py-2 transition-colors duration-300">
      <div className="flex-1" />

      <button className="p-3 rounded-full bg-[#36373d] text-[white] hover:bg-[#4e5058] hover:text-white transition-colors">
        <Video size={30} />
      </button>
      <button className="p-3 rounded-full bg-[#36373d] text-[white] hover:bg-[#4e5058] hover:text-white transition-colors">
        <ScreenShare size={30} />
      </button>
      <button className="p-3 rounded-full bg-[#36373d] text-[white] hover:bg-[#4e5058] hover:text-white transition-colors">
        <Users size={30} />
      </button>
      <button className="p-3 rounded-full bg-[#36373d] text-[white] hover:bg-[#4e5058] hover:text-white transition-colors">
        <Mic size={30} />
      </button>
      <button className="p-3 rounded-full bg-[#ed4245] text-white hover:bg-[#c03537] transition-colors">
        <PhoneOff size={30} />
      </button>
      <div className="flex-1 flex justify-end">
        <button className="p-3  text-[#949ba4]  hover:text-white transition-colors">
          <Maximize />
        </button>
        <button className="p-3  text-[#949ba4] hover:text-white transition-colors">
          <PictureInPicture />
        </button>
      </div>
    </div>
  );
}

interface VoiceChannelDisplayProps {
  socket: Socket;
  channelId: string;
  type?: "video" | "audio";
}
const VoiceChannelDisplay: React.FC<VoiceChannelDisplayProps> = ({
  socket,
  channelId,
  type = "video",
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<{ [id: string]: HTMLVideoElement }>({});
  useEffect(() => {
    if (!socket || !channelId) return;

    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: type === "video",
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    initializeMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [socket, channelId, type, localStream]);
  // console.log("localStream", localStream);
  // console.log("remoteStreams", remoteStreams);

  // const toggleMute = () => {
  //   if (localStream) {
  //     localStream.getAudioTracks().forEach((track) => {
  //       track.enabled = !track.enabled;
  //     });
  //     setIsMuted(!isMuted);
  //   }
  // };

  // const toggleVideo = () => {
  //   if (localStream) {
  //     localStream.getVideoTracks().forEach((track) => {
  //       track.enabled = !track.enabled;
  //     });
  //     setIsVideoOff(!isVideoOff);
  //   }
  // };

  // const user = {
  //   username: "Abdalla",
  //   avatarUrl:
  //     "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  // };

  return (
    <div className="h-screen flex-1 flex-col bg-[black] relative group overflow-hidden	">
      <div className="absolute top-0 left-0 right-0 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
        <Header />
      </div>
      {/* video area */}
      <div className="h-screen flex-1 flex items-center">
        <div
          className="flex-1 grid gap-4 p-4 "
          style={{
            gridTemplateColumns: `repeat(${Math.ceil(
              remoteStreams.length
                ? Math.sqrt(remoteStreams.length + 1)
                : Math.sqrt(2)
            )}, 1fr)`,
            gridAutoRows: "1fr",
          }}
        >
          {/* Local Video */}
          <div className="relative aspect-video bg-[#a28477] rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded text-white text-sm">
              You {isMuted && "(Muted)"}
            </div>
          </div>

          {/* Remote Videos */}
          {remoteStreams.map((stream, index) => (
            <div
              key={stream.id}
              className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden"
            >
              <video
                ref={(el) => {
                  if (el) {
                    el.srcObject = stream;
                    remoteVideosRef.current[stream.id] = el;
                  }
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 px-2 py-1 rounded text-white text-sm">
                Participant {index + 1}
              </div>
            </div>
          ))}
          {remoteStreams.length === 0 && <EmptyState />}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <Controls />
      </div>
    </div>
  );
};

export default VoiceChannelDisplay;
