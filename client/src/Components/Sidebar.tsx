import { MessageSquare, Plus } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <div className="w-[72px] bg-[#202225] flex flex-col items-center py-3 space-y-2">
      <div className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer">
        <MessageSquare className="w-6 h-6 text-[#dcddde]" />
      </div>
      <div className="w-12 h-[2px] bg-[#36393f] rounded-full" />
      <div className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer">
        <Plus className="w-6 h-6 text-[#3ba55d]" />
      </div>
    </div>
  );
};

export default Sidebar;