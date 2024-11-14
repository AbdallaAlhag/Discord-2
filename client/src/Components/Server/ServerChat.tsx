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
import { useSocket } from "./useSocket";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import React from "react";

interface Message {
  user: { username: string };
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
  recipientId: number;
  senderUsername: string;
  recipientUsername: string;
}

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ChatProps {
  channelId: string;
  serverId: string;
}

const ServerChat: React.FC<ChatProps> = ({ channelId, serverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, joinServer, joinChannel, leaveChannel } = useSocket();

  // Initialize socket connection
  useEffect(() => {
    let isActive = true;

    if (socket && isActive) {
      joinServer(serverId);
      joinChannel(channelId);
    }

    return () => {
      isActive = false;
      if (socket) {
        leaveChannel(channelId);
      }
    };
  }, [serverId, channelId, socket, joinServer, joinChannel, leaveChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch message history
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${VITE_API_BASE_URL}/chat/channel/messages/${channelId}`
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
  }, [channelId]);

  // Handle real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleServerMessage = (msg: Message) => {
      if (msg.senderId !== userId) {
        setMessages((prevMessages) => [...prevMessages, msg]);
        scrollToBottom();
      }
    };

    const handleError = (error: string) => {
      setError(error);
    };

    // Handle incoming messages
    socket.on("server_message", handleServerMessage);
    socket.on("error", handleError);

    return () => {
      socket.off("server_message");
      socket.off("error");
    };
  }, [socket, userId]);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() || !socket) return;
    const messageData = {
      content: newMessage,
      userId: userId,
      channelId: channelId,
      createdAt: new Date().toISOString(),
    };

    try {
      // Send to server and save in database
      const response = await axios.post(
        `${VITE_API_BASE_URL}/chat/channel/messages`,
        messageData
      );
      // console.log("Message saved to database:", response.data); // Debug

      // Emit message through socket for real-time delivery
      socket.emit("server_message", response.data);

      // Update local state to show message immediately
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      scrollToBottom();
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

  return (
    <div className="flex-1 bg-[#36393f] flex flex-col">
      {/* Header */}
      <div className="h-12 px-4 flex items-center shadow-md">
        <Hash className="w-6 h-6 text-[#8e9297] mr-2" />
        <span className="text-white font-bold">Channel ID: {channelId}</span>
        <div className="ml-auto flex items-center space-x-4 text-[#b9bbbe]">
          <Bell className="w-5 h-5 cursor-pointer" />
          <Pin className="w-5 h-5 cursor-pointer" />
          <Users className="w-5 h-5 cursor-pointer" />
          <Search className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse">
        <div ref={messagesEndRef} style={{ height: 0 }} />
        {isLoading ? (
          <div className="text-center text-[#b9bbbe]">Loading messages...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-[#b9bbbe]">No messages yet</div>
        ) : (
          [...messages].reverse().map((msg, index) => {
            const prevMsg = index < messages.length - 1 && messages[index + 1];
            console.log([...messages].reverse());
            const isDifferentDay =
              (prevMsg &&
                new Date(prevMsg.createdAt).toDateString() !==
                  new Date(msg.createdAt).toDateString()) ||
              index === messages.length - 1;
            if (prevMsg && isDifferentDay) {
              console.log(
                new Date(prevMsg.createdAt).toDateString(),
                new Date(msg.createdAt).toDateString()
              );
            }
            return (
              <React.Fragment key={msg.id}>
                {/* {isDifferentDay && (
                  <div className="flex items-center my-1">
                    <hr className="w-full border-t border-[#3f4147]" />
                    <span className="text-center w-1/6 text-[#b9bbbe]">
                      {index}
                      {new Date(msg.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <hr className="w-full border-t border-[#3f4147]" />
                  </div>
                )} */}
                <div
                  className={`flex items-center mb-2 px-4 w-full hover:bg-[#42464D] justify-start`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#2f3136] mr-4"></div>
                  <div className={`p-2 rounded-lg max-w-[70%] `}>
                    <div className="flex items-center mb-1">
                      <span className="text-md font-semibold text-white mr-2">
                        {msg.user?.username || msg.senderUsername}
                      </span>
                      <div className="text-xs text-[#b9bbbe]">
                        {new Intl.DateTimeFormat("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }).format(new Date(msg.createdAt))}
                      </div>
                    </div>
                    <span className="text-white break-words">
                      {msg.content}
                    </span>
                  </div>
                </div>
                {isDifferentDay && (
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
              </React.Fragment>
            );
          })
        )}
        {/* <div ref={messagesEndRef} style={{ height: 0 }} /> */}
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
          onChange={handleInputChange}
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

export default ServerChat;
