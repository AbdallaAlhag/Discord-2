import { Users, Plus } from "lucide-react";
import SettingsButton from "../Profile/SettingsButton";
import LogoutButton from "../Profile/LogoutButton";
import { useAuth } from "@/AuthContext";
import axios from "axios";
import { useState, useEffect } from "react";
import defaultAvatar from "../../assets/default-avatar.svg";

interface onlineUsers {
  id: number;
  username: string;
  avatarUrl: null | string;
  status: "online" | "offline" | "idle" | "dnd";
  isGroup?: boolean;
  memberCount?: number;
}

interface FriendSidebarProps {
  toggleChatSection: (id: number | null) => void;
}

const directMessages: onlineUsers[] = [
  { id: 1, username: "viperndgrass", avatarUrl: null, status: "online" },
  { id: 2, username: "Admiral Audacious", avatarUrl: null, status: "online" },
  { id: 3, username: "Ethanqg", avatarUrl: null, status: "offline" },
  { id: 4, username: "Abwbkr Alhag", avatarUrl: null, status: "idle" },
  {
    id: 5,
    username: "LeetCode",
    avatarUrl: null,
    status: "online",
    isGroup: true,
    memberCount: 5,
  },
  { id: 6, username: "aj", avatarUrl: null, status: "dnd" },
  { id: 7, username: "aotmika", avatarUrl: null, status: "online" },
  { id: 8, username: "SamFieri", avatarUrl: null, status: "offline" },
  { id: 9, username: "qwertea", avatarUrl: null, status: "online" },
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
  }, [API_URL, userId]);

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
          <button
            className="w-full flex items-center px-2 py-1 text-[#dcddde] hover:bg-[#42464D] rounded group"
            onClick={() => toggleChatSection(null)}
          >
            <Users className="w-5 h-5 mr-4" />
            <span className="text-sm">Friends</span>
          </button>
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
                className="w-full flex items-center px-2 py-1 text-[#96989d] hover:text-[#dcddde] hover:bg-[#42464D] rounded group"
                onClick={() => toggleChatSection(dm.id)} // Use user ID to toggle chat room
              >
                {/* <div className="w-8 h-8 rounded-full bg-[#36393f] flex items-center justify-center relative mr-3">
                  <span>{dm.avatar}</span>
                  <StatusIndicator status={dm.status} />
                </div> */}
                <img
                  src={dm.avatarUrl || defaultAvatar}
                  alt="user avatar"
                  className="w-8 h-8 rounded-full mr-3"
                />
                <span className="text-sm flex-1 text-left truncate">
                  {dm.username}
                  {dm.isGroup && (
                    <span className="text-xs text-[#96989d] ml-1">
                      ({dm.memberCount})
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-14 bg-[#292b2f] px-2 flex items-center mt-auto">
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
        <LogoutButton className="pr-4 pt-1" />
        <SettingsButton />
      </div>
    </div>
  );
}
