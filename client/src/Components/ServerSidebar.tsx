import { useState, useEffect } from "react";
import { MessageSquare, Plus } from "lucide-react";
import axios from "axios";
import { useAuth } from "../AuthContext";

interface Server {
  id: number;
  name: string;
  iconUrl: string;
  createdAt: Date;
}
const ServerSidebar: React.FC = () => {
  const [server, setServer] = useState([]);
  const { userId } = useAuth();
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchChannels = async () => {
      if (userId) {
        const response = await axios.get(`${API_URL}/channels/${userId}`);
        setServer(response.data);
      }
    };
    fetchChannels();
  }, [API_URL, userId]);

  return (
    <div className="w-[72px] bg-[#202225] flex flex-col items-center py-3 space-y-2">
      <div className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer">
        <MessageSquare className="w-6 h-6 text-[#dcddde]" />
      </div>
      <div className="w-12 h-[2px] bg-[#36393f] rounded-full" />
      {server?.length > 0 &&
        server.map((serv: Server) => (
          <a
            key={serv.id}
            href={`/channels/${serv.id}`}
            className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <div className="w-6 h-6 text-[#dcddde]">
              {serv.name.charAt(0).toUpperCase()}
            </div>
          </a>
        ))}
      <div className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer">
        <Plus className="w-6 h-6 text-[#3ba55d]" />
      </div>
    </div>
  );
};

export default ServerSidebar;
