import { Users, Plus } from "lucide-react";

interface DirectMessage {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "idle" | "dnd";
  isGroup?: boolean;
  memberCount?: number;
}

const directMessages: DirectMessage[] = [
  { id: "1", name: "viperndgrass", avatar: "🎮", status: "online" },
  { id: "2", name: "Admiral Audacious", avatar: "👤", status: "online" },
  { id: "3", name: "Ethanqg", avatar: "💻", status: "offline" },
  { id: "4", name: "Abwbkr Alhag", avatar: "🎯", status: "idle" },
  {
    id: "5",
    name: "LeetCode",
    avatar: "📚",
    status: "online",
    isGroup: true,
    memberCount: 5,
  },
  { id: "6", name: "aj", avatar: "🎮", status: "dnd" },
  { id: "7", name: "aotmika", avatar: "🎨", status: "online" },
  { id: "8", name: "SamFieri", avatar: "🔥", status: "offline" },
  { id: "9", name: "qwertea", avatar: "☕", status: "online" },
];

function StatusIndicator({ status }: { status: DirectMessage["status"] }) {
  const statusColors = {
    online: "bg-[#3ba55d]",
    offline: "bg-[#747f8d]",
    idle: "bg-[#faa81a]",
    dnd: "bg-[#ed4245]",
  };

  return (
    <div
      className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-[#2f3136]`}
    />
  );
}

export default function Sidebar() {
  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      <div className="h-12 shadow-md flex items-center px-4">
        <input
          type="text"
          placeholder="Find or start a conversation"
          className="w-full bg-[#202225] text-[#dcddde] text-sm rounded px-2 py-1 focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pt-4">
        <div className="px-2">
          <button className="w-full flex items-center px-2 py-1 text-[#dcddde] hover:bg-[#42464D] rounded group">
            <Users className="w-5 h-5 mr-4" />
            <span className="text-sm">Friends</span>
          </button>
        </div>

        <div className="px-2 pt-4">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="text-[#96989d] uppercase font-semibold">
              Direct Messages
            </span>
            <Plus className="w-4 h-4 text-[#96989d] hover:text-[#dcddde] cursor-pointer" />
          </div>

          <div className="mt-2 space-y-0.5">
            {directMessages.map((dm) => (
              <button
                key={dm.id}
                className="w-full flex items-center px-2 py-1 text-[#96989d] hover:text-[#dcddde] hover:bg-[#42464D] rounded group"
              >
                <div className="w-8 h-8 rounded-full bg-[#36393f] flex items-center justify-center relative mr-3">
                  <span>{dm.avatar}</span>
                  <StatusIndicator status={dm.status} />
                </div>
                <span className="text-sm flex-1 text-left truncate">
                  {dm.name}
                  {dm.isGroup && (
                    <span className="text-xs text-[#96989d] ml-1">
                      ({dm.memberCount})
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-14 bg-[#292b2f] px-2 flex items-center mt-auto">
        <div className="w-8 h-8 rounded-full bg-[#36393f] mr-2 relative">
          <StatusIndicator status="online" />
        </div>
        <div className="flex-1">
          <div className="text-white text-sm font-medium">User</div>
          <div className="text-[#b9bbbe] text-xs">#0001</div>
        </div>
      </div>
    </div>
  );
}
