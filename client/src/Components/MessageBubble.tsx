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
  user?: { username: string; avatarUrl: string };
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
  prevMessage: Message | false;
  differentDay: boolean;
  similarNextMsg: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  prevMessage,
  differentDay,
  similarNextMsg,
}) => {
  // console.log("intial message: ", message.content);

  const isGifUrl = (url: string): boolean => {
    // Check if the string ends with .gif
    const isGif = url.toLowerCase().endsWith(".gif");
    // console.log("isGif: ", isGif);
    // Check if it's a valid URL
    try {
      new URL(url);
      return isGif;
    } catch {
      return false;
    }
  };

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

  const timeInterval =
    prevMessage &&
    Math.abs(
      new Date(prevMessage.createdAt).getTime() -
        new Date(message.createdAt).getTime()
    ) >
      5 * 60 * 1000;

  const newLine =
    differentDay ||
    !prevMessage ||
    prevMessage.user?.username !== message.user?.username ||
    timeInterval;

  const renderContent = () => {
    if (typeof message.content === "string") {
      if (isGifUrl(message.content)) {
        return (
          <div className="max-w-sm mb-1">
            <img
              src={message.content}
              alt="GIF"
              className="rounded-lg max-w-full h-auto"
              loading="lazy"
            />
          </div>
        );
      }
      return <span className="text-white break-words">{message.content}</span>;
    } else if (isInviteContent(message.content)) {
      return <InviteEmbed inviteData={message.content} />;
    }
    return null;
  };
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(message.createdAt));
  return (
    <div
      className={`group flex items-center px-4 w-full hover:bg-[#42464D] ${
        newLine && !similarNextMsg ? "mb-2" : "mb-0"
      }`}
    >
      {/* Profile Picture */}
      {newLine ? (
        <img
          src={message.user?.avatarUrl}
          alt="user avatar"
          className="w-10 h-10 rounded-full mr-4"
        />
      ) : (
        // <div className="w-10 h-0 mr-4"></div>
        <span className=" pr-2 text-xs text-[#b9bbbe] opacity-0 group-hover:opacity-100 transition-opacity">
          {formattedTime}
        </span>
      )}

      <div className="flex flex-col">
        {/* Username and Timestamp */}
        {newLine && (
          <div className="flex items-center  mb-1 text-center">
            <span className="text-md font-semibold text-white mr-2">
              {message.user?.username || message.senderUsername}
            </span>
            <span className="text-xs text-[#b9bbbe]">
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(message.createdAt))}
            </span>
          </div>
        )}

        {/* Message Content */}
        {/* {typeof message.content === "string" ? (
          <span className="text-white break-words">{message.content}</span>
        ) : isInviteContent(message.content) ? (
          <InviteEmbed inviteData={message.content} />
        ) : null} */}
        {renderContent()}
      </div>
    </div>
  );
};
export default MessageBubble;
