// import { useEffect, useState } from "react";
// import axios from "axios";
import { ServerSidebar, ChannelSidebar, Chat, MemberList } from "../Components";

function HomePage() {
  return (
    <div className="flex h-screen">
      <ServerSidebar />
      <ChannelSidebar />
      <Chat />
      <MemberList />
    </div>
  );
}
export default HomePage;
