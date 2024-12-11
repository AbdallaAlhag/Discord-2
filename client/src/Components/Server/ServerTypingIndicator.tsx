import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

interface TypingIndicatorProps {
  typingUsernames: string;
  groupTypingUsers: Map<string, string>;
}

export function TypingIndicator({
  typingUsernames,
  groupTypingUsers,
}: TypingIndicatorProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (groupTypingUsers.size === 0) return null;

  return (
    <div className="p-2.5 ml-4 bg-[#202225] rounded-lg max-w-fit transition-all duration-300 ease-in-out hover:bg-[#2a2d31]">
      <div className="flex items-center gap-2 group">
        <MessageCircle
          className="w-4 h-4 text-[#b9bbbe] animate-pulse"
          aria-hidden="true"
        />
        <div className="flex items-center">
          <span className="text-sm font-medium text-[#b9bbbe]">
            {typingUsernames}
            <span className="mx-1">
              {groupTypingUsers.size === 1 ? "is" : "are"}
            </span>
            typing
          </span>
          <span className="text-[#b9bbbe] w-[20px] inline-block">{dots}</span>
        </div>
      </div>
    </div>
  );
}
