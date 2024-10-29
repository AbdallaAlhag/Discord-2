import { Users } from "lucide-react";

const FriendsNavBar: React.FC = function () {
  return (
    <div className="h-12 border-b border-[#36393f] flex items-center px-4 space-x-4">
      <Users className="w-6 h-6 text-[#dcddde]" />
      <span className="text-white font-medium">Friends</span>
      <div className="h-6 w-[1px] bg-[#36393f]" />
      <button className="text-white hover:bg-[#42464D] px-2 py-1 rounded text-sm">
        Online
      </button>
      <button className="text-[#B9BBBE] hover:text-white hover:bg-[#42464D] px-2 py-1 rounded text-sm">
        All
      </button>
      <button className="text-[#B9BBBE] hover:text-white hover:bg-[#42464D] px-2 py-1 rounded text-sm">
        Pending
      </button>
      <button className="text-[#B9BBBE] hover:text-white hover:bg-[#42464D] px-2 py-1 rounded text-sm">
        Blocked
      </button>
      <button className="bg-[#248046] hover:bg-[#1a6334] text-white px-2 py-1 rounded text-sm ml-auto">
        Add Friend
      </button>
    </div>
  );
}

export default FriendsNavBar;
