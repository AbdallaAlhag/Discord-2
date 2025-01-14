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
  const [voiceChannelId, setVoiceChannelId] = useState<string | null>(null);
  const [openMemberList, setOpenMemberList] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleVoiceChannelSelect = (
    channelId: SetStateAction<string | null>
  ) => {
    setVoiceChannelId(channelId);
  };

  const toggleFullScreen = () => {
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
    <div className="flex h-screen ">
      <WebRTCProvider
        socket={socket}
        channelId={voiceChannelId}
        userId={userId}
        type="video"
      >
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className={`fixed top-4 left-4 z-50 p-2 bg-gray-700 rounded-md ${
              showSidebar ? "ml-10" : ""
            }`}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  showSidebar
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        )}

        <div
          className={`
        ${isMobile ? "fixed left-0 top-0 h-full z-40" : ""}
        ${isMobile && !showSidebar ? "-translate-x-full" : "translate-x-0"}
        transition-transform duration-300 ease-in-out flex
      `}
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
              isMobile={isMobile}
              setShowSidebar={setShowSidebar}
            />
          )}
        </div>

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
                <ServerChat
                  serverId={serverId}
                  channelId={channelId}
                  setOpenMemberList={setOpenMemberList}
                  openMemberList={openMemberList}
                  isMobile={isMobile}
                />
                {openMemberList && <MemberList serverId={serverId} />}
              </>
            )}
          </>
        )}

        {isMobile && showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleSidebar}
          />
        )}
      </WebRTCProvider>
    </div>
  );
}
export default ServerPage;
