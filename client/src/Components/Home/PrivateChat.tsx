import {
  Hash,
  Bell,
  Pin,
  Users,
  Search,
  Plus,
  Gift,
  ImagePlus,
  Smile,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import MessageBubble from "../MessageBubble";
import TypingIndicator from "../TypingIndicator";
import React from "react";
// interface Message {
//   user: { username: string };
//   id: number;
//   content: string;
//   senderId: number;
//   createdAt: string;
//   recipientId: number;
//   senderUsername: string;
//   recipientUsername: string;
// }

interface InviteContent {
  type: "invite";
  inviteCode: string;
  serverName: string;
  expiresAt: string; // or Date if you parse it as a Date object
  serverId: string;
}

// interface Message {
//   user: { username: string };
//   id: number;
//   content: string | InviteContent;
//   senderId: number;
//   createdAt: string;
//   recipientId: number;
//   senderUsername: string;
//   recipientUsername: string;
//   type?: "text" | "invite";
// }
interface Message {
  user?: { username: string };
  username?: string;
  id?: number;
  content: string | InviteContent;
  senderId: number;
  createdAt: string;
  recipientId: number;
  senderUsername?: string;
  recipientUsername?: string;
  type?: "text" | "invite";
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ChatProps {
  friendId: number;
}

const PrivateChat: React.FC<ChatProps> = ({ friendId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const socketRef = useRef<Socket>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Typing bubbles and read receipts
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [friendTyping, setFriendTyping] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    socketRef.current = io(VITE_API_BASE_URL, { query: { userId } });

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current?.id); // Should log connection ID
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Dynamically create the regex for matching invite URLs
  const generateInviteRegex = (baseUrl: string) => {
    const escapedBaseUrl = baseUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special regex characters
    return new RegExp(`^${escapedBaseUrl}/server/(\\d+)/(\\d+)$`);
  };

  // Parse function to extract invite details
  const parseDiscordInvite = async (content: string) => {
    const inviteRegex = generateInviteRegex(VITE_API_BASE_URL);
    // console.log("invite code: ", inviteRegex);
    const match = content.match(inviteRegex);

    if (match) {
      const serverId = match[1];
      const channelId = match[2];

      const response = await axios.post(
        `${VITE_API_BASE_URL}/server/invite/${serverId}`,
        {
          invitedUserId: friendId,
          invitedBy: userId,
        }
      );

      // console.log("testing local invite: ", response.data);
      return {
        type: "invite" as const,
        content: `You've been invited to join ${response.data.serverName}! Server Copy link: ${match}`,
        inviteData: {
          serverId: parseInt(serverId, 10),
          channelId: parseInt(channelId, 10),
          serverName: response.data.serverName,
          expiresAt: response.data.expiresAt,
          inviteCode: response.data.inviteCode,
          invitedBy: userId,
        },
      };
    }

    return null;
  };
  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${VITE_API_BASE_URL}/chat/private/messages/${userId}/${friendId}`
        );
        // console.log("messages: ", response.data);
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load message history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [userId, friendId]);
  // Mark message as read
  // Handle real-time messages
  useEffect(() => {
    if (!socketRef.current) return;

    const markAsRead = async (messageId: string) => {
      if (!socketRef.current) return;

      try {
        await axios.post(`${VITE_API_BASE_URL}/messages/${messageId}/read`);
        socketRef.current.emit("read_receipt", {
          messageId,
          readBy: userId,
          readAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Error sending read receipt:", err);
      }
    };

    // Handle incoming messages
    socketRef.current.on("private_message", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      // Send read receipt
      if (document.hasFocus()) {
        markAsRead(String(msg.id));
      }
      scrollToBottom();
    });

    socketRef.current.on("user_typing", (userId: string) => {
      if (Number(userId) === friendId) {
        setFriendTyping(true);
        setTimeout(() => setFriendTyping(false), 3000);
      }
    });

    socketRef.current.on("message_read", (messageId: string) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === Number(messageId)
            ? { ...msg, status: "read", readAt: new Date().toISOString() }
            : msg
        )
      );
    });

    // Handle error events
    socketRef.current.on("error", (error: string) => {
      setError(error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("private_message");
        // typing and read receipts
        socketRef.current.off("user_typing");
        socketRef.current.off("message_read");
        socketRef.current.off("error");
      }
    };
  }, [friendId, userId]);

  // Handle typing indication
  const handleTyping = () => {
    if (!socketRef.current) return;

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit("typing", friendId);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current?.emit("stop_typing", friendId);
    }, 2000);
  };

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() || !socketRef.current) return;

    const inviteData = await parseDiscordInvite(newMessage);
    // console.log("inviteData: ", inviteData);
    const messageData = {
      // content: newMessage,
      content: inviteData ? inviteData.content : newMessage,
      senderId: userId,
      recipientId: friendId,
      createdAt: new Date().toISOString(),
      ...(inviteData &&
        inviteData.inviteData && {
          type: "invite",
          inviteData: inviteData.inviteData,
        }),
    };

    console.log("messageData: ", messageData);
    try {
      // Send to server and save in database
      if (inviteData) {
        socketRef.current.emit("send_message", {
          recipientId: friendId,
          message: messageData,
        });
        // setMessages((prev) => [...prev, messageData]);
        setMessages((prev) => [...prev, messageData as Message]);
        setNewMessage("");
        scrollToBottom();
      }
      if (!inviteData) {
        const response = await axios.post(
          `${VITE_API_BASE_URL}/chat/private/messages`,
          messageData
        );
        // console.log("Message saved to database:", response.data); // Debug
        // Emit message through socket for real-time delivery
        socketRef.current.emit("private_message", response.data);
        // Update local state to show message immediately
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // console.log("Message: ", messages);
  return (
    <div className="flex-1 bg-[#36393f] flex flex-col">
      {/* Header */}
      <div className="h-12 px-4 flex items-center shadow-md">
        <Hash className="w-6 h-6 text-[#8e9297] mr-2" />
        <span className="text-white font-bold">Channel ID: {friendId}</span>
        <div className="ml-auto flex items-center space-x-4 text-[#b9bbbe]">
          <Bell className="w-5 h-5 cursor-pointer" />
          <Pin className="w-5 h-5 cursor-pointer" />
          <Users className="w-5 h-5 cursor-pointer" />
          <Search className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 justify-end overflow-y-auto mb-2">
        {isLoading ? (
          <div className="text-center text-[#b9bbbe]">Loading messages...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-[#b9bbbe]">No messages yet</div>
        ) : (
          // messages.map((msg) => (
          //   <MessageBubble
          //     key={msg.id || msg.id}
          //     message={msg}
          //     isOwn={msg.senderId === userId}
          //   />
          // ))
          messages.map((msg, index) => {
            const prevMsg = index > 0 && messages[index - 1];
            console.log("prevMsg: ", prevMsg);
            const isDifferentDay =
              (prevMsg &&
                new Date(prevMsg.createdAt).toDateString() !==
                  new Date(msg.createdAt).toDateString()) ||
              index === 0;

            return (
              <React.Fragment key={msg.id || index}>
                {isDifferentDay && (
                  // <div className="text-center text-[#b9bbbe] my-2">
                  //   {new Date(msg.createdAt).toDateString()}
                  // </div>
                  <div className="flex items-center my-1">
                    <hr className="w-full border-t border-[#3f4147]" />
                    <span className="text-center w-1/6 text-[#b9bbbe]">
                      {new Date(msg.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <hr className="w-full border-t border-[#3f4147]" />
                  </div>
                )}
                <MessageBubble message={msg} isOwn={msg.senderId === userId} prevMessage={prevMsg} differentDay={isDifferentDay} />
              </React.Fragment>
            );
          })
        )}

        {friendTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="h-16 flex items-center px-4 pb-6">
        <div className="flex items-center space-x-2 bg-[#202225] rounded-l-md py-2 pl-3">
          <Plus className="w-6 h-6 cursor-pointer bg-[#b5bac1] hover:text-white transition-colors rounded-sm" />
        </div>
        <input
          type="text"
          className="flex-1 bg-[#202225] text-white  px-3 py-2 focus:outline-none"
          placeholder="Type your message here..."
          value={newMessage}
          // onChange={handleInputChange}
          onChange={(e) => {
            handleInputChange(e);
            handleTyping();
          }}
          onKeyDown={handleKeyPress}
        />
        <div className="flex items-center space-x-2 bg-[#202225] rounded-r-md py-2 pr-3 mr-2">
          <Gift className="w-6 h-6 cursor-pointer bg-[#b5bac1] hover:text-white transition-colors rounded-sm" />
          <ImagePlus className="w-6 h-6 cursor-pointer bg-[#b5bac1] hover:text-white transition-colors rounded-sm" />
          <Smile className="w-6 h-6 cursor-pointer bg-[#b5bac1] hover:text-white transition-colors rounded-sm" />
        </div>
        {/* <button
          onClick={sendMessage}
          className="ml-2 bg-[#3ba55d] text-white px-4 py-2 rounded hover:bg-[#2d8049] transition-colors"
          disabled={!newMessage.trim()}
        >
          Send
        </button> */}
      </div>
    </div>
  );
};

export default PrivateChat;
