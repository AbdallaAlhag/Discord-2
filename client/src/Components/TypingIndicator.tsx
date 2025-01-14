import React from "react";

interface Friend {
  avatarUrl: string | null;
  createdAt: string;
  email: string;
  id: string;
  username: string;
  onlineStatus: boolean;
}
const TypingIndicator: React.FC<{ friendInfo: Friend | null }> = ({
  friendInfo,
}) => (
  <div className="flex items-center mb-2 ml-6">
    {/* <div className="w-10 h-10 rounded-full bg-[#2f3136] mr-4"></div> */}
    <div className="relative w-6 h-6  mr-2">
      {/* <!-- Avatar --> */}
      <img
        src={friendInfo?.avatarUrl || ""}
        alt="user avatar"
        className="w-full h-full rounded-full"
      />
    </div>
    <div className="p-2 bg-[#202225] rounded-lg max-w-[70%] ml-2">
      <div className="flex items-center">
        <span className="text-sm font-semibold text-[#b9bbbe] mr-2 ">
          Typing...
        </span>
      </div>
    </div>
  </div>
);

export default TypingIndicator;
