import { useState, useEffect } from "react";
// import { MessageSquare, Plus } from "lucide-react";
import { MessageSquare, ArrowDownToLine } from "lucide-react";
import { ServerCreation } from "./PopupModals/ServerCreation";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Import required CSS

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
      <div className="group relative">
        <div className="relative">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-5 w-1 bg-white rounded-r transition-all duration-200 opacity-0 group-hover:h-10 group-hover:opacity-100 group-active:h-full" />
          <Link to="/">
            <div
              className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer"
              data-tooltip-id={`tooltip-home`} // Link element to tooltip
              data-tooltip-content={"Direct Messages"}
            >
              <MessageSquare className="w-6 h-6 text-[#dcddde]" />
              <Tooltip
                id={`tooltip-home`}
                place="right"
                className="z-10  ml-2.5"
                style={{
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </div>
          </Link>
        </div>
      </div>

      <div className="w-12 h-[2px] bg-[#36393f] rounded-full" />
      {server?.length > 0 &&
        server.map((serv: Server) => (
          <div key={serv.id}>
            <div className="group relative">
              <div className="relative">
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 group-hover:h-10 h-5 w-1 bg-white rounded-r transition-all duration-200 opacity-0 group-hover:opacity-100" />
                <Link
                  key={serv.id}
                  to={`/server/${serv.id}/${serv.channels[0].id}`}
                  className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer "
                  data-tooltip-id={`tooltip-${serv.id}`} // Link element to tooltip
                  data-tooltip-content={serv.name} // Tooltip content dynamically
                >
                  <div className="w-6 h-6 text-[#dcddde] text-center">
                    {serv.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <Tooltip
                  id={`tooltip-${serv.id}`}
                  place="right"
                  className="z-10  ml-2.5"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      <div className="group relative">
        <div className="relative">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 group-hover:h-10 h-5 w-1 bg-white rounded-r transition-all duration-200 opacity-0 group-hover:opacity-100" />
          <div
            className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer"
            data-tooltip-id={`tooltip-create`} // Link element to tooltip
            data-tooltip-content={"Add a Server"}
          >
            <ServerCreation />
            <Tooltip
              id={`tooltip-create`}
              place="right"
              className="z-10  ml-2.5"
              style={{
                backgroundColor: "black",
                color: "#3b9c5b",
                fontWeight: "bold",
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-12 h-[2px] bg-[#36393f] rounded-full" />
      <div className="group relative">
        <div className="relative">
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 group-hover:h-10 h-5 w-1 bg-white rounded-r transition-all duration-200 opacity-0 group-hover:opacity-100" />
          <div
            className="w-12 h-12 bg-[#36393f] rounded-[24px] hover:rounded-[16px] transition-all duration-200 flex items-center justify-center cursor-pointer"
            data-tooltip-id={`tooltip-download`} // Link element to tooltip
            data-tooltip-content={"Download Apps"}
          >
            <ArrowDownToLine color="#3b9c5b" />
            <Tooltip
              id={`tooltip-download`}
              place="right"
              className="z-10  ml-2.5"
              style={{
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerSidebar;
