// import { useEffect, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import { ServerSidebar, ChannelSidebar, MemberList } from "../Components";
import ServerChat from "../Components/Server/ServerChat";
function ServerPage() {
  const { serverId, channelId } = useParams<{
    serverId: string;
    channelId: string;
  }>();

  // console.log(serverId, channelId);
  return (
    <div className="flex h-screen">
      <ServerSidebar />
      {serverId && channelId && (
        <ChannelSidebar serverId={serverId} channelId={channelId} />
      )}{" "}
      {serverId && channelId && (
        <ServerChat serverId={serverId} channelId={channelId} />
      )}
      <MemberList />
    </div>
  );
}
export default ServerPage;
