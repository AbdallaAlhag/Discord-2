import React from "react";

const TypingIndicator: React.FC = () => (
  <div className="flex items-center mb-6">
    <div className="w-10 h-10 rounded-full bg-[#2f3136] mr-4"></div>
    <div className="p-2 bg-[#202225] rounded-lg max-w-[70%]">
      <div className="flex items-center">
        <span className="text-sm font-semibold text-[#b9bbbe] mr-2">
          Typing...
        </span>
      </div>
    </div>
  </div>
);

export default TypingIndicator;
