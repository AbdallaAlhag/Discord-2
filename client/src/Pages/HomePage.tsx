import { useParams } from "react-router-dom";
import {
  ServerSidebar,
  FriendsNavBar,
  FriendsList,
  ActiveNow,
  FriendSidebar,
} from "../Components";
import PrivateChat from "../Components/Home/PrivateChat";
import { useState, useEffect } from "react";

function HomePage() {
  const { friendIdLink } = useParams<{ friendIdLink?: string }>();
  const [chatId, setChatId] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<
    "online" | "all" | "pending" | "blocked"
  >("all");
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleChatId = (id: string | null) => {
    setChatId(id);
    if (isMobile) {
      setShowSidebar(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="flex h-screen">
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={`fixed top-4 left-4 z-50 p-2 bg-gray-700 rounded-md ${
            showSidebar ? "ml-10" : ""
          }`}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={
                showSidebar ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      )}
      <div
        className={`
        ${isMobile ? "fixed left-0 top-0 h-full z-40" : ""}
        ${isMobile && !showSidebar ? "-translate-x-full" : "translate-x-0"}
        transition-transform duration-300 ease-in-out flex
      `}
      >
        <ServerSidebar />
        {/* Pass props to friend sidebar to redirect middle section */}
        <FriendSidebar toggleChatSection={toggleChatId} />
      </div>

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
            (friendIdLink &&
              !isNaN(parseInt(friendIdLink)) &&
              parseInt(friendIdLink))
          }
          isMobile={isMobile}
        />
      )}

      {isMobile && showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
}

export default HomePage;
