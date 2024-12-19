import { useEffect, useState } from "react";
import { ServerCard } from "./ServerCard";
import axios from "axios";

interface Server {
  id: string;
  name: string;
  iconUrl: string;
  members: {
    user: {
      online: boolean;
    };
  }[];
}

// const featuredServers: Server[] = [
//   {
//     id: "1",
//     name: "Midjourney",
//     description:
//       "The official server for Midjourney, a text-to-image AI where your imagination is the only limit.",
//     imageUrl: "/images/midjourney-banner.jpg",
//     iconUrl: "/images/midjourney-icon.png",
//     membersOnline: 1281589,
//     totalMembers: 21129805,
//     isVerified: true,
//   },
//   {
//     id: "2",
//     name: "Marvel Rivals",
//     description:
//       "The official Discord server of the game Marvel Rivals! Find the latest news and discuss the upcoming game!",
//     imageUrl: "/images/marvel-banner.jpg",
//     iconUrl: "/images/marvel-icon.png",
//     membersOnline: 633554,
//     totalMembers: 1942995,
//     isVerified: true,
//   },
//   // Add more servers as needed
// ];

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const ServerGrid = () => {
  const [servers, setServers] = useState<Server[]>([]);

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
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Servers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      </div>
    </section>
  );
};
