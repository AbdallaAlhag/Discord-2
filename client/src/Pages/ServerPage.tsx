// import { useEffect, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import { ServerSidebar, ChannelSidebar, Chat, MemberList } from "../Components";

function ServerPage() {
  const { serverId } = useParams<{ serverId: string }>();

  return (
    <div className="flex h-screen">
      <ServerSidebar />
      {serverId && <ChannelSidebar serverId={serverId} />} <Chat friendId={0} />
      <MemberList />
    </div>
  );
}
export default ServerPage;
