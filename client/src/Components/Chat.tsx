import { Hash, Bell, Pin, Users, Search, Plus, Gift, ImagePlus, Smile } from "lucide-react";
import { useState } from "react";

const Chat: React.FC = function () {
  const [message, setMessage] = useState("");

  return (
    <div className="flex-1 bg-[#36393f] flex flex-col">
      <div className="h-12 px-4 flex items-center shadow-md">
        <Hash className="w-6 h-6 text-[#8e9297] mr-2" />
        <span className="text-white font-bold">general</span>
        <div className="ml-auto flex items-center space-x-4 text-[#b9bbbe]">
          <Bell className="w-5 h-5 cursor-pointer" />
          <Pin className="w-5 h-5 cursor-pointer" />
          <Users className="w-5 h-5 cursor-pointer" />
          <Search className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex items-start mb-6">
          <div className="w-10 h-10 rounded-full bg-[#2f3136] mr-4"></div>
          <div>
            <div className="flex items-center">
              <span className="text-white font-medium mr-2">User</span>
              <span className="text-xs text-[#72767d]">Today at 12:00 PM</span>
            </div>
            <p className="text-[#dcddde] mt-1">Welcome to Discord Clone! 👋</p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <div className="bg-[#40444b] rounded-lg p-2 flex items-center">
          <Plus className="w-6 h-6 text-[#b9bbbe] mx-2 cursor-pointer" />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message #general"
            className="flex-1 bg-transparent text-[#dcddde] placeholder-[#72767d] outline-none"
          />
          <Gift className="w-6 h-6 text-[#b9bbbe] mx-2 cursor-pointer" />
          <ImagePlus className="w-6 h-6 text-[#b9bbbe] mx-2 cursor-pointer" />
          <Smile className="w-6 h-6 text-[#b9bbbe] mx-2 cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default Chat;