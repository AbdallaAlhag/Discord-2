// import { useEffect, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import { ServerSidebar, ChannelSidebar, MemberList } from "../Components";
import ServerChat from "../Components/Server/ServerChat";
import VoiceChannelDisplay from "../WebRTC/VoiceChannelDisplay";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../AuthContext";
import ChannelWebRTC from "../WebRTC/ChannelWebRTC";
import { WebRTCProvider } from "../WebRTC/WebRTCContext";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ServerPage() {
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  const [isVoiceChannelDisplay, setIsVoiceChannelDisplay] = useState(false);
  const [socket, setSocket] = useState<Socket>({} as Socket);
  const { userId } = useAuth();
  const refVoiceChannelDisplay = useRef<HTMLDivElement>(null);
  const [voiceChannelId, setVoiceChannelId] = useState<number | null>(null);

  const handleVoiceChannelSelect = (
    channelId: SetStateAction<number | null>
  ) => {
    setVoiceChannelId(channelId);
  };

  const toggleFullScreen = () => {
    console.log("Attemping to go fullscreen");
    if (!document.fullscreenElement && refVoiceChannelDisplay.current) {
      refVoiceChannelDisplay.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  const enablePictureInPicture = async () => {
    if (refVoiceChannelDisplay.current) {
      const videoElement =
        refVoiceChannelDisplay.current.querySelector("video");
      if (videoElement && document.pictureInPictureEnabled) {
        try {
          await videoElement.requestPictureInPicture();
          setIsVoiceChannelDisplay(false);
        } catch (error) {
          console.error("Error in PiP mode:", error);
        }
      }
    }
  };

  // Add this to your ServerPage component to handle the socket connection
  useEffect(() => {
    if (!userId) return;
    // const newSocket = io("http://localhost:3000");
    const newSocket = io(`${VITE_API_BASE_URL}`, {
      query: { userId },
      transports: ["websocket"],
      autoConnect: true,
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [userId]);

  if (!socket || !userId || !serverId || !channelId) {
    return <div>Loading...</div>;
  }


  // console.log(serverId, channelId);
  return (
    <div className="flex h-screen">
      <WebRTCProvider
        socket={socket}
        channelId={voiceChannelId}
        userId={userId}
        type="video"
      >
        <ServerSidebar />
        {serverId && channelId && (
          <ChannelSidebar
            serverId={serverId}
            channelId={channelId}
            setIsVoiceChannelDisplay={setIsVoiceChannelDisplay}
            ChannelWebRTC={ChannelWebRTC}
            socket={socket}
            handleVoiceChannelSelect={handleVoiceChannelSelect}
          />
        )}
        {serverId && channelId && (
          <>
            {isVoiceChannelDisplay ? (
              // <VoiceChannelDisplay
              //   socket={socket}
              //   channelId={Number(channelId)}
              //   type={channelType}
              //   userId={userId}
              // />
              <VoiceChannelDisplay
                onToggleFullScreen={toggleFullScreen}
                onPictureInPicture={enablePictureInPicture}
                ref={refVoiceChannelDisplay}
              />
            ) : (
              <>
                <ServerChat serverId={serverId} channelId={channelId} />
                <MemberList serverId={serverId} />
              </>
            )}
          </>
        )}
      </WebRTCProvider>
    </div>
  );
}
export default ServerPage;
