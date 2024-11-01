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
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../AuthContext";

interface Message {
  id: number;
  content: string;
  senderId: number; // or other relevant fields based on your project
}

// Define the types for the message
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const socket = io(VITE_API_BASE_URL); // Adjust this URL based on your server setup

interface ChatProps {
  friendId: number; // Accept channelId as a prop
}

const Chat: React.FC<ChatProps> = ({ friendId }) => {
  const [messages, setMessages] = useState<Message[]>([]); // specify Message[] type
  const [message, setMessage] = useState("");
  const { userId } = useAuth();

  useEffect(() => {
    socket.on("private_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("private_message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        content: message,
        senderId: userId,
        recipientId: friendId,
      };
      socket.emit("private_message", newMessage);
      setMessage("");
    }
  };

  return (
    <div className="flex-1 bg-[#36393f] flex flex-col">
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

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((msg) => (
          <div className="flex items-start mb-6" key={msg.id}>
            <div className="w-10 h-10 rounded-full bg-[#2f3136] mr-4"></div>
            <div className="bg-[#202225] p-3 rounded-lg">
              <span className="text-white">{msg.content}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="h-16 bg-[#2f3136] flex items-center px-4">
        <input
          type="text"
          className="flex-1 bg-[#202225] text-white rounded px-3 py-2 focus:outline-none"
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-[#3ba55d] text-white px-4 py-2 rounded"
        >
          Send
        </button>
        <Plus className="w-5 h-5 ml-4 cursor-pointer" />
        <Gift className="w-5 h-5 ml-4 cursor-pointer" />
        <ImagePlus className="w-5 h-5 ml-4 cursor-pointer" />
        <Smile className="w-5 h-5 ml-4 cursor-pointer" />
      </div>
    </div>
  );
};

export default Chat;
