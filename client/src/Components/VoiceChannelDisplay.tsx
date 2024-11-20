import {
  Volume2,
  Users,
  Layout,
  MoreHorizontal,
  MessageSquare,
  Mic,
  Video,
  MonitorSpeaker,
  PhoneOff,
} from "lucide-react";

interface VideoAreaProps {
  username: string;
  avatarUrl: string;
}

function Header() {
  return (
    <div className="h-12 bg-[black] border-b border-[black] flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Volume2 className="text-[#949ba4]" size={20} />
        <span className="text-white font-medium">General</span>
      </div>
      <div className="flex items-center gap-4">
        <Users
          className="text-[#949ba4] hover:text-white cursor-pointer"
          size={20}
        />
        <Layout
          className="text-[#949ba4] hover:text-white cursor-pointer"
          size={20}
        />
        <MessageSquare
          className="text-[#949ba4] hover:text-white cursor-pointer"
          size={20}
        />
        <MoreHorizontal
          className="text-[#949ba4] hover:text-white cursor-pointer"
          size={20}
        />
      </div>
    </div>
  );
}

function VideoArea({ username, avatarUrl }: VideoAreaProps) {
  return (
    <div className="relative flex-1 bg-[#a08c84]">
      <img
        src={avatarUrl}
        alt={username}
        className="absolute bottom-4 left-4 w-10 h-10 rounded-full border-2 border-[#292b2f]"
      />
      <div className="absolute bottom-4 left-16 bg-black/50 px-2 py-1 rounded text-white text-sm">
        {username}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 bg-[black] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-white text-xl font-medium mb-2">
          You're the only one here. Invite a friend to start chatting.
        </h2>
        <p className="text-[#949ba4] mb-6">
          Choose an Activity to play, watch, or collaborate together.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-[#4e5058] text-white px-4 py-2 rounded-md hover:bg-[#6d6f78] transition-colors">
            Invite Friends
          </button>
          <button className="bg-[#5865f2] text-white px-4 py-2 rounded-md hover:bg-[#4752c4] transition-colors">
            Choose an Activity
          </button>
        </div>
      </div>
    </div>
  );
}

function Controls() {
  return (
    <div className="h-16 bg-[black] flex items-center justify-center gap-2 px-4">
      <div className="flex-1" />
      <button className="p-3 rounded-full bg-[#36373d] text-[#949ba4] hover:bg-[#4e5058] hover:text-white transition-colors">
        <Mic size={20} />
      </button>
      <button className="p-3 rounded-full bg-[#36373d] text-[#949ba4] hover:bg-[#4e5058] hover:text-white transition-colors">
        <Video size={20} />
      </button>
      <button className="p-3 rounded-full bg-[#36373d] text-[#949ba4] hover:bg-[#4e5058] hover:text-white transition-colors">
        <MonitorSpeaker size={20} />
      </button>
      <button className="p-3 rounded-full bg-[#36373d] text-[#949ba4] hover:bg-[#4e5058] hover:text-white transition-colors">
        <Users size={20} />
      </button>
      <div className="flex-1 flex justify-end">
        <button className="p-3 rounded-full bg-[#ed4245] text-white hover:bg-[#c03537] transition-colors">
          <PhoneOff size={20} />
        </button>
      </div>
    </div>
  );
}

function VoiceChannelDisplay() {
  const user = {
    username: "Abdalla",
    avatarUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[black]">
      <Header />
      <div className="flex-1 flex">
        <VideoArea username={user.username} avatarUrl={user.avatarUrl} />
        <EmptyState />
      </div>
      <Controls />
    </div>
  );
}

export default VoiceChannelDisplay;
