// import { useEffect, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import { ServerSidebar, ChannelSidebar, MemberList } from "../Components";
import ServerChat from "../Components/Server/ServerChat";
import VoiceChannelDisplay from "../Components/VoiceChannelDisplay";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../AuthContext";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function ServerPage() {
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  const [isVoiceChannelDisplay, setIsVoiceChannelDisplay] = useState(false);
  const [socket, setSocket] = useState<Socket>({} as Socket);
  const [channelType, setChannelType] = useState<"audio" | "video">("audio");
  const { userId } = useAuth();

  // Add this to your ServerPage component to handle the socket connection
  useEffect(() => {
    if (isVoiceChannelDisplay) {
      // const newSocket = io("http://localhost:3000");
      const newSocket = io(`${VITE_API_BASE_URL}`, {
        transports: ["websocket"],
        autoConnect: true,
      });

      setSocket(newSocket);

      return () => {
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    }
  }, [isVoiceChannelDisplay]);

  // console.log(serverId, channelId);
  return (
    <div className="flex h-screen">
      <ServerSidebar />
      {serverId && channelId && (
        <ChannelSidebar
          serverId={serverId}
          channelId={channelId}
          setIsVoiceChannelDisplay={setIsVoiceChannelDisplay}
        />
      )}{" "}
      {serverId && channelId && (
        <>
          {isVoiceChannelDisplay ? (
            <VoiceChannelDisplay
              socket={socket}
              channelId={channelId}
              type={channelType}
              userId={userId}
            />
          ) : (
            <>
              <ServerChat serverId={serverId} channelId={channelId} />
              <MemberList />
            </>
          )}
        </>
      )}
    </div>
  );
}
export default ServerPage;
