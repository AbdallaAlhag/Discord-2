import { MessageSquare, Phone, Video, MoreVertical } from "lucide-react";

export function FriendsList() {
  const friends = [
    {
      id: 1,
      name: "viperndgrass",
      status: "Online",
      activity: "Playing Valorant",
    },
    {
      id: 2,
      name: "Admiral Audacious",
      status: "Online",
      activity: "In Voice Channel",
    },
    {
      id: 3,
      name: "Ethanqg",
      status: "Online",
      activity: "Visual Studio Code",
    },
    { id: 4, name: "Abwbkr Alhag", status: "Online", activity: "Spotify" },
    { id: 5, name: "aotmika", status: "Online", activity: "League of Legends" },
    { id: 6, name: "qwertea", status: "Online", activity: "In Voice Channel" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-2">
        <h2 className="text-[#B9BBBE] text-xs font-semibold uppercase mb-2">
          Online — {friends.length}
        </h2>
        {friends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center p-2 hover:bg-[#42464D] rounded cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#36393f] relative">
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#3ba55d] rounded-full border-2 border-[#2f3136]" />
            </div>
            <div className="ml-3 flex-1">
              <div className="text-white text-sm font-medium">
                {friend.name}
              </div>
              <div className="text-[#B9BBBE] text-xs">{friend.activity}</div>
            </div>
            <div className="hidden group-hover:flex items-center space-x-3">
              <button className="w-8 h-8 rounded-full hover:bg-[#36393f] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#B9BBBE]" />
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-[#36393f] flex items-center justify-center">
                <Phone className="w-5 h-5 text-[#B9BBBE]" />
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-[#36393f] flex items-center justify-center">
                <Video className="w-5 h-5 text-[#B9BBBE]" />
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-[#36393f] flex items-center justify-center">
                <MoreVertical className="w-5 h-5 text-[#B9BBBE]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
