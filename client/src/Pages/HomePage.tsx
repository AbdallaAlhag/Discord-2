import {
  ServerSidebar,
  FriendsNavBar,
  FriendsList,
  ActiveNow,
  FriendSidebar,
  Chat,
} from "../Components";
import { useState } from "react";
function HomePage() {
  const [chatSection, setChatSection] = useState<number | null>(null);
  const toggleChatSection = (id: number | null) => {
    if (!id) {
      setChatSection(null);
    } else {
      setChatSection(id);
    }
  };

  return (
    <div className="flex h-screen">
      <ServerSidebar />
      {/* pass props to friend sidebar to redirect middle section */}
      <FriendSidebar toggleChatSection={toggleChatSection} />
      {!chatSection ? (
        <>
          <div className="flex-1 bg-[#36393f] flex flex-col">
            <FriendsNavBar />
            <FriendsList />
          </div>
          <ActiveNow />
        </>
      ) : (
        <Chat />
      )}
    </div>
  );
}

export default HomePage;
