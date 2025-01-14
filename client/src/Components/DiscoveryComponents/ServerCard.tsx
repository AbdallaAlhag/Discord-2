import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

interface ServerCardProps {
  server: Server;
  userId: string | null;
}

interface ServerHeaderProps {
  name: string;
  iconUrl: string;
}

interface ServerStatsProps {
  membersOnline: number;
  totalMembers: number;
  isMember: boolean;
  userId: string | null;
  serverId: string | null;
  serverGeneralChannel: serverChannel[];
}

interface serverChannel {
  id: string;
}
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ServerCard = ({ server, userId }: ServerCardProps) => {
  const [serverGeneralChannel, setServerGeneralChannel] = useState<
    serverChannel[]
  >([]);

  useEffect(() => {
    const fetchServersGeneralChannel = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/server/channels/${server.id}`
        );

        // console.log("response: ", response.data.channels[0].id);
        setServerGeneralChannel(response.data.channels[0].id);
      } catch (error) {
        console.error("Error fetching servers:", error);
      }
    };
    fetchServersGeneralChannel();
  }, [server.id]);
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:translate-y-[-4px]">
      <img
        src={"https://picsum.photos/seed/" + server.id + "/400/200"}
        alt={`${server.name} banner`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <ServerHeader
          name={server.name}
          iconUrl={
            server.iconUrl ||
            "https://picsum.photos/seed/" + server.id + "/400/200"
          }
        />
        <ServerStats
          serverId={server.id}
          serverGeneralChannel={serverGeneralChannel}
          membersOnline={
            server.members.filter((member) => member.user.onlineStatus).length
          }
          totalMembers={server.members.length}
          isMember={server.members.some((member) => member.user.id === userId)}
          userId={userId}
        />
      </div>
    </div>
  );
};
const ServerStats = ({
  membersOnline,
  totalMembers,
  userId,
  isMember,
  serverId,
  serverGeneralChannel,
}: ServerStatsProps) => {
  async function joinServer() {
    try {
      await axios.post(`${BASE_URL}/server/join/${userId}/${serverId}`);
      window.location.href = `/server/${serverId}/${serverGeneralChannel}`;
    } catch (error) {
      console.error("Error fetching servers:", error);
    }
  }
  return (
    <div className="flex space-x-4 text-sm text-gray-400">
      <span className="flex items-center">
        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
        {formatNumber(membersOnline)} Online
      </span>
      <span className="flex items-center">
        <span className="w-4 h-4 text-gray-400 mr-1">👥</span>
        {formatNumber(totalMembers)} Members
      </span>
      {!isMember ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => joinServer()}
        >
          Join
        </button>
      ) : (
        <Link to={`/server/${serverId}/${serverGeneralChannel}`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Open
          </button>
        </Link>
      )}
    </div>
  );
};

const ServerHeader = ({ name, iconUrl }: ServerHeaderProps) => {
  return (
    <div className="flex items-center space-x-3 mb-4">
      <img
        src={iconUrl}
        alt={`${name} icon`}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h3 className="text-xl font-semibold text-white flex items-center">
          {name}
        </h3>
      </div>
    </div>
  );
};

const formatNumber = (num: number): string => {
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return formatter.format(num);
};
