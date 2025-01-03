import { useEffect, useState } from "react";
import { ServerCard } from "./ServerCard";
import axios from "axios";
import { useAuth } from "../../AuthContext";
interface Server {
  id: string;
  name: string;
  iconUrl: string;
  members: {
    user: {
      onlineStatus: boolean;
      id: string;
    };
  }[];
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const ServerGrid = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const { userId } = useAuth();
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/server/servers`);
        
        console.log("response: ", response.data);
        setServers(response.data);
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };
    fetchServers();
  }, []);
  return (
    <section className="py-16 ">
      <div className="max-w-7.5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Servers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} userId={userId} />
          ))}
        </div>
      </div>
    </section>
  );
};
