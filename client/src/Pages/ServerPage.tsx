// import { useEffect, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import { ServerSidebar, ChannelSidebar, MemberList } from "../Components";
import ServerChat from "../Components/Server/ServerChat";
import VoiceChannelDisplay from "../WebRTC/VoiceChannelDisplay";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../AuthContext";
import WebRTCChat from "../WebRTC/WebRTCChat";
import { WebRTCProvider } from "../WebRTC/WebRTCContext";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ServerPage() {
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  const [isVoiceChannelDisplay, setIsVoiceChannelDisplay] = useState(false);
  const [socket, setSocket] = useState<Socket>({} as Socket);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [channelType, setChannelType] = useState<"audio" | "video">("video");
  const { userId } = useAuth();

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
        channelId={Number(channelId)}
        userId={userId}
        type="video"
      >
        <ServerSidebar />
        {serverId && channelId && (
          <ChannelSidebar
            serverId={serverId}
            channelId={channelId}
            setIsVoiceChannelDisplay={setIsVoiceChannelDisplay}
            WebRTCChat={WebRTCChat}
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
              <VoiceChannelDisplay />
            ) : (
              <>
                <ServerChat serverId={serverId} channelId={channelId} />
                <MemberList />
              </>
            )}
          </>
        )}
      </WebRTCProvider>
    </div>
  );
}
export default ServerPage;
