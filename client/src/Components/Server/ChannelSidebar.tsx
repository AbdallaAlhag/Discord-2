import { Hash, Plus, Settings } from "lucide-react";
import SettingsButton from "../Profile/SettingsButton";
import LogoutButton from "../Profile/LogoutButton";
import { useEffect, useState } from "react";
import axios from "axios";
import ChannelModal from "../PopupModals/CreateChannelModal";
import InviteModal from "../InviteModal/InviteModal"; // Import InviteModal
import { useAuth } from "@/AuthContext";
import defaultAvatar from "../../assets/default-avatar.svg";
import { Link } from "react-router-dom";
import ServerMenu from "./ServerMenu";
import DeleteServerModal from "../PopupModals/DeleteServerModal";

interface onlineUsers {
  id: number;
  username: string;
  avatarUrl: null | string;
  status: "online" | "offline" | "idle" | "dnd";
  isGroup?: boolean;
  memberCount?: number;
}
type ChannelInfo = {
  id: number;
  serverId: number;
  name: string;
  isVoice: boolean;
  createdAt: Date;
}[];

interface MenuActionsProps {
  onInvitePeople: () => void;
  onDeleteServer: () => void;
  // onCreateChannel: () => void;
  // Add other action handlers as needed
}

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChannelSidebar: React.FC<{ serverId: string; channelId: string }> = ({
  serverId,
  channelId,
}) => {
  const [channelInfo, setChannelInfo] = useState<ChannelInfo>([]);
  const [serverName, setServerName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); // For invite modal
  const [isServerDeleteModalOpen, setIsServerDeleteModalOpen] = useState(false);

  const [channelUpdate, setChannelUpdate] = useState(0); // Track channel changes

  const [user, setUser] = useState<onlineUsers | null>(null);
  const { userId } = useAuth();

  // Example invite link (customize based on your requirements)
  const inviteLink = `${VITE_API_BASE_URL}/server/${serverId}/${channelId}`;
  const handleCreateChannel = async (data: {
    name: string;
    type: "text" | "voice";
    isPrivate: boolean;
  }) => {
    // Logic to create a new channel
    console.log("Channel created:", data);
    try {
      const response = await axios.post(
        `${VITE_API_BASE_URL}/server/createChannel`,
        {
          data,
          serverId: Number(serverId),
        }
      );
      console.log(response);
      setChannelUpdate((prev) => prev + 1); // Update channel state
    } catch (error) {
      console.error("Error creating channel:", error);
    }
    setIsModalOpen(false);
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${VITE_API_BASE_URL}/user/${userId}`);
        setUser(response.data.user);
        // console.log("user: ", response.data.user);
      } catch (err) {
        console.error("Error fetching user ", err);
      }
    };

    const fetchChannels = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_BASE_URL}/server/channels/${Number(serverId)}`
        );
        console.log("server response: ", response);
        console.log("servername: ", response.data.name);
        setChannelInfo(response.data.channels);
        setServerName(response.data.name);
        // console.log("channels: ", response.data);
      } catch (error) {
        console.error("Error fetching channels", error);
      }
    };
    fetchUser();
    fetchChannels();
  }, [serverId, userId, channelUpdate]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenServerDeleteModal = () => setIsServerDeleteModalOpen(true);
  const handleCloseServerDeleteModal = () => setIsServerDeleteModalOpen(false);

  // Functions to handle modal open/close
  const handleOpenInviteModal = () => setIsInviteModalOpen(true);
  const handleCloseInviteModal = () => setIsInviteModalOpen(false);

  const MenuActions: MenuActionsProps = {
    onInvitePeople: handleOpenInviteModal,
    onDeleteServer: handleOpenServerDeleteModal,
    // etc...
    // OnCreateChannel:
  };
  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      {/* server name */}
      <div className="h-12 flex items-center justify-between ">
        <ServerMenu serverName={serverName} menuActions={MenuActions} />
      </div>
      {/* channels */}
      <div className="flex-1 overflow-y-auto ">
        <div className="px-2 mt-4">
          {/* <p>TEXT CHANNELS + </p> */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#72767d]">
              TEXT CHANNELS
            </span>
            <button
              onClick={handleOpenModal}
              className="text-[#b9bbbe] hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {/* <div className="flex items-center px-2 text-[#8e9297] text-sm mb-1">
            <Hash className="w-5 h-5 mr-1.5" />
            <span>general</span>
          </div> */}
          {/* list */}
          {Object.entries(channelInfo).map(([, channel]) => (
            <Link
              to={`/server/${serverId}/${channel.id}`}
              key={channel.id}
              className="flex items-center justify-between px-2 py-1  rounded-md hover:bg-[#40444b] cursor-pointer transition-all"
            >
              <div className="flex items-center space-x-2 text-[#8e9297]">
                <Hash className="w-5 h-5 mr-1.5" />
                <span className=" text-white">{channel.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-[#b9bbbe] hover:text-white">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* profile */}
      <div className="h-14 bg-[#292b2f] px-2 flex items-center mt-auto">
        <img
          src={user?.avatarUrl || defaultAvatar}
          className="w-8 h-8 rounded-full mr-2"
          alt="User Avatar"
        />
        {/* <div className="w-8 h-8 rounded-full bg-[#36393f] mr-2 relative">
          <StatusIndicator status="online" />
        </div> */}
        <div className="flex-1">
          <div className="text-white text-sm font-medium">{user?.username}</div>
          <div className="text-[#b9bbbe] text-xs">#{user?.id}</div>
        </div>
        <LogoutButton className="pr-4 pt-1" />
        <SettingsButton />
      </div>
      {/* Channel Creation Modal */}
      <ChannelModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateChannel={handleCreateChannel}
      />
      {/* Invite Modal */}
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={handleCloseInviteModal}
        serverName={serverName}
        serverId={serverId}
        channelName={channelInfo[0]?.name || "general"} // Example, customize based on selected channel
        inviteLink={inviteLink}
      />

      <DeleteServerModal
        isOpen={isServerDeleteModalOpen}
        onClose={handleCloseServerDeleteModal}
        serverId={serverId}
        serverName={serverName}
      />
    </div>
  );
};

export default ChannelSidebar;
