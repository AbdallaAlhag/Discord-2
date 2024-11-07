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
  channelId: number;
}

const ServerChat: React.FC<ChatProps> = ({ channelId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuth();
  const socketRef = useRef<Socket>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  }, [userId, channelId]);

  // Handle real-time messages
  useEffect(() => {
    if (!socketRef.current) return;

    // Handle incoming messages
    socketRef.current.on("private_message", (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
      scrollToBottom();
    });

    // Handle error events
    socketRef.current.on("error", (error: string) => {
      setError(error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("private_message");
        socketRef.current.off("error");
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  // Send message function
  const sendMessage = async () => {
    if (!newMessage.trim() || !socketRef.current) return;
    const messageData = {
      content: newMessage,
      userId: userId,
      channelId: channelId,
      timestamp: new Date().toISOString(),
    };

    try {
      // Send to server and save in database
      const response = await axios.post(
        `${VITE_API_BASE_URL}/chat/channel/messages`,
        messageData
      );
      // console.log("Message saved to database:", response.data); // Debug

      // Emit message through socket for real-time delivery
      socketRef.current.emit("private_message", response.data);

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
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center text-[#b9bbbe]">Loading messages...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-[#b9bbbe]">No messages yet</div>
        ) : (
          messages.map((msg) => (
            <div
              className={`flex items-start mb-6 ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              }`}
              key={msg.id}
            >
              {msg.senderId !== userId && (
                <div className="w-10 h-10 rounded-full bg-[#2f3136] mr-4"></div>
              )}
              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  msg.senderId === userId
                    ? "bg-[#3ba55d] ml-4"
                    : "bg-[#202225] mr-4"
                }`}
              >
                <div className="flex items-center mb-1">
                  <span className="text-sm font-semibold text-[#b9bbbe] mr-2">
                    {msg.user?.username || msg.senderUsername}
                  </span>
                </div>
                <span className="text-white break-words">{msg.content}</span>
                <div className="text-xs text-[#b9bbbe] mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </div>
              </div>
              {msg.senderId === userId && (
                <div className="w-10 h-10 rounded-full bg-[#2f3136] ml-4"></div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} style={{ height: 0 }} />
      </div>

      {/* Input Area */}
      <div className="h-16 bg-[#2f3136] flex items-center px-4">
        <input
          type="text"
          className="flex-1 bg-[#202225] text-white rounded px-3 py-2 focus:outline-none"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-[#3ba55d] text-white px-4 py-2 rounded hover:bg-[#2d8049] transition-colors"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
        <div className="flex items-center space-x-4 ml-4 text-[#b9bbbe]">
          <Plus className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <Gift className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <ImagePlus className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <Smile className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
};

export default ServerChat;
