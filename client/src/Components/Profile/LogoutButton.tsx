import { Button } from "@/Components/ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useState } from "react";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function LogoutButton({ className }: { className: string }) {
  const userId = useAuth();
  const [isModelOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Use navigate for programmatic routing

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    try {
      axios.post(
        `${VITE_API_BASE_URL}/auth/logoutStatus/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Marked offline");
    } catch (err) {
      console.log(err);
    }
    navigate("/login"); // Redirect to the login page
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button onClick={() => handleOpenModal()} className={`${className}`}>
        {" "}
        Logout
        <LogOut size={20} />
      </button>
      <LogoutModal
        isOpen={isModelOpen}
        onClose={handleCloseModal}
        onLogout={logout}
      />
    </>
  );
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const LogoutModal: React.FC<ModalProps> = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-40"></div>
      {/* Modal */}

      <div className="fixed inset-0  flex items-center justify-center z-50">
        <div className="bg-[#313338] rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-white">Logout?</h2>
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
            Are you sure you want to logout?
          </p>
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose} variant="secondary">
              Cancel
            </Button>
            <Button onClick={onLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

// log out
// Are you sure you want to logout?
// cancel button logout button in red
