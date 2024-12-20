import {
  Hash,
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
import { TypingIndicator } from "./ServerTypingIndicator";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Import required CSS
interface Message {
  userId: number;
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
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
}
interface MediaItem {
  url: string;
}

interface serverChannel {
  createdAt: string;
  id: number;
  isVoice: boolean;
  name: string;
  serverId: number;
}

const ServerChat: React.FC<ChatProps> = ({
  channelId,
  serverId,
  setOpenMemberList,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId, userName } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, joinServer, joinChannel, leaveChannel, isSocketConnected } =
    useSocket();

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [SelectedMedia, setSelectedMedia] = useState<MediaData | null>(null);
  const [activeTab, setActiveTab] = useState<MediaType>("GIFs");
  const gifPickerRef = useRef<HTMLDivElement | null>(null);

  // typing bubbles
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [groupTypingUsers, setGroupTypingUsers] = useState(() => new Map());

  const typingTimeoutRefs = useRef<Map<number | null, NodeJS.Timeout>>(
    new Map()
  );
  const [channelInfo, setChannelInfo] = useState<serverChannel>();

  // return alls the channel, we could make it return a specific channel but ill just filter it here
  useEffect(() => {
    axios
      .get(`${VITE_API_BASE_URL}/server/channels/${serverId}`)
      .then((response) => {
        // Correctly filter by channelId or serverId as needed
        const filteredChannels = response.data.channels.filter(
          (channel: serverChannel) => channel.id === Number(channelId)
        );
        setChannelInfo(filteredChannels[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [channelId, serverId]);

  const handleMediaSelect = (media: MediaData) => {
    setSelectedMedia(media);
    setIsMediaPickerOpen(false);
  };
  // Initialize socket connection
  useEffect(() => {
    let isActive = true;

    if (socket && isActive) {
      console.log("socket is connected in the server chat");
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

  // reconnect socket
  useEffect(() => {
    if (socket) {
      socket.on("reconnect", (attemptNumber) => {
        console.log(`Reconnected to socket after ${attemptNumber} attempts`);
        // Rejoin server/channel if needed
        joinServer(serverId);
        joinChannel(channelId);
      });
    }
  }, [socket, serverId, channelId, joinServer, joinChannel]);

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
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    // Wait for the socket to connect
    if (!socket.connected) {
      socket.once("connect", () => {
        console.log("Socket is now connected:", socket.connected);
      });
    }
    // console.log("is socket connected?", socket.connected);

    // console.log('socket is live and this is working')

    const handleServerMessage = (msg: Message) => {
      if (msg.userId !== userId) {
        setMessages((prevMessages) => [...prevMessages, msg]);
      }
      setTimeout(() => {
        // Your scrolling logic here
        scrollToBottom();
      }, 0);
    };

    const handleError = (error: string) => {
      setError(error);
    };

    // Handle incoming messages
    socket.on("server_message", handleServerMessage);
    socket.on("error", handleError);

    return () => {
      socket.off("server_message", handleServerMessage);
      socket.off("error", handleError);
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
      // console.log("response data: ", response.data);
      // Update local state to show message immediately
      setMessages((prev) => [...prev, response.data]);
      // console.log("overall messages: ", messages);
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

  // Client-side code example, ping server to update online status
  useEffect(() => {
    if (socket) {
      socket.emit("ping_presence", { userId: userId });
    }
    if (socket) {
      const intervalId = setInterval(() => {
        socket.emit("ping_presence", { userId: userId });
      }, 30000); // Send every 30 seconds
      return () => clearInterval(intervalId);
    }
  }, [socket, userId]);

  // Handle typing for group messages
  const handleGroupTyping = () => {
    // if (!socket) return;
    if (!isSocketConnected()) {
      console.warn("Socket not connected, cannot emit typing event");
      return;
    }

    if (!isTyping) {
      setIsTyping(true);
      console.log("sending typing event");
      socket?.emit("group_typing", {
        groupId: channelId,
        userId: userId,
      });
    }

    // Clear previous timeout for this user
    const existingTimeout = typingTimeoutRefs.current.get(userId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const newTimeout = setTimeout(() => {
      setIsTyping(false);
      socket?.emit("stop_group_typing", {
        groupId: channelId,
        userId: userId,
      });
    }, 2000);

    typingTimeoutRefs.current.set(userId, newTimeout);
  };

  useEffect(() => {
    if (!socket) {
      console.warn(
        "Socket not connected, cannot set up typing event listeners"
      );
      return;
    }

    const handleConnect = () => {
      console.log("Socket connected, setting up typing event listeners");

      socket.on("user_group_typing", ({ groupId, userId }) => {
        if (groupId == channelId) {
          setGroupTypingUsers((prev) => {
            const newMap = new Map(prev); // Create a new Map from the current state
            const name = userName; // Replace this with actual username lookup
            newMap.set(userId, name); // Add or update the userId with the name
            return newMap;
          });
          // console.log("group typing users: ", groupTypingUsers);
        }
      });

      socket.on("user_stop_group_typing", ({ groupId, userId }) => {
        if (groupId == channelId) {
          setGroupTypingUsers(
            (prev) => new Map([...prev].filter(([id]) => id !== userId))
          );
        }
      });
    };

    // Add connection listener if not already connected
    if (!socket.connected) {
      socket.on("connect", handleConnect);
    } else {
      // If already connected, immediately set up listeners
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("user_group_typing");
      socket.off("user_stop_group_typing");
    };
  }, [channelId, groupTypingUsers, socket, userName]);

  // useEffect(() => {
  //   console.log("Updated group typing users: ", groupTypingUsers);
  // }, [groupTypingUsers]);

  const renderTypingIndicators = () => {
    if (groupTypingUsers.size === 0) return null;

    // In a real app, you'd map user IDs to usernames
    const typingUsernames = Array.from(groupTypingUsers)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .map(([_, userName]) => userName) // Replace with actual username lookup
      .join(", ");

    return (
      <TypingIndicator
        typingUsernames={typingUsernames}
        groupTypingUsers={groupTypingUsers}
      />
    );
  };

  return (
    <div className="flex-1 bg-[#36393f] flex flex-col">
      {/* Header */}
      <div className="h-12 px-4 flex items-center shadow-md">
        <Hash className="w-6 h-6 text-[#8e9297] mr-2" />
        <span className="text-white font-bold">
          {channelInfo ? channelInfo.name : "general"}
        </span>
        <div className="ml-auto flex items-center space-x-4 text-[#b9bbbe]">
          <button
            className="w-5 h-5 cursor-pointer "
            onClick={() => setOpenMemberList((prev) => !prev)}
            data-tooltip-id={`tooltip-members`} // Link element to tooltip
            data-tooltip-content={"Show Member List"}
          >
            <Users className="w-5 h-5 cursor-pointer border-none" />
          </button>
          <Tooltip
            id={`tooltip-members`}
            place="bottom"
            className="z-10 "
            style={{
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
            }}
          />
          <Search className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      {/* Maybe make this an independent component */}
      <div className="flex-1 overflow-y-auto flex flex-col-reverse mb-2">
        {renderTypingIndicators()}
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
              !nextMsg ||
              new Date(nextMsg.createdAt).toDateString() !==
                new Date(msg.createdAt).toDateString();

            // console.log("nextmsg: ", nextMsg);
            // console.log("currentmsg: ", msg);
            // console.log("prevmsg: ", prevMsg);
            const timeInterval =
              nextMsg &&
              Math.abs(
                new Date(nextMsg.createdAt).getTime() -
                  new Date(msg.createdAt).getTime()
              ) >
                5 * 60 * 1000;

            const isNewGroup =
              !nextMsg ||
              nextMsg.user?.username !== msg.user?.username ||
              (timeInterval && !isDifferentDay) ||
              isDifferentDay;

            const isLastInGroup =
              !prevMsg || prevMsg.user?.username !== msg.user?.username;

            const formattedTime = new Intl.DateTimeFormat("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(msg.createdAt));
            return (
              <React.Fragment key={msg.id}>
                <div
                  className={`group flex items-center px-4 w-full hover:bg-[#42464D] ${
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
                    // <div
                    //   className="w-10 h-1 mr-4 relative group-hover:visible invisible"
                    // >
                    //   {formattedTime}
                    // </div>
                    <span className=" pr-2 text-xs text-[#b9bbbe] opacity-0 group-hover:opacity-100 transition-opacity">
                      {formattedTime}
                    </span>
                    // <div className="w-10 h-0 mr-4"></div>
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
          onChange={(e) => {
            handleInputChange(e);
            handleGroupTyping();
          }}
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
