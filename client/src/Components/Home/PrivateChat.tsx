import {
  PhoneCall,
  Video,
  Search,
  Plus,
  ImagePlay,
  ImagePlus,
  Smile,
  Trash2,
} from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../../AuthContext";
import axios from "axios";
import PrivateMessage from "./PrivateMessage";
import TypingIndicator from "../TypingIndicator";
import React from "react";
import { GifPicker } from "../TenorComponent/Components/GifPicker";
import { MediaData, MediaType } from "../TenorComponent/Types/tenor";
import { Tooltip } from "react-tooltip";

interface InviteContent {
  type: "invite";
  inviteCode: string;
  serverName: string;
  expiresAt: string; // or Date if you parse it as a Date object
  serverId: string;
}

interface Message {
  user?: { username: string; avatarUrl: string };
  username?: string;
  id: number;
  userId: number;
  content: string | InviteContent;
  senderId: number;
  createdAt: string;
  recipientId: number;
  // senderUsername?: string;
  // senderAvatarUrl?: string;
  recipientUsername?: string;
  type?: "text" | "invite";
  readReceipts: {
    id: number;
    messageId: number;
    userId: number;
    readAt: Date;
  }[];
}

interface Friend {
  avatarUrl: string | null;
  createdAt: string;
  email: string;
  id: number;
  username: string;
  onlineStatus: boolean;
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ChatProps {
  friendId: number;
  isMobile: boolean;
}

interface MediaItem {
  url: string;
}

const PrivateChat: React.FC<ChatProps> = ({ friendId, isMobile }) => {
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
  const [friendInfo, setFriendInfo] = useState<Friend | null>(null);

  // read receipts
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([]);
  const messageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [SelectedMedia, setSelectedMedia] = useState<MediaData | null>(null);
  const [activeTab, setActiveTab] = useState<MediaType>("GIFs");
  const gifPickerRef = useRef<HTMLDivElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const handleMediaSelect = (media: MediaData) => {
    setSelectedMedia(media);
    setIsMediaPickerOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        gifPickerRef.current &&
        !gifPickerRef.current.contains(event.target as Node)
      ) {
        setIsMediaPickerOpen(false);
      }
    };

    if (isMediaPickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMediaPickerOpen]);
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
    const fetchFriendInfo = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_BASE_URL}/user/${friendId}`
        );
        console.log("Friend info: ", response.data.user);
        setFriendInfo(response.data.user);
      } catch (err) {
        console.error("Error fetching friend info:", err);
        setError("Failed to load friend's information");
      }
    };
    const fetchMessages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${VITE_API_BASE_URL}/chat/private/messages/${userId}/${friendId}`
        );
        console.log("messages: ", response.data);
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load message history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    fetchFriendInfo();
  }, [userId, friendId]);

  const markAsRead = useCallback(
    async (messageId: string, senderId: number) => {
      if (!socketRef.current) return;

      try {
        // Emit socket event immediately
        socketRef.current.emit("read_receipt", {
          messageId,
          senderId,
          readBy: userId,
          readAt: new Date().toISOString(),
        });

        // Optionally send API request (can be done async)
        axios
          .post(
            `${VITE_API_BASE_URL}/chat/private/messages/${messageId}/${userId}/read`
          )
          .catch((err) => {
            console.error("Error sending read receipt to API:", err);
          });

        // await axios
        //   .post(
        //     `${VITE_API_BASE_URL}/chat/private/messages/${messageId}/${userId}/read`
        //   )
        //   .then(() => {
        //     socketRef.current?.emit("read_receipt", {
        //       messageId,
        //       senderId,
        //       readBy: userId,
        //       readAt: new Date().toISOString(),
        //     });
        //   });

        // socketRef.current.emit("read_receipt", {
        //   messageId,
        //   senderId,
        //   readBy: userId,
        //   readAt: new Date().toISOString(),
        // });
      } catch (err) {
        console.error("Error sending read receipt:", err);
      }
    },
    [userId]
  );

  // Mark message as read
  // Handle real-time messages
  useEffect(() => {
    if (!socketRef.current) return;

    // const markAsRead = async (messageId: string, senderId: number) => {
    //   if (!socketRef.current) return;

    //   try {
    //     await axios.post(
    //       `${VITE_API_BASE_URL}/chat/channel/messages/${messageId}/${userId}/read`
    //     );
    //     socketRef.current.emit("read_receipt", {
    //       messageId,
    //       senderId,
    //       readBy: userId,
    //       readAt: new Date().toISOString(),
    //     });
    //   } catch (err) {
    //     console.error("Error sending read receipt:", err);
    //   }
    // };

    // Handle incoming messages
    socketRef.current.on("private_message", (msg: Message) => {
      console.log("got private message");
      setMessages((prevMessages) => [...prevMessages, msg]);
      // Send read receipt
      // console.log('do we have focus??: ', document.hasFocus());
      // if (document.hasFocus()) {
      //   console.log('starting read function');
      //   markAsRead(String(msg.id));
      // }
      // Duration to check focus (e.g., 5 seconds)

      // const checkDuration = 5000; // 5 seconds
      // const checkInterval = 500; // Check every 500ms
      // let focusTime = 0;

      // const interval = setInterval(() => {
      //   if (document.hasFocus()) {
      //     focusTime += checkInterval;
      //     console.log(`Focus retained for ${focusTime / 1000}s`);
      //   } else {
      //     focusTime = 0; // Reset if focus is lost
      //     console.log("Focus lost, resetting...");
      //   }

      //   if (focusTime) {
      //     markAsRead(String(msg.id), msg.senderId);
      //     clearInterval(interval);
      //   }
      // }, checkInterval);

      // // Optional: Ensure interval clears after the max check duration
      // setTimeout(() => clearInterval(interval), checkDuration);
      setUnreadMessages((prev) => [...prev, msg]);

      scrollToBottom();
    });

    socketRef.current.on("user_typing", (userId: string) => {
      if (Number(userId) === friendId) {
        setFriendTyping(true);
        setTimeout(() => setFriendTyping(false), 3000);
      }
    });

    // FIX THIS!!!!!!!!!!!!!!!!
    // socketRef.current.on(
    //   "message_read",
    //   (data: {
    //     messageId: string;
    //     readBy: number;
    //     readAt: string;
    //     senderId: number;
    //   }) => {
    //     console.log("previous messages: ", messages);
    //     console.log("data we recieved: ", data);
    //     setMessages((prevMessages) =>
    //       prevMessages.map((msg) => {
    //         // Convert messageId and data.senderId to numbers for comparison
    //         const messageIdNum = Number(data.messageId);
    //         const senderIdNum = Number(data.senderId);

    //         // Check if this is the correct message to update
    //         if (msg.id === messageIdNum && msg.userId === senderIdNum) {
    //           console.log("message read: ", msg);
    //           return {
    //             ...msg,
    //             readReceipts: [
    //               ...(msg.readReceipts || []),
    //               {
    //                 id: msg.id,
    //                 messageId: messageIdNum,
    //                 userId: data.readBy,
    //                 readAt: new Date(data.readAt),
    //               },
    //             ],
    //           };
    //         }

    //         // Return the message unchanged if it doesn't match
    //         return msg;
    //       })
    //     );
    //   }
    // );
    // Socket event listener
    socketRef.current.on(
      "message_read",
      (data: {
        messageId: string;
        readBy: number;
        readAt: string;
        senderId: number;
      }) => {
        console.log("Received message read event:", data);

        setMessages((prevMessages) => {
          // Create a new array to avoid direct mutation
          const updatedMessages = [...prevMessages];

          const messageIndex = updatedMessages.findIndex(
            (msg) =>
              msg.id === Number(data.messageId) &&
              msg.senderId === Number(data.senderId)
          );
          console.log("updatedMessages: ", updatedMessages);
          console.log("message: ", data);
          console.log("messageIndex: ", messageIndex);
          if (messageIndex !== -1) {
            // Create a new message object with updated read receipts
            updatedMessages[messageIndex] = {
              ...updatedMessages[messageIndex],
              readReceipts: [
                ...(updatedMessages[messageIndex].readReceipts || []),
                {
                  id: updatedMessages[messageIndex].id,
                  messageId: Number(data.messageId),
                  userId: data.readBy,
                  readAt: new Date(data.readAt),
                },
              ],
            };
          }

          return updatedMessages;
        });
      }
    );

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
  }, [friendId, markAsRead, userId]);

  useEffect(() => {
    // Create an Intersection Observer
    console.log("Creating observer");
    const observer = new IntersectionObserver(
      (entries) => {
        console.log("entries: ", entries);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = Number(
              entry.target.getAttribute("data-message-id")
            );
            const message = unreadMessages.find((msg) => msg.id === messageId);

            console.log("here we are");
            if (message) {
              console.log("we got inside which i don't think willl work");
              console.log("message: ", message);
              // Mark the message as read
              markAsRead(String(messageId), message.senderId);

              // Remove from unread messages
              setUnreadMessages((prev) =>
                prev.filter((msg) => msg.id !== messageId)
              );

              // Disconnect this specific observation
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when at least 50% of the message is visible
      }
    );

    // Observe all unread message elements
    messageRefs.current.forEach((el, messageId) => {
      if (unreadMessages.some((msg) => msg.id === messageId)) {
        observer.observe(el);
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [markAsRead, unreadMessages]);

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
    }, 100);
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

    // console.log("messageData: ", messageData);
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
      // console.log('messageData: ', messageData);
      if (!inviteData) {
        const response = await axios.post(
          `${VITE_API_BASE_URL}/chat/private/messages`,
          messageData
        );
        console.log("Message saved to database:", response.data); // Debug
        // Emit message through socket for real-time delivery
        socketRef.current.emit("private_message", response.data);
        // Update local state to show message immediately
        setMessages((prev) => [...prev, response.data]);
        // console.log("messages: ", messages);
        setNewMessage("");
        scrollToBottom();
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  // send Media
  const sendMedia = useCallback(
    async (media: MediaItem, s3Url = false) => {
      if ((!media?.url && !s3Url) || !socketRef.current) return;
      let messageData;

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
            senderId: userId,
            recipientId: friendId,
            createdAt: new Date().toISOString(),
          };
        } catch (error) {
          console.error("Error uploading image:", error);
          return;
        }
      } else {
        messageData = {
          content: media.url,
          senderId: userId,
          recipientId: friendId,
          createdAt: new Date().toISOString(),
        };
      }

      try {
        // Send to server and save in database
        const response = await axios.post(
          `${VITE_API_BASE_URL}/chat/private/messages`,
          messageData
        );
        console.log("Message saved to database:", response.data); // Debug
        // Emit message through socket for real-time delivery
        socketRef.current.emit("private_message", response.data);
        // Update local state to show message immediately
        setMessages((prev) => [...prev, response.data]);
        // console.log("messages: ", messages);
        setNewMessage("");
        scrollToBottom();
      } catch (err) {
        console.error("Error sending message:", err);
        setError("Failed to send message");
      }
    },
    [friendId, imageFile, userId]
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

  // Client-side code example, ping server to update online status
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit("ping_presence", { userId });
    }
    if (socketRef.current) {
      const intervalId = setInterval(() => {
        socketRef.current?.emit("ping_presence", { userId });
      }, 30000); // Send every 30 seconds
      return () => clearInterval(intervalId);
    }
  }, [socketRef, userId]);
  // console.log("Message: ", messages);

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
        {/* <Hash className="w-6 h-6 text-[#8e9297] mr-2" /> */}
        {friendInfo?.avatarUrl ? (
          // <img
          //   src={friendInfo.avatarUrl}
          //   alt="user avatar"
          //   className="w-8 h-8 rounded-full mr-2"
          // />
          <div className="relative w-8 h-8  mr-2">
            {/* <!-- Avatar --> */}
            <img
              src={friendInfo?.avatarUrl}
              alt="user avatar"
              className="w-full h-full rounded-full"
            />
            {/* <!-- Status Indicator --> */}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#2f3136] ${
                friendInfo?.onlineStatus ? "bg-[#23a55a]" : "bg-[#7d818b]"
              }`}
            ></div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#2f3136] mr-4"></div>
        )}
        <span className="text-white font-bold">{friendInfo?.username}</span>
        <div className="ml-auto flex items-center space-x-4 text-[#b9bbbe]">
          <PhoneCall className="w-7 h-7 cursor-pointer" />
          <Video className="w-7 h-7 cursor-pointer" />
          <Search className="w-7 h-7 cursor-pointer" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="min-h-full flex flex-col justify-end">
          {isLoading ? (
            <div className="text-center text-[#b9bbbe]">
              Loading messages...
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-[#b9bbbe]">No messages yet</div>
          ) : (
            // messages.map((msg) => (
            //   <PrivateMessage
            //     key={msg.id || msg.id}
            //     message={msg}
            //     isOwn={msg.senderId === userId}
            //   />
            // ))
            messages.map((msg, index) => {
              const prevMsg = index > 0 && messages[index - 1];
              const nextMsg =
                index < messages.length - 1 && messages[index + 1];
              // console.log("prevMsg: ", prevMsg);
              // console.log("current msg: ", msg);
              const isDifferentDay =
                (prevMsg &&
                  new Date(prevMsg.createdAt).toDateString() !==
                    new Date(msg.createdAt).toDateString()) ||
                index === 0;
              const similarNextMsg =
                nextMsg && nextMsg.user?.username === msg.user?.username;
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
                  <PrivateMessage
                    message={msg}
                    isOwn={msg.senderId === userId}
                    prevMessage={prevMsg}
                    differentDay={isDifferentDay}
                    similarNextMsg={similarNextMsg}
                    messageRefs={messageRefs}
                  />
                </React.Fragment>
              );
            })
          )}
          {friendTyping && <TypingIndicator friendInfo={friendInfo} />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      {/* <div className="h-16 flex items-center px-4 pb-6">


        <div className="flex items-center space-x-2 bg-[#202225] rounded-l-md py-2 pl-3">
          <Plus className="w-6 h-6 cursor-pointer bg-[#b5bac1] hover:text-white transition-colors rounded-sm" />
        </div> */}
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
          {/* <input
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
          /> */}

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
                handleTyping();
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
            // className={"fixed bottom-12 right-6 flex items-end justify-end mb-5 z-50"}
            className={
              !isMobile
                ? "fixed bottom-12 right-6 flex items-end justify-end mb-5 z-50"
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
    </div>
  );
};

export default PrivateChat;
