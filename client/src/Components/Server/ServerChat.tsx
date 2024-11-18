import {
  Hash,
  Bell,
  Pin,
  Users,
  Search,
  Plus,
  ImagePlay,
  ImagePlus,
  Smile,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "./useSocket";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import React from "react";
import { GifPicker } from "../TenorComponent/Components/GifPicker";
import { MediaData, MediaType } from "../TenorComponent/Types/tenor";

interface Message {
  user: { username: string; avatarUrl: string };
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

interface MediaItem {
  url: string;
}

const ServerChat: React.FC<ChatProps> = ({ channelId, serverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, joinServer, joinChannel, leaveChannel } = useSocket();

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [SelectedMedia, setSelectedMedia] = useState<MediaData | null>(null);
  const [activeTab, setActiveTab] = useState<MediaType>("GIFs");
  const gifPickerRef = useRef<HTMLDivElement | null>(null);

  const handleMediaSelect = (media: MediaData) => {
    setSelectedMedia(media);
    setIsMediaPickerOpen(false);
  };
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
        // console.log("fetched messages: ", response.data);
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
      console.log("response data: ", response.data);
      // Update local state to show message immediately
      setMessages((prev) => [...prev, response.data]);
      console.log("overall messages: ", messages);
      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };
  // send Media
  const sendMedia = useCallback(
    async (media: MediaItem) => {
      if (!media?.url || !socket) return;

      const messageData = {
        content: media.url,
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
    },
    [socket, userId, channelId]
  );

  // send selected media through gifpicker
  useEffect(() => {
    if (SelectedMedia) {
      sendMedia(SelectedMedia);
      setSelectedMedia(null);
    }
  }, [SelectedMedia, sendMedia]);
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

  const isGifUrl = (url: string): boolean => {
    // Check if the string ends with .gif
    const isGif = url.toLowerCase().endsWith(".gif");
    // Check if it's a valid URL
    try {
      new URL(url);
      return isGif;
    } catch {
      return false;
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
      {/* Maybe make this an independent component */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse mb-2">
        <div ref={messagesEndRef} style={{ height: 0 }} />
        {isLoading ? (
          <div className="text-center text-[#b9bbbe]">Loading messages...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-[#b9bbbe]">No messages yet</div>
        ) : (
          [...messages].reverse().map((msg, index) => {
            const prevMsg =
              index > 0 ? [...messages].reverse()[index - 1] : null;
            const nextMsg =
              index < messages.length - 1
                ? [...messages].reverse()[index + 1]
                : null;

            const isDifferentDay =
              !prevMsg ||
              new Date(prevMsg.createdAt).toDateString() !==
                new Date(msg.createdAt).toDateString();

            const timeInterval =
              prevMsg &&
              Math.abs(
                new Date(prevMsg.createdAt).getTime() -
                  new Date(msg.createdAt).getTime()
              ) >
                5 * 60 * 1000;

            const isNewGroup =
              !nextMsg ||
              nextMsg.user?.username !== msg.user?.username ||
              timeInterval ||
              isDifferentDay;

            const isLastInGroup =
              !prevMsg || prevMsg.user?.username !== msg.user?.username;

            return (
              <React.Fragment key={msg.id}>
                <div
                  className={`flex items-center px-4 w-full hover:bg-[#42464D] ${
                    isLastInGroup ? "mb-4" : "mb-0.5"
                  }`}
                >
                  {isNewGroup ? (
                    <img
                      src={msg.user?.avatarUrl}
                      alt="user avatar"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                  ) : (
                    <div className="w-10 h-0 mr-4"></div>
                  )}
                  <div>
                    {isNewGroup && (
                      <div className="flex items-center mb-0 text-center">
                        <span className="text-md font-semibold text-white mr-2">
                          {msg.user?.username}
                        </span>
                        <span className="text-xs text-[#b9bbbe]">
                          {new Intl.DateTimeFormat("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(msg.createdAt))}
                        </span>
                      </div>
                    )}
                    {isGifUrl(msg.content) ? (
                      <div className="max-w-sm mb-1">
                        <img
                          src={msg.content}
                          alt="GIF"
                          className="rounded-lg max-w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <span className="text-white break-words">
                        {msg.content}
                      </span>
                    )}
                  </div>
                </div>
                {isDifferentDay && (
                  <div className="flex items-center my-1">
                    <hr className="w-full border-t border-[#3f4147]" />
                    <span className="text-center w-1/5 text-[#b9bbbe]">
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
          <ImagePlay
            className="w-6 h-6 cursor-pointer bg-[#b5bac1] hover:text-white transition-colors rounded-sm"
            onClick={() => {
              setIsMediaPickerOpen((prev) => !prev);
              setActiveTab("GIFs");
            }}
          />
          <ImagePlus
            className="w-6 h-6 cursor-pointer bg-[#b5bac1] hover:text-white transition-colors rounded-sm"
            onClick={() => {
              setIsMediaPickerOpen((prev) => !prev);
              setActiveTab("Stickers");
            }}
          />
          <Smile
            className="w-6 h-6 cursor-pointer bg-[#b5bac1] hover:text-white transition-colors rounded-sm"
            onClick={() => {
              setIsMediaPickerOpen((prev) => !prev);
              setActiveTab("Emoji");
            }}
          />
        </div>
        {/* <button
          onClick={sendMessage}
          className="ml-2 bg-[#3ba55d] text-white px-4 py-2 rounded hover:bg-[#2d8049] transition-colors"
          disabled={!newMessage.trim()}
        >
          Send
        </button> */}
      </div>
      {isMediaPickerOpen && (
        <div
          ref={gifPickerRef}
          className="fixed bottom-12 right-[16.5rem] flex items-start justify-end mb-5 z-50"
        >
          <div className="relative">
            {/* <button
              onClick={() => setIsMediaPickerOpen(false)}
              className="absolute -top-4 -right-4 w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center"
            >
              ×
            </button> */}
            <GifPicker onSelect={handleMediaSelect} tabOnOpen={activeTab} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerChat;
