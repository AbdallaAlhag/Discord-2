// import { useEffect, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import { ServerSidebar, ChannelSidebar, MemberList } from "../Components";
import ServerChat from "../Components/Server/ServerChat";
function ServerPage() {
  const { serverId } = useParams<{ serverId: string }>();
  const { ChannelId } = useParams<{ ChannelId: string }>();
  return (
    <div className="flex h-screen">
      <ServerSidebar />
      {serverId && <ChannelSidebar serverId={serverId} />}{" "}
      <ServerChat channelId={Number(ChannelId)} />
      <MemberList />
    </div>
  );
}
export default ServerPage;
