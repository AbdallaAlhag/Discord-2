import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import axios from "axios";
import ReactDOM from "react-dom";

interface LeaveServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  serverId: string;
  userId: string | null;
}

const LeaveServerModal: React.FC<LeaveServerModalProps> = ({
  isOpen,
  onClose,
  serverName,
  serverId,
  userId,
}) => {
  const handleLeave = async () => {
    try {
      const response = await axios.delete(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/server/leave/${serverId}/${userId}`
      );
      console.log(response);
    } catch (error) {
      console.error("Error deleting server:", error);
    }
    onClose();
    window.location.href = "/";
  };
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#313338] rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold text-white">
            Leave '<span className="underline">{serverName}</span>'
          </h2>
          <Button
            onClick={onClose}
            variant="dark"
            size="circle"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-7 w-7" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <p className="text-[#B9BBBE] text-sm mb-4">
          Are you sure you want to leave{" "}
          <span className="font-semibold">{serverName}</span>? You won't be able
          to rejoin this server unless you are re-invited.
        </p>
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={handleLeave} variant="destructive">
            Leave Server
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LeaveServerModal;
