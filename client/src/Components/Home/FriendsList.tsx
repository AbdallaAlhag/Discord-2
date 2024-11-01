import { MessageSquare, Phone, Video, MoreVertical } from "lucide-react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../AuthContext";

interface Friend {
  id: number;
  name: string;
  status: string;
  activity: string;
}

interface FriendsListProps {
  filter: "online" | "all" | "pending" | "blocked";
}

export function FriendsList({ filter }: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<Friend[]>([]);
  const { userId } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const testFriends = useMemo(
    () => [
      {
        id: 1,
        name: "viperndgrass",
        status: "Online",
        activity: "Playing Valorant",
      },
      {
        id: 2,
        name: "Admiral Audacious",
        status: "Online",
        activity: "In Voice Channel",
      },
      {
        id: 3,
        name: "Ethanqg",
        status: "Online",
        activity: "Visual Studio Code",
      },
      { id: 4, name: "Abwbkr Alhag", status: "Online", activity: "Spotify" },
      {
        id: 5,
        name: "aotmika",
        status: "Online",
        activity: "League of Legends",
      },
      {
        id: 6,
        name: "qwertea",
        status: "Online",
        activity: "In Voice Channel",
      },
    ],
    []
  );

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userId) return;
      try {
        const [friendsRes, pendingRes, blockedRes] = await Promise.all([
          axios.get(`${API_URL}/friends/${userId}`),
          axios.get(`${API_URL}/friends/pending/${userId}`),
          axios.get(`${API_URL}/friends/blocked/${userId}`),
        ]);

        setFriends(friendsRes.data.length > 0 ? friendsRes.data : testFriends);
        setPendingRequests(pendingRes.data);
        setBlockedUsers(blockedRes.data);
      } catch (err) {
        console.log("Error fetching friends data", err);
        setFriends(testFriends);
      }
    };
    fetchFriends();
  }, [API_URL, testFriends, userId]);

  const displayedFriends = () => {
    switch (filter) {
      case "online":
        return friends.filter((f) => f.status === "Online");
      case "pending":
        return pendingRequests;
      case "blocked":
        return blockedUsers;
      case "all":
      default:
        return friends;
    }
  };

  const renderFriendCount = () => {
    switch (filter) {
      case "online":
        return `Online — ${
          friends.filter((f) => f.status === "Online").length
        }`;
      case "pending":
        return `Pending — ${pendingRequests.length}`;
      case "blocked":
        return `Blocked — ${blockedUsers.length}`;
      case "all":
        return `All Friends — ${friends.length}`;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-2">
        <h2 className="text-[#B9BBBE] text-xs font-semibold uppercase mb-2">
          {renderFriendCount()}
        </h2>
        {displayedFriends().map((friend) => (
          <div
            key={friend.id}
            className="flex items-center p-2 hover:bg-[#42464D] rounded cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#36393f] relative">
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3ba55d] rounded-full border-2 border-[#2f3136]" />
            </div>
            <div className="ml-3 flex-1">
              <div className="text-white text-sm font-medium">
                {friend.name}
              </div>
              <div className="text-[#B9BBBE] text-xs">{friend.activity}</div>
            </div>
            <div className="hidden group-hover:flex items-center space-x-3">
              <button className="w-8 h-8 rounded-full hover:bg-[#36393f] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#B9BBBE]" />
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-[#36393f] flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#B9BBBE]" />
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-[#36393f] flex items-center justify-center">
                <Video className="w-5 h-5 text-[#B9BBBE]" />
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-[#36393f] flex items-center justify-center">
                <MoreVertical className="w-5 h-5 text-[#B9BBBE]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
