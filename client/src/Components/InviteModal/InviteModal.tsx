import { useCallback, useEffect, useState } from "react";
import { X, Hash, Copy } from "lucide-react";
import { FriendItem } from "./FriendItem";
import { SearchInput } from "./SearchInput";
import axios from "axios";
import { useAuth } from "@/AuthContext";
import { Socket, io } from "socket.io-client";
import ReactDOM from "react-dom";

interface Friend {
  id: string;
  username: string;
  avatarUrl: string | null;
  memberships: {
    serverId: string;
    role: string;
  }[];
}

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  channelName: string;
  inviteLink: string;
  serverId: string;
}

interface InviteMessage {
  type: "invite";
  content: string;
  inviteData: {
    serverName: string;
    serverId: string;
    inviteCode: string;
    channelName: string;
    invitedBy: number | null;
    expiresAt: string;
  };
}

export default function InviteModal({
  isOpen,
  onClose,
  serverName,
  channelName,
  inviteLink,
  serverId,
}: InviteModalProps) {
  const [allFriends, setAllFriends] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
  const [invitedFriends, setInvitedFriends] = useState<Set<string>>(new Set());
  const [socket, setSocket] = useState<Socket | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Initialize socket connection
  useEffect(() => {
    if (!userId) return;

    const newSocket = io(API_URL, {
      query: { userId },
      transports: ["websocket"],
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId, API_URL]);


  useEffect(() => {
    setFilteredFriends(
      searchQuery
        ? allFriends.filter((friend) =>
            friend.username.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : allFriends
    );
  }, [allFriends, searchQuery]);

  const fetchFriendData = useCallback(async () => {
    if (!userId) return;
    try {
      const friendsRes = await axios.get(`${API_URL}/friends/${userId}`);
      // console.log("friendsRes: ", friendsRes.data.friends);
      const fetchedFriends: Friend[] =
        friendsRes.data.friends.length > 0 ? friendsRes.data.friends : [];
      setAllFriends(fetchedFriends);
      setFilteredFriends(fetchedFriends);
    } catch (err) {
      console.error("Error fetching friends data", err);
    }
  }, [userId, API_URL]);

  useEffect(() => {
    fetchFriendData();
  }, [fetchFriendData]);

  const generateInvite = async (friendId: string): Promise<InviteMessage> => {
    const response = await axios.post(`${API_URL}/server/invite/${serverId}`, {
      invitedUserId: friendId,
      invitedBy: userId,
    });

    return {
      type: "invite",
      content: `You've been invited to join ${serverName}!`,
      inviteData: {
        serverName,
        serverId,
        inviteCode: response.data.inviteCode,
        channelName,
        invitedBy: userId,
        expiresAt: response.data.expiresAt,
      },
    };
  };

  const handleInviteFriend = async (
    friendId: string,
    friendUsername: string
  ) => {
    if (invitedFriends.has(friendId)) {
      console.log(`Already invited ${friendUsername} to ${serverName}`);
      return;
    }

    if (!socket) {
      console.error("Socket connection not established");
      return;
    }

    try {
      const inviteMessage = await generateInvite(friendId);
      console.log("inviteMessage: ", inviteMessage);

      // Send invite through socket
      socket.emit("send_message", {
        recipientId: friendId,
        message: inviteMessage,
      });

      // Update UI
      setInvitedFriends((prev) => new Set(prev).add(friendId));

      console.log(`Invited ${friendUsername} to ${serverName}`);
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  const friendsNotInServer = filteredFriends.filter(
    (friend) =>
      !friend.memberships.some((membership) => membership.serverId == serverId)
  );

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#313338] rounded-md w-full max-w-md text-gray-200">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Invite friends to {serverName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Hash className="text-gray-400" size={20} />
            <span className="text-gray-400">{channelName}</span>
          </div>

          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for friends"
          />

          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
            {friendsNotInServer.map((friend) => (
              <FriendItem
                key={friend.id}
                name={friend.username}
                avatarUrl={friend.avatarUrl}
                onInvite={() => handleInviteFriend(friend.id, friend.username)}
              />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-400 uppercase font-semibold mb-2">
              OR, SEND A SERVER INVITE LINK TO A FRIEND
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 bg-[#1e1f22] text-gray-200 px-3 py-2 rounded focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded font-semibold flex items-center gap-2"
              >
                <Copy size={16} />
                Copy
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Your invite link expires in 7 days.{" "}
              <button className="text-blue-400 hover:underline">
                Edit invite link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
