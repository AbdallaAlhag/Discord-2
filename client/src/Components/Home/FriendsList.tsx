import { MessageSquare, MoreVertical, Check, X } from "lucide-react";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/AuthContext";
import defaultAvatar from "/default-avatar.svg";
import { Link } from "react-router-dom";
import WumpusNoFriends from "../../assets/WumpusNoFriends.png";
interface Friend {
  id: number;
  username: string;
  activity: string;
  avatarUrl?: string;
  onlineStatus?: boolean;
}

interface FriendRequest {
  avatarUrl: string;
  id: number;
  senderId: number;
  sender: {
    id: number;
    username: string;
  };
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

  const onlineStatusDependency = friends
    .map((user) => user.onlineStatus)
    .join(",");
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
      setFriends(friendsRes.data.friends || []);
      setPendingRequests(pendingRes.data);
      // console.log("pending requests: ", pendingRes.data);
      setBlockedUsers(blockedRes.data);
    } catch (err) {
      console.error("Error fetching friends data", err);
    }
  }, [userId, API_URL]);

  useEffect(() => {
    fetchFriendData();
  }, [fetchFriendData, onlineStatusDependency]);

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
    friendList.map((friend, index) => (
      <Link to={`/@me/${friend.id}`} key={index}>
        <div key={index} className="friend-item">
          <div className="w-full h-[1.5px] bg-[#3f4147] rounded-full" />
          <div className="flex items-center p-2 hover:bg-[#42464D] rounded cursor-pointer group">
            {/* <img
              src={friend.avatarUrl || defaultAvatar}
              alt={"user avatar"}
              className="w-8 h-8 rounded-full"
            /> */}
            <div className="relative w-8 h-8">
              {/* <!-- Avatar --> */}
              <img
                src={friend.avatarUrl || defaultAvatar}
                alt="user avatar"
                className="w-full h-full rounded-full"
              />
              {/* <!-- Status Indicator --> */}
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2f3136] ${
                  friend.onlineStatus ? "bg-[#23a55a]" : "bg-[#7d818b]"
                }`}
              ></div>
            </div>
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
        </div>
      </Link>
    ));

  const renderPendingRequests = () =>
    pendingRequests.map((request, index) => (
      <>
        <div
          className="w-full h-[1.5px] bg-[#3f4147] rounded-full"
          key={index + 1}
        />
        <div
          key={request.id}
          className="flex items-center p-2 hover:bg-[#42464D] rounded cursor-pointer group"
        >
          {/* <div className="w-8 h-8 rounded-full bg-[#36393f] relative">
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#faa61a] rounded-full border-2 border-[#2f3136]" />
        </div> */}
          <img
            src={request.avatarUrl || defaultAvatar}
            alt={"user avatar"}
            className="w-8 h-8 rounded-full"
          />
          <div className="ml-3 flex-1">
            <div className="text-white text-sm font-medium">
              {request.sender.username}
            </div>
            <div className="text-[#B9BBBE] text-xs">
              Incoming Friend Request
            </div>
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
      </>
    ));

  const renderContent = () => {
    switch (filter) {
      case "pending":
        return (
          <>
            <h2 className="text-[#B9BBBE] text-xs font-semibold uppercase mb-4">
              Pending Friend Requests — {pendingRequests.length}
            </h2>
            {renderPendingRequests()}
            {pendingRequests.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <img
                  src={WumpusNoFriends}
                  alt="Wumpus No Friends"
                  className="max-w-full h-auto"
                />
              </div>
            )}
          </>
        );
      case "online":
        return (
          <>
            <h2 className="text-[#B9BBBE] text-xs font-semibold uppercase mb-4">
              Online — {friends.filter((f) => f.onlineStatus === true).length}
            </h2>
            {renderFriendList(friends.filter((f) => f.onlineStatus === true))}
            {friends.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <img
                  src={WumpusNoFriends}
                  alt="Wumpus No Friends"
                  className="max-w-full h-auto"
                />
              </div>
            )}
          </>
        );
      case "blocked":
        return (
          <>
            <h2 className="text-[#B9BBBE] text-xs font-semibold uppercase mb-4">
              Blocked — {blockedUsers.length}
            </h2>
            {renderFriendList(blockedUsers)}
            {blockedUsers.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <img
                  src={WumpusNoFriends}
                  alt="Wumpus No Friends"
                  className="max-w-full h-auto"
                />
              </div>
            )}
          </>
        );
      case "all":
      default:
        return (
          <>
            <h2
              className="text-[#B9BBBE] text-xs font-semibold uppercase mb-4"
              key="all-friends-title"
            >
              All Friends — {friends.length}
            </h2>

            {renderFriendList(friends)}
            {friends.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <img
                  src={WumpusNoFriends}
                  alt="Wumpus No Friends"
                  className="max-w-full h-auto"
                />
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-2 ">{renderContent()}</div>
    </div>
  );
}
//  <div
//   className={`flex-1 overflow-y-auto ${
//     friends.length === 0 ? "bg-noise bg-center bg-auto" : ""
//   }`}
//   style={{
//     backgroundImage:
//       friends.length === 0
//         ? // ? "url('/assets/WumpusSleeping.webp')"
//           `url(${WumpusNoFriends})`
//         : "none",
//   }}
// >
//   {/* </div> */}
