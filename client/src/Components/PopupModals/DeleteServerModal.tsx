// export default DeleteServerModal;
import { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import axios from "axios";

interface DeleteServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverName: string;
  serverId: string;
}

export default function DeleteServerModal({
  isOpen,
  onClose,
  serverName,
  serverId,
}: DeleteServerModalProps) {
  const [inputName, setInputName] = useState("");

  useEffect(() => {
    setInputName("");
  }, []);
  const handleDelete = async () => {
    if (inputName === serverName) {
      // onDelete();
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/server/delete/${serverId}`
        );
        console.log(response);
      } catch (error) {
        console.error("Error deleting server:", error);
      }

      console.log(serverId);
      setInputName("");
      onClose();
      window.location.href = "/";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#313338] rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Delete <span className="underline">{serverName}</span>
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
        <p className="text-lg bg-[#f0b232] text-white rounded-md px-2 py-1 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{serverName}</span>? This action
          cannot be undone.
        </p>
        <p className="text-sm text-gray-400 mb-2">
          {`Type in "${serverName}" to confirm deletion:`}
        </p>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          className="w-full bg-[#1e1f22] text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          placeholder={serverName}
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={inputName !== serverName}
          >
            Delete Server
          </Button>
        </div>
      </div>
    </div>
  );
}
