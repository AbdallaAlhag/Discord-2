// import { useEffect, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import { ServerSidebar, ChannelSidebar, MemberList } from "../Components";
import ServerChat from "../Components/Server/ServerChat";
import VoiceChannelDisplay from "../Components/VoiceChannelDisplay";
import { useState } from "react";
function ServerPage() {
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();
  const [isVoiceChannelDisplay, setIsVoiceChannelDisplay] = useState(false);

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
            <VoiceChannelDisplay />
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
