import { useState, useEffect } from "react";
// import { MessageSquare, Plus } from "lucide-react";
import { MessageSquare } from "lucide-react";
import { ServerCreation } from "./PopupModals/ServerCreation";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";

interface Server {
  channels: { id: number; name: string; iconUrl: string; createdAt: Date }[];
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
    const fetchServers = async () => {
      if (userId) {
        try {
          const response = await axios.get(`${API_URL}/servers/${userId}`);
          setServer(response.data.servers);
          console.log("servers: ", response.data.servers);
        } catch (error) {
          console.error("Error fetching servers", error);
        }
      }
    };
    fetchServers();
  }, [API_URL, userId]);

  return (
    <div className="w-[72px] bg-[#202225] flex flex-col items-center py-3 space-y-2">
      <Link to="/">
        <div className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer">
          <MessageSquare className="w-6 h-6 text-[#dcddde]" />
        </div>
      </Link>
      <div className="w-12 h-[2px] bg-[#36393f] rounded-full" />
      {server?.length > 0 &&
        server.map((serv: Server) => (
          <Link
            key={serv.id}
            to={`/server/${serv.id}/${serv.channels[0].id}`}
            className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <div className="w-6 h-6 text-[#dcddde]">
              {serv.name.charAt(0).toUpperCase()}
            </div>
          </Link>
        ))}
      <div className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer">
        <ServerCreation />
      </div>
    </div>
  );
};

export default ServerSidebar;
