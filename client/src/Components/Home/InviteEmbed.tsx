import axios from "axios";
import { Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/AuthContext";

interface InviteContent {
  type: "invite";
  inviteCode: string;
  serverName: string;
  expiresAt: string; // or Date if you parse it as a Date object
  serverId: string;
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InviteEmbed: React.FC<{ inviteData: InviteContent }> = ({
  inviteData,
}) => {
  const [joined, setJoined] = useState(false);
  const { userId } = useAuth();

  // console.log("inviteData: ", inviteData);
  const handleJoin = async () => {
    // Handle join server action
    try {
      await axios.post(
        `${VITE_API_BASE_URL}/server/join/${userId}/${inviteData.serverId}`,
        {
          inviteData,
        }
      );

      setJoined(true);
      console.log(`Joining server with invite code: ${inviteData.inviteCode}`);
    } catch (error) {
      // Check if the error is an AxiosError type, which provides more specific typing for the response data.
      if (axios.isAxiosError(error)) {
        console.log(error);
        // Check for specific server response message
        if (
          error.response?.data?.error ===
          "User is already a member of the server"
        ) {
          setJoined(true);
          console.error("User is already a member of the server:");
        } else {
          console.error(
            "Error joining server:",
            error.response?.data?.error || error.message
          );
        }
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
  };

  return (
    <div className="max-w-md bg-[#2f3136] rounded-md p-4 text-gray-100 mt-2">
      <div className="text-sm text-[#b9bbbe] mb-2">
        YOU'VE BEEN INVITED TO JOIN A SERVER
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-8 bg-[#202225] rounded-full flex items-center justify-center">
            <span className="text-lg">👋</span>
          </div>
          <div>
            <div className="font-semibold">{inviteData.serverName}</div>

            {/* link invite */}
              {/* <div className="flex items-center space-x-2 text-sm text-[#b9bbbe]">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#3ba55d] rounded-full mr-2"></div>
                {"onlineCount" in inviteData &&
                  `${inviteData.onlineCount} Online`}
              </div>
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                {"memberCount" in inviteData && (
                  <>
                    {inviteData.memberCount} Member
                    {inviteData.memberCount !== 1 ? "s" : ""}
                  </>
                )}
              </div>
            </div> */}

            {/* button invite */}
            <div className="flex items-center space-x-2 text-sm text-[#b9bbbe] pr-4">
              {/* link invite */}
              <div className="flex items-center">
                <div className="w-2 h-2 bg-[#3ba55d] rounded-full mr-2"></div>
                {"inviteCode" in inviteData &&
                  `${inviteData.inviteCode}`}
              </div>
              <div className="flex items-center">
                <Users size={14} className="mr-1" />
                {"expiresAt" in inviteData && (
                  <>{new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(inviteData.expiresAt))}</>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleJoin}
          disabled={joined}
          className="bg-[#3ba55d] hover:bg-[#2d8049] text-white px-4 py-1.5 rounded-md font-medium transition-colors"
        >
          {joined ? "Joined" : "Join"}
        </button>
      </div>
    </div>
  );
};

export default InviteEmbed;
