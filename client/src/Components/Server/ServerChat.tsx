import {
  Hash,
  Users,
  Search,
  Plus,
  ImagePlay,
  ImagePlus,
  Smile,
  Trash2,
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
import WumpusSleeping from "../../assets/WumpusSleeping.webp";
import defaultAvatar from "/default-avatar.svg";
interface Message {
  userId: string;
  user: { username: string; avatarUrl: string };
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  recipientId: string;
  senderUsername: string;
  recipientUsername: string;
}

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ChatProps {
  channelId: string;
  serverId: string;
  setOpenMemberList: React.Dispatch<React.SetStateAction<boolean>>;
  openMemberList: boolean;
  isMobile: boolean;
}
interface MediaItem {
  url: string;
}

interface serverChannel {
  createdAt: string;
  id: string;
  isVoice: boolean;
  name: string;
  serverId: string;
}

const ServerChat: React.FC<ChatProps> = ({
  channelId,
  serverId,
  setOpenMemberList,
  openMemberList,
  isMobile,
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

  const typingTimeoutRefs = useRef<Map<string | null, NodeJS.Timeout>>(
    new Map()
  );
  const [channelInfo, setChannelInfo] = useState<serverChannel>();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // return alls the channel, we could make it return a specific channel but ill just filter it here
  useEffect(() => {
    axios
      .get(`${VITE_API_BASE_URL}/server/channels/${serverId}`)
      .then((response) => {
        // Correctly filter by channelId or serverId as needed
        const filteredChannels = response.data.channels.filter(
          (channel: serverChannel) => channel.id === channelId
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
    }, 100);
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
    async (media: MediaItem, s3Url = false) => {
      if ((!media?.url && !s3Url) || !socket) return;
      let messageData;

      // let use change the media link to s3 bucket
      console.log("media: ", media);
      console.log("s3Url: ", s3Url);
      if (s3Url) {
        try {
          const response = await axios.post(
            `${VITE_API_BASE_URL}/upload/get-signed-url`,
            {
              fileName: imageFile?.name,
              fileType: imageFile?.type,
            }
          );

          const { url: signedUrl } = response.data;

          // Upload image to S3 using the signed URL
          await axios
            .put(signedUrl, imageFile, {
              headers: {
                "Content-Type": imageFile?.type,
              },
            })
            .then(() => {
              console.log("Image uploaded to S3 successfully");
              setImageFile(null);
              setImageUrl(null);
            });

          const uploadedImageUrl = signedUrl.split("?")[0]; // Removes query params to get the public URL

          messageData = {
            content: uploadedImageUrl,
            userId: userId,
            channelId: channelId,
            createdAt: new Date().toISOString(),
          };
        } catch (error) {
          console.error("Error uploading image:", error);
          return;
        }
      } else {
        messageData = {
          content: media.url,
          userId: userId,
          channelId: channelId,
          createdAt: new Date().toISOString(),
        };
      }

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
    [socket, imageFile, userId, channelId]
  );

  // send selected media through gifpicker
  useEffect(() => {
    if (SelectedMedia) {
      sendMedia(SelectedMedia, false);
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
      if (imageFile && imageUrl) {
        sendMedia(imageUrl as unknown as MediaItem, true);
      }
      e.preventDefault();
      sendMessage();
      // if image, then send image also -> maybe use sendMedia
    }
  };

  // const isGifUrl = (url: string): boolean => {
  //   // Check if the string ends with .gif
  //   const isGif = url.toLowerCase().endsWith(".gif");
  //   // Check if it's a valid URL
  //   try {
  //     new URL(url);
  //     return isGif;
  //   } catch {
  //     return false;
  //   }
  // };

  const isImageUrl = (url: string): boolean =>
    /\.(jpeg|jpg|png|webp)$/i.test(url);
  const isGifUrl = (url: string): boolean => /\.gif$/i.test(url);
  const isVideoUrl = (url: string): boolean =>
    /\.(mp4|mov|webm|ogg)$/i.test(url);
  const isAudioUrl = (url: string): boolean => /\.(mp3|wav|ogg)$/i.test(url);

  // Check if the content is plain text
  const isPlainText = (content: string): boolean => {
    // If it doesn't match any known media patterns, treat it as text
    return !isImageUrl(content) && !isGifUrl(content) && !isVideoUrl(content);
  };
  const renderMedia = (url: string) => {
    if (isGifUrl(url)) {
      return (
        <div className="max-w-sm mb-1">
          <img
            src={url}
            alt="GIF"
            className="rounded-lg max-w-full h-auto"
            loading="lazy"
          />
        </div>
      );
    }

    if (isImageUrl(url)) {
      return (
        <div className="max-w-sm mb-1">
          <img
            src={url}
            alt="Image"
            className="rounded-lg max-w-full h-auto"
            loading="lazy"
          />
        </div>
      );
    }

    if (isVideoUrl(url)) {
      return (
        <div className="max-w-sm mb-1">
          <video src={url} controls className="rounded-lg max-w-full h-auto">
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    if (isAudioUrl(url)) {
      return (
        <div className="max-w-sm mb-1">
          <audio
            src={url}
            controls
            className="rounded-lg max-w-full h-auto"
          ></audio>
        </div>
      );
    }
    if (isPlainText(url)) {
      return <span className="text-white break-words">{url}</span>;
    }
    // Fallback for unsupported media
    return (
      <div className="max-w-sm mb-1">
        <span className="text-white break-words">
          Unsupported content type: {url}
        </span>
      </div>
    );
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

  // file upload

  const handleButtonClick = () => {
    const imageInput = document.getElementById(
      "imageInput"
    ) as HTMLInputElement;
    imageInput.click();
  };

  const isImageUrlMimeType = (mimeType: string): boolean =>
    /^image\/(jpeg|jpg|png|webp)$/i.test(mimeType);

  const isGifUrlMimeType = (mimeType: string): boolean =>
    /^image\/gif$/i.test(mimeType);

  const isVideoUrlMimeType = (mimeType: string): boolean =>
    /^(video\/(mp4|mov|webm|ogg))$/i.test(mimeType);

  const isAudioUrlMimeType = (mimeType: string): boolean =>
    /^(audio\/(mp3|wav|ogg))$/i.test(mimeType);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("file: ", file);

    if (!file) {
      console.error("No file selected");
      return;
    }
    const imageUrl = URL.createObjectURL(file);
    const fileType = file.type; // Get the MIME type from the file

    // Determine the file type using utility functions
    if (isImageUrlMimeType(fileType)) {
      console.log("File is an image");
      // Handle image-specific logic
      setImageFile(file);
      setImageUrl(imageUrl);
    } else if (isGifUrlMimeType(fileType)) {
      console.log("File is a GIF");
      // Handle GIF-specific logic
      setImageFile(file);
      setImageUrl(imageUrl);
    } else if (isVideoUrlMimeType(fileType)) {
      console.log("File is a video");
      // Handle video-specific logic
      setImageFile(file);
      setImageUrl(imageUrl);
    } else if (isAudioUrlMimeType(fileType)) {
      console.log("File is an audio");
      // Handle audio-specific logic
      setImageFile(file);
      setImageUrl(imageUrl);
    } else {
      console.error("Unsupported file type");
      // Optionally handle unsupported files
    }
    event.target.value = ""; // Reset file input
  };

  //   Calling URL.createObjectURL creates an in-memory object URL. If you are not revoking it, it may lead to memory leaks.

  // Solution: Revoke the object URL when it is no longer needed, for example, when the component unmounts or the file is changed again:
  // tsx
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);
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
            data-tooltip-content={
              !openMemberList ? "Show Member List" : "Hide Member List"
            }
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
      {/* <div className="flex-1 overflow-y-auto flex flex-col-reverse mb-2"> */}
      <div
        className={`flex-1 overflow-y-auto flex flex-col-reverse mb-2 ${
          messages.length === 0 ? "bg-noise bg-center bg-auto" : ""
        }`}
        style={{
          backgroundImage:
            messages.length === 0
              ? // ? "url('/assets/WumpusSleeping.webp')"
                `url(${WumpusSleeping})`
              : "none",
        }}
      >
        {renderTypingIndicators()}
        <div ref={messagesEndRef} style={{ height: 0 }} />
        {isLoading ? (
          <div className="text-center text-[#b9bbbe]">Loading messages...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-[#b9bbbe] z-10">No messages yet</div>
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
                      src={msg.user?.avatarUrl || defaultAvatar}
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
                    {/* {isGifUrl(msg.content) ? (
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
                    )} */}
                    {renderMedia(msg.content)}
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

      <div
        className={`flex flex-col ${
          imageUrl ? "min-h-[144px]" : "min-h-[68px]"
        } px-4 py-2 transition-all duration-200`}
      >
        <div className="flex flex-col bg-[#202225] rounded-md">
          {/* Image Preview - Only shown when image exists */}
          {imageUrl && imageFile && (
            <>
              <div className="p-2">
                <div className="relative w-24 h-24 rounded-md bg-cover bg-center">
                  {isImageUrlMimeType(imageFile.type) ? (
                    <img
                      src={imageUrl}
                      alt="Image preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : isGifUrlMimeType(imageFile.type) ? (
                    <img
                      src={imageUrl}
                      alt="GIF preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : isVideoUrlMimeType(imageFile.type) ? (
                    <video
                      src={imageUrl}
                      controls
                      className="w-full h-full object-cover rounded-md"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : isAudioUrlMimeType(imageFile.type) ? (
                    <audio
                      src={imageUrl}
                      controls
                      className="w-full h-full object-cover rounded-md"
                    >
                      Your browser does not support the audio tag.
                    </audio>
                  ) : (
                    <div className="flex justify-center items-center text-white">
                      Unsupported media type
                    </div>
                  )}

                  {/* Remove button */}
                  <button
                    className="absolute top-0 right-0 p-1 text-[#b9bbbe] hover:text-white transition-colors bg-[#313338]"
                    onClick={() => {
                      setImageUrl("");
                      setImageFile(null);
                    }}
                    data-tooltip-id={`remove-attachment`} // Link element to tooltip
                    data-tooltip-content={"Remove attachment"}
                  >
                    <Trash2
                      className="w-5 h-5 z-10 bg-[#313338] rounded-full"
                      color="#f23f43"
                    />
                    <Tooltip
                      id={`remove-attachment`}
                      place="top"
                      className="z-10 ml-2.5"
                      style={{
                        backgroundColor: "black",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    />
                  </button>
                </div>
              </div>
              <div className="text-[#b9bbbe] text-xs text-start pl-2">
                {imageFile.name}
              </div>

              <div className="flex items-center my-2">
                <hr className="flex-grow border-t border-[#3f4147]" />
              </div>
            </>
          )}
          {/* Message Input */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 py-2 pl-3">
              <input
                type="file"
                id="imageInput"
                className="hidden"
                accept="image/*,video/*,audio/*"
                onChange={handleFileChange}
              />
              <Plus
                className="w-6 h-6 cursor-pointer bg-[#b5bac1]  hover:text-white transition-colors rounded-xl p-1"
                onClick={handleButtonClick}
              />
            </div>
            <input
              type="text"
              className="flex-1 bg-transparent text-white px-3 py-2 focus:outline-none"
              placeholder="Type your message here..."
              value={newMessage}
              onChange={(e) => {
                handleInputChange(e);
                handleGroupTyping();
              }}
              onKeyDown={handleKeyPress}
            />
            {/* </div> */}

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
          </div>
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
          // className={
          //   !isMobile
          //     ? "fixed bottom-12 right-[16.5rem] flex items-start justify-end mb-5 z-50"
          //     : "fixed bottom-12 right-0 flex items-start justify-end mb-5 z-50"
          // }
          className={
            !isMobile
              ? openMemberList
                ? "fixed bottom-12 right-[16.5rem] flex items-start justify-end mb-5 z-50"
                : "fixed bottom-12 right-6 flex items-end justify-end mb-5 z-50"
              : "fixed bottom-12 right-0 flex items-start justify-end mb-5 z-50"
          }
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
