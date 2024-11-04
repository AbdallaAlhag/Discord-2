// FriendsNavBar.tsx
import React, { useState } from "react";
import { Users } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/AuthContext";

type FilterType = "online" | "all" | "pending" | "blocked";

interface FriendsNavBarProps {
  currentFilter: FilterType;
  setCurrentFilter: (filter: FilterType) => void;
}

const FriendsNavBar: React.FC<FriendsNavBarProps> = ({
  currentFilter,
  setCurrentFilter,
}) => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendId, setFriendId] = useState("");
  const { userId } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const sendFriendRequest = async () => {
    console.log(friendId);
    try {
      await axios.post(`${API_URL}/friends/request`, {
        senderId: Number(userId),
        recipientId: Number(friendId),
      });
      alert("Friend request sent");
      setFriendId("");
      setShowAddFriend(false);
    } catch (err) {
      console.error("Error sending friend request", err);
    }
  };

  return (
    <div className="h-12 border-b border-[#36393f] flex items-center px-4 space-x-4">
      <Users className="w-6 h-6 text-[#dcddde]" />
      <span className="text-white font-medium">Friends</span>
      <div className="h-6 w-[1px] bg-[#36393f]" />

      <button
        className={`${
          currentFilter === "online"
            ? "text-white bg-[#42464D]"
            : "text-[#B9BBBE]"
        } hover:text-white hover:bg-[#42464D] px-2 py-1 rounded text-sm`}
        onClick={() => setCurrentFilter("online")}
      >
        Online
      </button>
      <button
        className={`${
          currentFilter === "all" ? "text-white bg-[#42464D]" : "text-[#B9BBBE]"
        } hover:text-white hover:bg-[#42464D] px-2 py-1 rounded text-sm`}
        onClick={() => setCurrentFilter("all")}
      >
        All
      </button>
      <button
        className={`${
          currentFilter === "pending"
            ? "text-white bg-[#42464D]"
            : "text-[#B9BBBE]"
        } hover:text-white hover:bg-[#42464D] px-2 py-1 rounded text-sm`}
        onClick={() => setCurrentFilter("pending")}
      >
        Pending
      </button>
      <button
        className={`${
          currentFilter === "blocked"
            ? "text-white bg-[#42464D]"
            : "text-[#B9BBBE]"
        } hover:text-white hover:bg-[#42464D] px-2 py-1 rounded text-sm`}
        onClick={() => setCurrentFilter("blocked")}
      >
        Blocked
      </button>

      <div className="ml-auto flex items-center space-x-2">
        {showAddFriend && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter Friend ID"
              value={friendId}
              onChange={(e) => setFriendId(e.target.value)}
              className="bg-[#36393f] text-white px-2 py-1 rounded text-sm"
            />
            <button
              onClick={sendFriendRequest}
              className="bg-[#248046] hover:bg-[#1a6334] text-white px-2 py-1 rounded text-sm"
            >
              Send Request
            </button>
          </div>
        )}
        <button
          className="bg-[#248046] hover:bg-[#1a6334] text-white px-2 py-1 rounded text-sm"
          onClick={() => setShowAddFriend(!showAddFriend)}
        >
          Add Friend
        </button>
      </div>
    </div>
  );
};

export default FriendsNavBar;
