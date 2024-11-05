import {
  MessageSquare,
  MoreVertical,
  Check,
  X,
} from "lucide-react";
import axios from "axios";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "@/AuthContext";
import defaultAvatar from "../../assets/default-avatar.svg";

interface Friend {
  id: number;
  username: string;
  status: string;
  activity: string;
  avatarUrl?: string;
}

interface FriendRequest {
  id: number;
  senderId: number;
  senderName: string;
  status: "pending" | "accepted" | "declined";
  timestamp: string;
}

interface FriendsListProps {
  filter: "online" | "all" | "pending" | "blocked";
}

export function FriendsList({ filter }: FriendsListProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FriendRequest[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<Friend[]>([]);
  const { userId } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const testFriends = useMemo(
    () => [
      {
        id: 1,
        username: "viperndgrass",
        status: "Online",
        activity: "Playing Valorant",
      },
      {
        id: 2,
        username: "Admiral Audacious",
        status: "Online",
        activity: "In Voice Channel",
      },
      {
        id: 3,
        username: "Ethanqg",
        status: "Online",
        activity: "Visual Studio Code",
      },
      {
        id: 4,
        username: "Abwbkr Alhag",
        status: "Online",
        activity: "Spotify",
      },
      {
        id: 5,
        username: "aotmika",
        status: "Online",
        activity: "League of Legends",
      },
      {
        id: 6,
        username: "qwertea",
        status: "Online",
        activity: "In Voice Channel",
      },
    ],
    []
  );

  // Move fetchFriendData outside of useEffect so it can be reused
  const fetchFriendData = useCallback(async () => {
    if (!userId) return;
    try {
      const [friendsRes, pendingRes, blockedRes] = await Promise.all([
        axios.get(`${API_URL}/friends/${userId}`),
        axios.get(`${API_URL}/friends/pending/${userId}`),
        axios.get(`${API_URL}/friends/blocked/${userId}`),
      ]);
      // console.log("friends: ", friendsRes.data.friends);
      // console.log('pending: ', pendingRes.data);
      setFriends(
        friendsRes.data.friends.length > 0
          ? friendsRes.data.friends
          : testFriends
      );
      setPendingRequests(pendingRes.data);
      // console.log("pending requests: ", pendingRes.data);
      setBlockedUsers(blockedRes.data);
    } catch (err) {
      console.error("Error fetching friends data", err);
      setFriends(testFriends);
    }
  }, [userId, API_URL, testFriends]);

  useEffect(() => {
    fetchFriendData();
  }, [fetchFriendData]);

  const handleFriendRequest = async (
    requestId: number,
    action: "accept" | "decline"
  ) => {
    try {
      await axios.post(`${API_URL}/friends/request/${requestId}/${action}`, {
        userId,
      });
      fetchFriendData(); // Refresh friend data after action
      alert(`Friend request ${action}ed successfully`);
    } catch (err) {
      console.error(`Error ${action}ing friend request:`, err);
      alert(`Failed to ${action} friend request`);
    }
  };

  const renderFriendList = (friendList: Friend[]) =>
    // use index at the moment because friend id is not unique
    friendList.map((friend, index) => (
      <div
        key={index}
        className="flex items-center p-2 hover:bg-[#42464D] rounded cursor-pointer group"
      >
        {/* <div className="w-8 h-8 rounded-full bg-[#36393f] relative">
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3ba55d] rounded-full border-2 border-[#2f3136]" />
        </div> */}
        <img
          src={friend.avatarUrl || defaultAvatar}
          alt={"user avatar"}
          className="w-8 h-8 rounded-full"
        />
        <div className="ml-3 flex-1">
          <div className="text-white text-sm font-medium">
            {friend.username}
          </div>
          <div className="text-[#B9BBBE] text-xs">{friend.id}</div>
        </div>
        <div className="hidden group-hover:flex items-center space-x-3">
          <button className="w-8 h-8 rounded-full hover:bg-[#36393f] flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-[#B9BBBE]" />
          </button>
          <button className="w-8 h-8 rounded-full hover:bg-[#36393f] flex items-center justify-center">
            <MoreVertical className="w-5 h-5 text-[#B9BBBE]" />
          </button>
        </div>
      </div>
    ));

  const renderPendingRequests = () =>
    pendingRequests.map((request) => (
      <div
        key={request.id}
        className="flex items-center p-2 hover:bg-[#42464D] rounded cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-full bg-[#36393f] relative">
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#faa61a] rounded-full border-2 border-[#2f3136]" />
        </div>
        <div className="ml-3 flex-1">
          <div className="text-white text-sm font-medium">
            {request.senderName}
          </div>
          <div className="text-[#B9BBBE] text-xs">Incoming Friend Request</div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleFriendRequest(request.id, "accept")}
            className="w-8 h-8 rounded-full bg-[#3ba55d] hover:bg-[#2d8049] flex items-center justify-center transition-colors"
          >
            <Check className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleFriendRequest(request.id, "decline")}
            className="w-8 h-8 rounded-full bg-[#ed4245] hover:bg-[#c93b3e] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    ));

  const renderContent = () => {
    switch (filter) {
      case "pending":
        return (
          <>
            <h2 className="text-[#B9BBBE] text-xs font-semibold uppercase mb-2">
              Pending Friend Requests — {pendingRequests.length}
            </h2>
            {renderPendingRequests()}
          </>
        );
      case "online":
        return (
          <>
            <h2 className="text-[#B9BBBE] text-xs font-semibold uppercase mb-2">
              Online — {friends.filter((f) => f.status === "Online").length}
            </h2>
            {renderFriendList(friends.filter((f) => f.status === "Online"))}
          </>
        );
      case "blocked":
        return (
          <>
            <h2 className="text-[#B9BBBE] text-xs font-semibold uppercase mb-2">
              Blocked — {blockedUsers.length}
            </h2>
            {renderFriendList(blockedUsers)}
          </>
        );
      case "all":
      default:
        return (
          <>
            <h2 className="text-[#B9BBBE] text-xs font-semibold uppercase mb-2">
              All Friends — {friends.length}
            </h2>
            {renderFriendList(friends)}
          </>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-2">{renderContent()}</div>
    </div>
  );
}
