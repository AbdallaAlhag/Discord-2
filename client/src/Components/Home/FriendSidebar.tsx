import { Users, Plus } from "lucide-react";
import SettingsButton from "../Profile/SettingsButton";
import { useAuth } from "@/AuthContext";
import axios from "axios";
import { useState, useEffect } from "react";
import defaultAvatar from "../../assets/default-avatar.svg";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faHeadphones } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Import required CSS
interface onlineUsers {
  id: number;
  username: string;
  avatarUrl: null | string;
  onlineStatus: boolean;
}

interface FriendSidebarProps {
  toggleChatSection: (id: number | null) => void;
}

const directMessages: onlineUsers[] = [
  { id: 1, username: "viperndgrass", avatarUrl: null, onlineStatus: true },
  { id: 2, username: "Admiral Audacious", avatarUrl: null, onlineStatus: true },
  { id: 3, username: "Ethanqg", avatarUrl: null, onlineStatus: false },
  { id: 4, username: "Abwbkr Alhag", avatarUrl: null, onlineStatus: false },
  {
    id: 5,
    username: "LeetCode",
    avatarUrl: null,
    onlineStatus: true,
  },
  { id: 6, username: "aj", avatarUrl: null, onlineStatus: false },
  { id: 7, username: "aotmika", avatarUrl: null, onlineStatus: true },
  { id: 8, username: "SamFieri", avatarUrl: null, onlineStatus: false },
  { id: 9, username: "qwertea", avatarUrl: null, onlineStatus: true },
];

// function StatusIndicator({ status }: { status: onlineUsers["status"] }) {
//   const statusColors = {
//     online: "bg-[#3ba55d]",
//     offline: "bg-[#747f8d]",
//     idle: "bg-[#faa81a]",
//     dnd: "bg-[#ed4245]",
//   };

//   return (
//     <div
//       className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-[#2f3136]`}
//     />
//   );
// }

export default function FriendSidebar({
  toggleChatSection,
}: FriendSidebarProps) {
  const [friends, setFriends] = useState<onlineUsers[]>([]);
  const [user, setUser] = useState<onlineUsers | null>(null);
  const { userId } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const [activeTab, setActiveTab] = useState<"Friends" | number>("Friends");

  const onlineStatusDependency = friends
    .map((user) => user.onlineStatus)
    .join(",");
  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${API_URL}/friends/${userId}`);
        // console.log("friends list: ", response.data.friends);
        setFriends(
          response.data.friends.length > 0
            ? response.data.friends
            : directMessages
        );
      } catch (err) {
        console.error("Error fetching friends ", err);
        setFriends(directMessages);
      }
    };

    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        setUser(response.data.user);
        // console.log("user: ", response.data.user);
      } catch (err) {
        console.error("Error fetching user ", err);
      }
    };
    fetchFriends();
    fetchUser();
  }, [API_URL, userId, onlineStatusDependency]);

  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      <div className="h-12 shadow-md flex items-center px-4">
        <input
          type="text"
          placeholder="Find or start a conversation"
          className="w-full bg-[#202225] text-[#dcddde] text-sm rounded px-2 py-1 focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pt-4">
        <div className="px-2">
          <Link to="/">
            <button
              className={`w-full flex items-center px-2 py-2 text-[#dcddde] hover:bg-[#42464D] rounded group ${
                activeTab === "Friends"
                  ? "bg-[#42464D] text-white"
                  : "text-gray-300 hover:bg-[#42464D] hover:text-white"
              }`}
              onClick={() => {
                setActiveTab("Friends");
                toggleChatSection(null);
              }}
            >
              <Users className="w-5 h-5 mr-4" />
              <span className="text-lg font-semibold">Friends</span>
            </button>
          </Link>
        </div>

        <div className="px-2 pt-4">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="text-[#96989d] uppercase font-semibold">
              Direct Messages
            </span>
            <Plus className="w-4 h-4 text-[#96989d] hover:text-[#dcddde] cursor-pointer" />
          </div>

          <div className="mt-2 space-y-0.5">
            {friends.map((dm) => (
              <button
                key={dm.id}
                className={`w-full flex items-center px-2 py-1 text-[#96989d] hover:text-[#dcddde] hover:bg-[#42464D] rounded group ${
                  activeTab === dm.id
                    ? "bg-[#42464D] text-white"
                    : "text-gray-300 hover:bg-[#42464D] hover:text-white"
                }`}
                onClick={() => {
                  setActiveTab(dm.id);
                  toggleChatSection(dm.id);
                }} // Use user ID to toggle chat room
              >
                {/* <div className="w-8 h-8 rounded-full bg-[#36393f] flex items-center justify-center relative mr-3">
                  <span>{dm.avatar}</span>
                  <StatusIndicator status={dm.status} />
                </div> */}
                {/* <img
                  src={dm.avatarUrl || defaultAvatar}
                  alt="user avatar"
                  className="w-8 h-8 rounded-full mr-3"
                /> */}
                <div className="relative w-8 h-8 mr-3">
                  {/* <!-- Avatar --> */}
                  <img
                    src={dm.avatarUrl || defaultAvatar}
                    alt="user avatar"
                    className="w-full h-full rounded-full"
                  />
                  {/* <!-- Status Indicator --> */}
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2f3136] ${
                      dm.onlineStatus ? "bg-[#23a55a]" : "bg-[#7d818b]"
                    }`}
                  ></div>
                </div>
                <span className="text-sm flex-1 text-left truncate">
                  {dm.username}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-14 bg-[#232428] px-2 flex items-center mt-auto gap-1">
        <img
          src={user?.avatarUrl || defaultAvatar}
          className="w-8 h-8 rounded-full mr-2"
          alt="User Avatar"
        />
        {/* <div className="w-8 h-8 rounded-full bg-[#36393f] mr-2 relative">
          <StatusIndicator status="online" />
        </div> */}
        <div className="flex-1">
          <div className="text-white text-sm font-medium">{user?.username}</div>
          <div className="text-[#b9bbbe] text-xs">#{user?.id}</div>
        </div>
        <FontAwesomeIcon
          icon={faMicrophone}
          size="lg"
          className="p-2 hover:bg-[#383a40] cursor-pointer rounded-sm"
          style={{ color: "#959ba7" }}
          data-tooltip-id={`tooltip-mic`}
          data-tooltip-content={"Turn on Microphone"}
        />
        <Tooltip
          id="tooltip-mic"
          place="top"
          className="z-10 "
          style={{
            backgroundColor: "black",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        />
        <FontAwesomeIcon
          icon={faHeadphones}
          size="lg"
          className="p-2 hover:bg-[#383a40]  cursor-pointer rounded-sm"
          style={{ color: "#959ba7" }}
          data-tooltip-id={`tooltip-headphones`}
          data-tooltip-content={"Deafen"}
        />
        <Tooltip
          id="tooltip-headphones"
          place="top"
          className="z-10 "
          style={{
            backgroundColor: "black",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            borderRadius: "4px",
          }}
        />

        <div
          className="hover:bg-[#383a40] rounded-sm"
          data-tooltip-id={`tooltip-settings`}
          data-tooltip-content={"User Settings"}
        >
          <SettingsButton className="hover:animate-spin  p-2 " />
          <Tooltip
            id="tooltip-settings"
            place="top"
            className="z-10 "
            style={{
              backgroundColor: "black",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
