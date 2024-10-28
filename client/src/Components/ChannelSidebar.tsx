import { Hash, Settings } from "lucide-react";
const ChannelSidebar: React.FC = () => {
  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      <div className="h-12 px-4 flex items-center shadow-md">
        <h2 className="text-white font-bold">Discord Clone</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-2 mt-4">
          <div className="flex items-center px-2 text-[#8e9297] text-sm mb-1">
            <Hash className="w-5 h-5 mr-1.5" />
            <span>general</span>
          </div>
          <div className="flex items-center px-2 text-[#8e9297] text-sm mb-1 bg-[#393c43] rounded">
            <Hash className="w-5 h-5 mr-1.5" />
            <span>announcements</span>
          </div>
        </div>
      </div>
      <div className="h-14 bg-[#292b2f] px-2 flex items-center">
        <div className="w-8 h-8 rounded-full bg-[#36393f] mr-2"></div>
        <div className="flex-1">
          <div className="text-white text-sm font-medium">User</div>
          <div className="text-[#b9bbbe] text-xs">#0001</div>
        </div>
        <Settings className="w-5 h-5 text-[#b9bbbe] cursor-pointer" />
      </div>
    </div>
  );
};

export default ChannelSidebar;
