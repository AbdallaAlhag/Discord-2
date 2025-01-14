import { Pencil, X, UserPlus, Handshake } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../AuthContext";
import ProfileModal from "../Profile/ProfileModal";
import axios from "axios";
import { Tooltip } from "react-tooltip";

interface MiniProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    userId: string;
    user: {
      username: string;
      onlineStatus: boolean;
      avatarUrl: string;
    };
  } | null;
  style?: React.CSSProperties;
}

const useClickAway = (handler: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handler]);

  return ref;
};
const API_URL = import.meta.env.VITE_API_BASE_URL;

function MiniProfileModal({
  isOpen,
  onClose,
  user,
  style,
}: MiniProfileModalProps) {
  const modalRef = useClickAway(onClose);
  const { userId } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [friendData, setFriendData] = useState<string[]>([]);
  useEffect(() => {
    if (!isOpen) {
      setShowProfileModal(false);
    }
  }, [isOpen]);
  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || showProfileModal) return;

    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTab);
    firstElement?.focus();

    return () => modal.removeEventListener("keydown", handleTab);
  }, [isOpen, modalRef, showProfileModal]);

  const sendFriendRequest = async () => {
    try {
      await axios.post(`${API_URL}/friends/request`, {
        senderId: Number(userId),
        recipientId: Number(user?.userId),
      });
      alert("Friend request sent");
    } catch (err) {
      console.error("Error sending friend request", err);
    }
  };

  useEffect(() => {
    const fetchFriendData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`${API_URL}/friends/${userId}`);
        const friendIds = (response.data.friends || []).map(
          (friend: { id: number }) => friend.id
        );
        setFriendData(friendIds);
      } catch (err) {
        console.error("Error fetching friends data", err);
      }
    };

    fetchFriendData();
  }, [userId]);

  if (!isOpen || !user) return null;

  if (showProfileModal) {
    return (
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div
      ref={modalRef}
      className={`fixed right-64 w-72 bg-neutral-800 rounded-lg overflow-hidden text-white shadow-xl transition-all duration-200 ease-in-out ${
        isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      }`}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-white z-10"
        aria-label="Close profile modal"
      >
        <X className="w-4 h-4" />
      </button>
      {userId !== user.userId && !friendData?.includes(user?.userId) ? (
        <button
          onClick={() => sendFriendRequest()}
          className="absolute top-2 right-10 p-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-white z-10"
          aria-label="Close profile modal"
          data-tooltip-id={`add-friend`} // Link element to tooltip
          data-tooltip-content={"Add Friend"}
        >
          <UserPlus className="w-4 h-4" />
          <Tooltip
            id={`add-friend`}
            place="top"
            style={{
              backgroundColor: "black",
              color: "white",
              fontWeight: "bold",
            }}
          />
        </button>
      ) : (
        userId !== user.userId && (
          <button
            className="absolute top-2 right-10 p-1 bg-neutral-700 hover:bg-neutral-600 rounded-full text-white z-10"
            aria-label="Close profile modal"
            data-tooltip-id={`friend`} // Link element to tooltip
            data-tooltip-content={"Friend!"}
          >
            <Handshake className="w-4 h-4" />
            <Tooltip
              id={`friend`}
              place="top"
              style={{
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </button>
        )
      )}
      {/* Banner */}
      <div className="h-20 bg-neutral-700"></div>
      {/* Profile Content */}
      <div className="px-4 pb-4 -mt-10">
        {/* Avatar */}
        <div className="relative inline-block">
          <img
            src={user?.user.avatarUrl}
            alt="Profile avatar"
            className="w-16 h-16 rounded-full border-4 border-neutral-800"
          />
          <div
            className={`absolute bottom-1 right-1 w-4 h-4 ${
              user.user.onlineStatus ? "bg-green-500" : "bg-[#7d818b]"
            } rounded-full border-2 border-neutral-800`}
            aria-hidden="true"
          ></div>
        </div>

        {/* User Info */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{user?.user.username}</h2>
              <p className="text-sm text-neutral-400">@{user?.userId}</p>
            </div>
            <button
              className="text-neutral-400 hover:text-white"
              aria-label="Add friend"
            ></button>
          </div>
        </div>

        {/* Edit Profile Button */}
        {userId === user.userId && (
          <button
            className="mt-4 w-full py-2 px-4 rounded bg-neutral-700 hover:bg-neutral-600 transition-colors flex items-center justify-center gap-2"
            onClick={() => setShowProfileModal(true)}
          >
            <Pencil className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default MiniProfileModal;
