import React, { useState } from "react";
import { Users, Menu, X } from "lucide-react";
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { userId } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const sendFriendRequest = async () => {
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

  const FilterButton = ({
    filter,
    label,
  }: {
    filter: FilterType;
    label: string;
  }) => (
    <button
      className={`${
        currentFilter === filter ? "text-white bg-[#42464D]" : "text-[#B9BBBE]"
      } hover:text-white hover:bg-[#42464D] px-2 py-1 rounded text-sm w-full sm:w-auto`}
      onClick={() => {
        setCurrentFilter(filter);
        setShowMobileMenu(false);
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="border-b border-[#36393f] shadow-md">
      {/* Main navbar */}
      <div className="h-12 flex items-center px-4 justify-between sm:justify-start sm:space-x-4">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-[#dcddde]" />
          <span className="text-white font-medium">Friends</span>
        </div>

        {/* Mobile menu button */}
        <button
          className="sm:hidden text-white"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop navigation */}
        <div className="hidden sm:flex items-center space-x-4">
          <div className="h-6 w-[1px] bg-[#36393f]" />
          <FilterButton filter="online" label="Online" />
          <FilterButton filter="all" label="All" />
          <FilterButton filter="pending" label="Pending" />
          <FilterButton filter="blocked" label="Blocked" />
        </div>

        {/* Desktop Add Friend */}
        <div className="hidden sm:flex items-center ml-auto space-x-2">
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
                className="bg-[#248046] hover:bg-[#1a6334] text-white px-2 py-1 rounded text-sm whitespace-nowrap"
              >
                Send Request
              </button>
            </div>
          )}
          <button
            className="bg-[#248046] hover:bg-[#1a6334] text-white px-2 py-1 rounded text-sm whitespace-nowrap"
            onClick={() => setShowAddFriend(!showAddFriend)}
          >
            Add Friend
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="sm:hidden px-4 py-2 space-y-2 bg-[#36393f]">
          <FilterButton filter="online" label="Online" />
          <FilterButton filter="all" label="All" />
          <FilterButton filter="pending" label="Pending" />
          <FilterButton filter="blocked" label="Blocked" />

          <div className="pt-2 space-y-2">
            {showAddFriend ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter Friend ID"
                  value={friendId}
                  onChange={(e) => setFriendId(e.target.value)}
                  className="bg-[#36393f] text-white px-2 py-1 rounded text-sm w-full"
                />
                <button
                  onClick={sendFriendRequest}
                  className="bg-[#248046] hover:bg-[#1a6334] text-white px-2 py-1 rounded text-sm w-full"
                >
                  Send Request
                </button>
              </div>
            ) : (
              <button
                className="bg-[#248046] hover:bg-[#1a6334] text-white px-2 py-1 rounded text-sm w-full"
                onClick={() => setShowAddFriend(!showAddFriend)}
              >
                Add Friend
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsNavBar;
