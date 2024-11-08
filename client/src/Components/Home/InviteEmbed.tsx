import { Users } from "lucide-react";
interface InviteData {
  serverName: string;
  onlineCount: number;
  memberCount: number;
  inviteCode: string;
}
const InviteEmbed: React.FC<{ inviteData: InviteData }> = ({ inviteData }) => {
  const handleJoin = () => {
    // Handle join server action
    console.log(`Joining server with invite code: ${inviteData.inviteCode}`);
  };

  return (
    <div className="max-w-md bg-[#2f3136] rounded-md p-4 text-gray-100 mt-2">
      <div className="text-sm text-[#b9bbbe] mb-2">
        YOU'VE BEEN INVITED TO JOIN A SERVER
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-[#202225] rounded-full flex items-center justify-center">
            <span className="text-lg">As</span>
          </div>
          <div>
            <div className="font-semibold">{inviteData.serverName}</div>
            <div className="flex items-center space-x-2 text-sm text-[#b9bbbe]">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#3ba55d] rounded-full mr-2"></div>
                {inviteData.onlineCount} Online
              </div>
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                {inviteData.memberCount} Member
                {inviteData.memberCount !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleJoin}
          className="bg-[#3ba55d] hover:bg-[#2d8049] text-white px-4 py-1.5 rounded-md font-medium transition-colors"
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default InviteEmbed;
