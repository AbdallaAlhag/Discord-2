import { useParams } from "react-router-dom";
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
  const { friendIdLink } = useParams<{ friendIdLink?: string }>();
  const [chatId, setChatId] = useState<number | null>(null);
  const [currentFilter, setCurrentFilter] = useState<
    "online" | "all" | "pending" | "blocked"
  >("all");

  const toggleChatId = (id: number | null) => {
    setChatId(id);
  };

  console.log("friendIdLink: ", friendIdLink);
  console.log("chatid: ", chatId);
  return (
    <div className="flex h-screen">
      <ServerSidebar />
      {/* Pass props to friend sidebar to redirect middle section */}
      <FriendSidebar toggleChatSection={toggleChatId} />

      {/* Conditional rendering based on chatSection state */}
      {!chatId && !friendIdLink ? (
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
        // <PrivateChat
        //   friendId={
        //     friendIdLink && !isNaN(parseInt(friendIdLink))
        //       ? parseInt(friendIdLink)
        //       :chatId!
        //   }
        // />
        <PrivateChat
          friendId={
            chatId! ?? 
            (friendIdLink && !isNaN(parseInt(friendIdLink))
              && (parseInt(friendIdLink)))
          }
        />
      )}
    </div>
  );
}
export default HomePage;
