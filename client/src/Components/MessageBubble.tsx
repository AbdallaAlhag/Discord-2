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

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => (
  <div
    className={`flex items-start mb-6 ${
      isOwn ? "justify-end" : "justify-start"
    }`}
  >
    {!isOwn && <div className="w-10 h-10 rounded-full bg-[#2f3136] mr-4"></div>}
    <div
      className={`p-3 rounded-lg max-w-[70%] ${
        isOwn ? "bg-[#3ba55d] ml-4" : "bg-[#202225] mr-4"
      }`}
    >
      <div className="flex items-center mb-1">
        <span className="text-sm font-semibold text-[#b9bbbe] mr-2">
          {message.user?.username || message.senderUsername}
        </span>
      </div>
      <span className="text-white break-words">{message.content}</span>
      <div className="text-xs text-[#b9bbbe] mt-1">
        {new Date(message.createdAt).toLocaleTimeString()}
      </div>
    </div>
    {isOwn && <div className="w-10 h-10 rounded-full bg-[#2f3136] ml-4"></div>}
  </div>
);

export default MessageBubble;
