import {
  ServerSidebar,
  FriendsNavBar,
  FriendsList,
  ActiveNow,
  FriendSidebar,
} from "../Components";
import PrivateChat from "../Components/Home/PrivateChat";
import { useState } from "react";

function HomePage() {
  const [chatId, setChatId] = useState<number | null>(null);
  const [currentFilter, setCurrentFilter] = useState<
    "online" | "all" | "pending" | "blocked"
  >("online");

  const toggleChatId = (id: number | null) => {
    setChatId(id);
  };

  return (
    <div className="flex h-screen">
      <ServerSidebar />
      {/* Pass props to friend sidebar to redirect middle section */}
      <FriendSidebar toggleChatSection={toggleChatId} />

      {/* Conditional rendering based on chatSection state */}
      {!chatId ? (
        <>
          <div className="flex-1 bg-[#36393f] flex flex-col">
            <FriendsNavBar
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
            />
            <FriendsList filter={currentFilter} />
          </div>
          <ActiveNow />
        </>
      ) : (
        <PrivateChat friendId={chatId} />
      )}
    </div>
  );
}
export default HomePage;
