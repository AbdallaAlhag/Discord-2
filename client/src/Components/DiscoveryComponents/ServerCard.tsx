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

interface ServerCardProps {
  server: Server;
}

interface ServerHeaderProps {
  name: string;
  iconUrl: string;
}

interface ServerStatsProps {
  membersOnline: number;
  totalMembers: number;
}

export const ServerCard = ({ server }: ServerCardProps) => {
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
          membersOnline={
            server.members.filter((member) => member.user.online).length
          }
          totalMembers={server.members.length}
        />
      </div>
    </div>
  );
};
const ServerStats = ({ membersOnline, totalMembers }: ServerStatsProps) => {
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
