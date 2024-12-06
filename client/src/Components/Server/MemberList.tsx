import axios from "axios";
import { useEffect, useState } from "react";

interface MemberListProps {
  serverId: string;
}

// I'll to change this later as serverMembers in schema will need to be changed also
interface serverUserInfo {
  userId: number;
  // username: string;
  // avatarUrl: string | null;
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MemberList: React.FC<MemberListProps> = function ({ serverId }) {
  const [serverUserInfo, setServerUserInfo] = useState<serverUserInfo[]>([]);
  // grab server members
  useEffect(() => {
    const fetchServerUsers = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_BASE_URL}/server/channels/${Number(serverId)}`
        );
        // console.log("server response: ", response);
        // console.log("servername: ", response.data.name);
        setServerUserInfo(response.data.members);
        // console.log("members: ", response.data.members);
        // console.log("channels: ", response.data);
      } catch (error) {
        console.error("Error fetching channels", error);
      }
    };

    fetchServerUsers();
  }, [serverId]);

  return (
    <div className="w-60 bg-[#2f3136] p-4 hidden lg:block ">
      {/* <div className="w-60 bg-[#2f3136] p-4"> */}

      <h3 className="text-[#8e9297] uppercase text-xs font-semibold mb-4">
        Online — {serverUserInfo.length}
      </h3>
      {serverUserInfo.map((user) => (
        <div
          key={user.userId}
          className="flex items-center mb-3 cursor-pointer hover:bg-[#36393f] p-2 rounded"
        >
          <div className="w-8 h-8 rounded-full bg-[#36393f] relative">
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3ba55d] rounded-full border-2 border-[#2f3136]"></div>
          </div>
          <span className="text-[#dcddde] ml-2">{user.userId}</span>
        </div>
      ))}
    </div>
  );
};

export default MemberList;
