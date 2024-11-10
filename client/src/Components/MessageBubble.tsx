import React from "react";
import InviteEmbed from "./Home/InviteEmbed";

// invite by button
interface InviteContent {
  type: "invite";
  inviteCode: string;
  serverName: string;
  expiresAt: string; // or Date if you parse it as a Date object
  serverId: string;
}

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
interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  // console.log("intial message: ", message.content);
  const parseMessageContent = (messageContent: string) => {
    try {
      const parsedContent = JSON.parse(messageContent);
      // console.log("Parsing succesful");
      // Verify that parsedContent has the structure of an invite message
      if (
        parsedContent &&
        typeof parsedContent === "object" &&
        parsedContent.type === "invite" &&
        typeof parsedContent.inviteCode === "string" &&
        typeof parsedContent.serverName === "string" &&
        parsedContent.expiresAt
      ) {
        return parsedContent; // It's an invite message
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // If JSON.parse fails, messageContent is likely a regular string
    }

    // Return the original content if it’s not JSON
    return messageContent;
  };

  if (typeof message.content === "string") {
    message.content = parseMessageContent(message.content);
    // console.log("Parsed message.content: ", message.content);
  } else {
    // Handle the case where message.content is not a string
    // For example, you can log an error or throw an exception
    // console.log(
    //   "Not parsed, Invalid message content type, not a string?",
    //   message.content
    // );
  }

  function isInviteContent(
    content: string | InviteContent
  ): content is InviteContent {
    return typeof content === "object" && content.type === "invite";
  }
  return (
    <div
      className={`flex items-start mb-6 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwn && (
        <div className="w-10 h-10 rounded-full bg-[#2f3136] mr-4"></div>
      )}
      <div
        className={`p-3 rounded-lg max-w-[70%] ${
          isOwn ? "bg-[#3ba55d]" : "bg-[#202225]"
        }`}
      >
        <div className="flex items-center mb-1">
          <span className="text-sm font-semibold text-[#b9bbbe] mr-2">
            {message.user?.username || message.senderUsername}
          </span>
        </div>
        {typeof message.content === "string" && (
          <span className="text-white break-words">{message.content}</span>
        )}
        {/* link invite */}
        {/* {message.type === "invite" && message.inviteData && (
          <InviteEmbed inviteData={message.inviteData} />
        )} */}
        {/* button invite */}
        {isInviteContent(message.content) && (
          <>
            <InviteEmbed inviteData={message.content} />
          </>
        )}
        <div className="text-xs text-[#b9bbbe] mt-1">
          {new Date(message.createdAt).toLocaleString()}
        </div>
      </div>
      {isOwn && (
        <div className="w-10 h-10 rounded-full bg-[#2f3136] ml-4"></div>
      )}
    </div>
  );
};

export default MessageBubble;
