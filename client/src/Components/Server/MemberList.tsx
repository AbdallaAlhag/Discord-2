import axios from "axios";
import { useEffect, useRef, useState } from "react";
import MiniProfileModal from "../PopupModals/MiniProfileModal";

interface MemberListProps {
  serverId: string;
}

// I'll to change this later as serverMembers in schema will need to be changed also
interface serverUserInfo {
  userId: number;
  user: {
    username: string;
    onlineStatus: boolean;
    avatarUrl: string;
  };
  // username: string;
  // avatarUrl: string | null;
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MemberList: React.FC<MemberListProps> = function ({ serverId }) {
  const [serverUserInfo, setServerUserInfo] = useState<serverUserInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<serverUserInfo | null>();
  const [modalPosition, setModalPosition] = useState({ top: 0 });
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  const handleCardClick = (user: serverUserInfo, event: React.MouseEvent) => {
    const clickedElement = event.currentTarget;
    const rect = clickedElement.getBoundingClientRect();
    const parentRect = clickedElement.parentElement?.getBoundingClientRect();

    if (parentRect) {
      // Calculate position relative to the member list container
      const topPosition = rect.top - parentRect.top;
      setModalPosition({ top: topPosition });
    }

    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // Return focus to the last clicked element
    if (lastFocusedElement.current) {
      lastFocusedElement.current.focus();
    }
  };

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const onlineStatusDependency = serverUserInfo
    .map((user) => user.user.onlineStatus)
    .join(",");

  // grab server members
  useEffect(() => {
    const fetchServerUsers = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_BASE_URL}/server/channels/${Number(serverId)}`
        );
        // console.log("server response: ", response);
        // console.log("servername: ", response.data.name);
        setServerUserInfo(response.data.members);
        // console.log("members: ", response.data.members);
        // console.log("channels: ", response.data);
      } catch (error) {
        console.error("Error fetching channels", error);
      }
    };

    fetchServerUsers();

    // //  don't want to incorpate ws so easy way to just poll for updates
    // const interval = setInterval(() => {
    //   fetchServerUsers();
    // }, 5000); // Poll every 5 seconds

    // return () => clearInterval(interval);

    // onlineStatusDependency is similar to polling for updates
  }, [serverId, onlineStatusDependency]);

  return (
    <div className="w-60 bg-[#2f3136] p-4 hidden lg:block ">
      {/* <div className="w-60 bg-[#2f3136] p-4"> */}
      <h3 className="text-[#8d949d] uppercase text-xs font-semibold mb-4">
        Online —{" "}
        {
          serverUserInfo.filter((user) => user.user.onlineStatus === true)
            .length
        }
      </h3>
      {serverUserInfo
        .filter((user) => user.user.onlineStatus === true)
        .map((user) => (
          <div
            key={user.userId}
            className="flex items-center mb-1 cursor-pointer hover:bg-[#36393f] p-2 rounded"
            onClick={(e) => handleCardClick(user, e)}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen && selectedUser?.userId === user.userId}
          >
            <div className="relative w-8 h-8">
              {/* <!-- Avatar --> */}
              <img
                src={user.user.avatarUrl}
                alt="user avatar"
                className="w-full h-full rounded-full"
              />
              {/* <!-- Status Indicator --> */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#23a55a] rounded-full border-2 border-[#2f3136]"></div>
            </div>
            <span className="text-[#dcddde] ml-2">{user.user.username}</span>
          </div>
        ))}
      <h3 className="text-[#8d949d] uppercase text-xs font-semibold mb-4">
        Offline —{" "}
        {
          serverUserInfo.filter((user) => user.user.onlineStatus === false)
            .length
        }
      </h3>
      {serverUserInfo
        .filter((user) => user.user.onlineStatus === false)
        .map((user) => (
          <div
            key={user.userId}
            className="flex items-center mb-3 cursor-pointer hover:bg-[#36393f] p-2 rounded"
            onClick={(e) => handleCardClick(user, e)}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen && selectedUser?.userId === user.userId}
          >
            <div className="relative w-8 h-8">
              {/* <!-- Avatar --> */}
              <img
                src={user.user.avatarUrl}
                alt="user avatar"
                className="w-full h-full rounded-full"
              />
              {/* <!-- Status Indicator --> */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#7d818b] rounded-full border-2 border-[#2f3136]"></div>
            </div>
            <span className="text-[#dcddde] ml-2">{user.user.username}</span>
          </div>
        ))}
      {/* Profile Modal */}
      <MiniProfileModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        user={selectedUser || null}
        style={{ top: modalPosition.top }}
      />
    </div>
  );
};

export default MemberList;
