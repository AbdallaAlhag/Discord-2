import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { Socket } from "socket.io-client";
import { useWebRTCContext } from "../../WebRTC/useWebRTCContext";
import { useAuth } from "@/AuthContext";
import { Link } from "react-router-dom";

// modals
import ChannelModal from "../PopupModals/CreateChannelModal";
import InviteModal from "../InviteModal/InviteModal";
import DeleteServerModal from "../PopupModals/DeleteServerModal";
import LeaveServerModal from "../PopupModals/LeaveServerModal";

import ServerMenu from "./ServerMenu";
import SettingsButton from "../Profile/SettingsButton";

import defaultAvatar from "../../assets/default-avatar.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
import { Hash, Plus, Volume2 } from "lucide-react";
import {
  AudioLines,
  PhoneOff,
  Signal,
  // Dot,
  VideoOff,
  Video,
  ScreenShare,
  Headphones,
  HeadphoneOff,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css"; // Import required CSS

interface onlineUsers {
  id: number;
  username: string;
  avatarUrl: null | string;
  // I'll just find out only the role for the current server
  // memberships: {
  //   role: "OWNER" | "ADMIN" | "MEMBER";
  //   server: {
  //     iconUrl: null | string;
  //     name: string;
  //   }[];
  //   serverId: number;
  // }[];
  role: "OWNER" | "ADMIN" | "MEMBER";
}

type ChannelInfo = {
  id: number;
  serverId: number;
  name: string;
  isVoice: boolean;
  createdAt: Date;
}[];

type SingleChannelInfo = {
  id: number;
  serverId: number;
  name: string;
  isVoice: boolean;
  createdAt: Date;
};

interface MenuActionsProps {
  onInvitePeople: () => void;
  onDeleteServer: () => void;
  onCreateChannel: () => void;
  onLeaveServer: () => void;
  // onCreateChannel: () => void;
  // Add other action handlers as needed
}

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChannelSidebar: React.FC<{
  serverId: string;
  channelId: string;
  setIsVoiceChannelDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  ChannelWebRTC: React.FC;
  socket: Socket;
  handleVoiceChannelSelect: (channelId: SetStateAction<number | null>) => void;
}> = ({
  serverId,
  channelId,
  setIsVoiceChannelDisplay,
  ChannelWebRTC,
  socket,
  handleVoiceChannelSelect,
}) => {
  const [channelInfo, setChannelInfo] = useState<ChannelInfo>([]);
  const [serverName, setServerName] = useState("");
  const [user, setUser] = useState<onlineUsers | null>(null);
  const { userId } = useAuth();

  // Modals
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] =
    useState(false); // State to control the modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false); // For invite modal
  const [isServerDeleteModalOpen, setIsServerDeleteModalOpen] = useState(false);
  const [isLeaveServerModalOpen, setIsLeaveServerModalOpen] = useState(false);

  const [channelUpdate, setChannelUpdate] = useState(0); // Track channel changes
  // webRtc
  const [selectedVoiceChannel, setSelectedVoiceChannel] =
    useState<SingleChannelInfo>();
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  // starting video on atm

  // Example invite link (customize based on your requirements)
  const inviteLink = `${VITE_API_BASE_URL}/server/${serverId}/${channelId}`;
  const {
    isVideoOff,
    setIsVideoOff,
    isMuted,
    setIsMuted,
    isDeafened,
    setIsDeafened,
    disInitializeMedia,
    toggleMute,
    toggleVideo,
    toggleDeafen,
  } = useWebRTCContext();

  const closePictureInPicture = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch((error) => {
        console.error("Error exiting PiP:", error);
      });
    }
  };

  const handleCreateChannel = async (data: {
    name: string;
    type: "text" | "voice";
    isPrivate: boolean;
  }) => {
    // Logic to create a new channel
    // console.log("Channel created:", data);
    try {
      await axios.post(`${VITE_API_BASE_URL}/server/createChannel`, {
        data,
        serverId: Number(serverId),
      });
      // console.log(response);
      setChannelUpdate((prev) => prev + 1); // Update channel state
    } catch (error) {
      console.error("Error creating channel:", error);
    }
    setIsCreateChannelModalOpen(false);
  };
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${VITE_API_BASE_URL}/user/${userId}`);
        const userData = response.data.user;
        const membership = userData.memberships.find(
          (membership: { serverId: number }) =>
            membership.serverId === Number(serverId)
        );
        setUser({
          id: userData.id,
          username: userData.username,
          avatarUrl: userData.avatarUrl,
          role: membership.role, // Extract the role
        });
      } catch (err) {
        console.error("Error fetching user ", err);
      }
    };

    const fetchChannels = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_BASE_URL}/server/channels/${Number(serverId)}`
        );
        // console.log("server response: ", response);
        // console.log("servername: ", response.data.name);
        setChannelInfo(response.data.channels);
        setServerName(response.data.name);
        // console.log("channels: ", response.data);
      } catch (error) {
        console.error("Error fetching channels", error);
      }
    };
    fetchUser();
    fetchChannels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId, userId, channelUpdate]);


  const handleCreateChannelOpenModal = () => setIsCreateChannelModalOpen(true);
  const handleCreateChannelCloseModal = () =>
    setIsCreateChannelModalOpen(false);

  const handleOpenServerDeleteModal = () => setIsServerDeleteModalOpen(true);
  const handleCloseServerDeleteModal = () => setIsServerDeleteModalOpen(false);

  const handleLeaveServer = () => setIsLeaveServerModalOpen(true);
  const handleCloseLeaveServerModal = () => {
    setIsLeaveServerModalOpen(false);
    window.location.href = "/";
  };
  // Functions to handle modal open/close
  const handleOpenInviteModal = () => setIsInviteModalOpen(true);
  const handleCloseInviteModal = () => setIsInviteModalOpen(false);

  const MenuActions: MenuActionsProps = {
    onInvitePeople: handleOpenInviteModal,
    onDeleteServer: handleOpenServerDeleteModal,
    onCreateChannel: handleCreateChannelOpenModal,
    onLeaveServer: handleLeaveServer,
    // etc...
    // OnCreateChannel:
  };
  return (
    <div className="w-60 bg-[#2f3136] flex flex-col">
      {/* server name */}
      <div className="h-12 flex items-center justify-between ">
        <ServerMenu serverName={serverName} menuActions={MenuActions} role={user?.role}/>
      </div>
      {/* channels */}
      <div className="flex-1 overflow-y-auto ">
        <div className="px-2 mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#72767d]">
              TEXT CHANNELS
            </span>
            <button
              onClick={handleCreateChannelOpenModal}
              className="text-[#b9bbbe] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
            </button>
          </div>
          {/* list */}
          {Object.entries(channelInfo)
            .filter(([, channel]) => !channel.isVoice)
            .map(([, channel]) => (
              <Link
                to={`/server/${serverId}/${channel.id}`}
                key={channel.id}
                className="flex items-center justify-between px-2 py-1  rounded-md hover:bg-[#40444b] cursor-pointer transition-all"
                onClick={() => {
                  if (isVoiceModalOpen && selectedVoiceChannel) {
                    setIsVoiceChannelDisplay(false);
                  }
                }}
              >
                <div className="flex items-center space-x-2 text-[#8e9297]">
                  <Hash className="w-5 h-5 mr-1.5" />
                  <span className=" text-white">{channel.name}</span>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <button className="text-[#b9bbbe] hover:text-white">
                    <Settings className="w-4 h-4" />
                  </button>
                </div> */}
              </Link>
            ))}
          <div className="flex items-center justify-between my-2">
            <span className="text-xs font-bold text-[#72767d]">
              VOICE CHANNELS
            </span>
            <button
              onClick={handleCreateChannelOpenModal}
              className="text-[#b9bbbe] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
            </button>
          </div>
          {/* {Object.entries(channelInfo)
            .filter(([, channel]) => channel.isVoice)
            .map(([, channel]) => (
              <Link
                to={`/server/${serverId}/${channel.id}`}
                key={channel.id}
                className="flex items-center justify-between px-2 py-1  rounded-md hover:bg-[#40444b] cursor-pointer transition-all"
              >
                <div className="flex items-center space-x-2 text-[#8e9297]">
                  <Volume2 className="w-5 h-5 mr-1.5" />
                  <span className=" text-white">{channel.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-[#b9bbbe] hover:text-white">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))} */}
          {Object.entries(channelInfo)
            .filter(([, channel]) => channel.isVoice)
            .map(([, channel]) => (
              <div
                key={channel.id}
                className="flex items-center justify-between   "
                onClick={() => {
                  // Open voice/video chat modal or navigate to voice channel
                  setSelectedVoiceChannel(channel);
                  setIsVoiceModalOpen(true);
                  if (isVoiceModalOpen && selectedVoiceChannel) {
                    setIsVoiceChannelDisplay(true);
                    closePictureInPicture();
                  }
                  // send channelId up to server page to use as webrtc channel id
                  handleVoiceChannelSelect(channel.id);
                }}
              >
                <div className="flex flex-col w-full items-start ">
                  <div className="flex items-center space-x-2 text-[#8e9297] rounded-md hover:bg-[#40444b] cursor-pointer px-2 py-1 w-full transition-all">
                    <Volume2 className="w-5 h-5 mr-1.5" />
                    <span className="text-white">{channel.name}</span>
                  </div>
                  {/* Voice Channel Modal */}
                  {isVoiceModalOpen &&
                    selectedVoiceChannel &&
                    socket &&
                    channel.name == selectedVoiceChannel.name && (
                      <ChannelWebRTC />
                    )}
                </div>
              </div>
            ))}
        </div>
      </div>
      {isVoiceModalOpen && selectedVoiceChannel && (
        <div className=" bg-[#232428] flex flex-col items-end mb-1">
          <div className="w-full h-12 bg-[#232428] px-2 flex items-center justify-between gap-1">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <Signal color="#2cc76f" size={25} />
                <p className="text-[#2cc76f] text-xs font-semibold ">
                  Voice Connected
                </p>
              </div>
              <div className="text-[#b9bbbe] text-xs cursor-pointer hover:underline truncate max-w-[20ch]">
                {selectedVoiceChannel.name} / {serverName}
              </div>
            </div>
            {/* Control Icons */}
            <button
              className="p-2 text-[#b9bbbe] hover:bg-[#383a40] rounded-md transition-colors"
              data-tooltip-id={`tooltip-noise-suppression`}
              data-tooltip-content={"Noise Suppression Powered By Nothing lol"}
            >
              <AudioLines size={20} />
              <Tooltip
                id="tooltip-noise-suppression"
                place="top"
                className="z-10 "
                style={{
                  backgroundColor: "black",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            </button>
            <button
              className="p-2 text-[#b9bbbe] hover:bg-[#383a40] rounded-md transition-colors"
              data-tooltip-id={`tooltip-disconnect`}
              data-tooltip-content={"Disconnect"}
            >
              <PhoneOff
                size={20}
                onClick={() => {
                  // Open voice/video chat modal or navigate to voice channel
                  setIsVoiceModalOpen(false);
                  setIsVoiceChannelDisplay(false);
                  disInitializeMedia();
                }}
              />
              <Tooltip
                id="tooltip-disconnect"
                place="top"
                className="z-10 "
                style={{
                  backgroundColor: "black",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            </button>
          </div>

          {/* Additional Controls Panel */}
          <div className=" w-full h-14 bg-[#232428] shadow-lg p-2 flex justify-start gap-1">
            <button
              className={`p-2 px-4 text-[white] rounded-md transition-colors ${
                isVideoOff ? "bg-[#383a40]" : "bg-[#23a55a]"
              }`}
            >
              {isVideoOff ? (
                <>
                  <VideoOff
                    size={20}
                    onClick={() => {
                      toggleVideo();
                      setIsVideoOff(!isVideoOff);
                    }}
                    data-tooltip-id={`tooltip-video-off`}
                    data-tooltip-content={"Turn On Camera"}
                  />
                  <Tooltip
                    id="tooltip-video-off"
                    place="top"
                    className="z-10 "
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                </>
              ) : (
                <>
                  <Video
                    size={20}
                    style={{ background: "#23a55a" }}
                    onClick={() => {
                      toggleVideo();
                      setIsVideoOff(!isVideoOff);
                    }}
                    data-tooltip-id={`tooltip-video-on`}
                    data-tooltip-content={"Turn Off Camera"}
                  />
                  <Tooltip
                    id="tooltip-video-on"
                    place="top"
                    className="z-10 "
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                </>
              )}
            </button>
            <button
              className="p-2 px-4 text-[white] bg-[#383a40] rounded-md transition-colors"
              data-tooltip-id={`tooltip-share-screen`}
              data-tooltip-content={"Share Your Screen"}
            >
              <ScreenShare size={20} />
              <Tooltip
                id="tooltip-share-screen"
                place="top"
                className="z-10 "
                style={{
                  backgroundColor: "black",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            </button>
            {/* <button className="p-2 px-4 text-[white] bg-[#383a40] rounded-md transition-colors">
              <Dot size={20} />
            </button>
            <button className="p-2 px-4 text-[white] bg-[#383a40] rounded-md transition-colors">
              <Dot size={20} />
            </button> */}
          </div>
        </div>
      )}
      {/* profile */}
      <div className="h-14 bg-[#232428] px-2 flex items-center mt-auto gap-1">
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
        <FontAwesomeIcon
          icon={!isMuted ? faMicrophone : faMicrophoneSlash}
          className="p-2 hover:bg-[#383a40] cursor-pointer rounded-sm"
          style={{ color: isMuted ? "#f23f43" : "#959ba7" }}
          onClick={() => {
            toggleMute();
            setIsMuted(!isMuted);
          }}
          data-tooltip-id={`tooltip-mic`}
          data-tooltip-content={
            isMuted ? "Turn on Microphone" : "Turn off microphone"
          }
        />
        <Tooltip
          id="tooltip-mic"
          place="top"
          className="z-10 "
          style={{
            backgroundColor: "black",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        />
        {/* <FontAwesomeIcon
          icon={faHeadphones}
          size="lg"
          className="p-2 hover:bg-[#383a40]  cursor-pointer rounded-sm"
          style={{ color: "#959ba7" }}
        /> */}
        {!isDeafened ? (
          <>
            <Headphones
              size={30}
              className="p-1 hover:bg-[#383a40]  cursor-pointer rounded-sm "
              style={{ color: "#959ba7" }}
              onClick={() => {
                toggleDeafen();
                setIsDeafened(!isDeafened);
              }}
              data-tooltip-id={`tooltip-headphones`}
              data-tooltip-content={"Deafen"}
            />
            <Tooltip
              id="tooltip-headphones"
              place="top"
              className="z-10 "
              style={{
                backgroundColor: "black",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
          </>
        ) : (
          <>
            <HeadphoneOff
              size={30}
              className="p-1 hover:bg-[#383a40]  cursor-pointer rounded-sm "
              style={{ color: "#f23f43" }}
              onClick={() => {
                toggleDeafen();
                setIsDeafened(!isDeafened);
              }}
              data-tooltip-id={`tooltip-headphones`}
              data-tooltip-content={"Undeafen"}
            />
            <Tooltip
              id="tooltip-headphones"
              place="top"
              className="z-10 "
              style={{
                backgroundColor: "black",
                color: "white",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
          </>
        )}
        <div
          className="hover:bg-[#383a40] rounded-sm"
          data-tooltip-id={`tooltip-settings`}
          data-tooltip-content={"User Settings"}
        >
          <SettingsButton className="hover:animate-spin  p-2 " />
          <Tooltip
            id="tooltip-settings"
            place="top"
            className="z-10 "
            style={{
              backgroundColor: "black",
              color: "white",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          />
        </div>
      </div>
      {/* Channel Creation Modal */}
      <ChannelModal
        isOpen={isCreateChannelModalOpen}
        onClose={handleCreateChannelCloseModal}
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

      <LeaveServerModal
        isOpen={isLeaveServerModalOpen}
        onClose={handleCloseLeaveServerModal}
        serverId={serverId}
        serverName={serverName}
        userId={userId}
      />
    </div>
  );
};

export default ChannelSidebar;
