import { useState } from "react";
import { Settings } from "lucide-react";
import ProfileModal from "./ProfileModal";

interface SettingsButtonProps {
  className?: string;
}

export default function SettingsButton({
  className = "",
}: SettingsButtonProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsProfileOpen(true)}
        className={`text-gray-400 hover:text-white transition-colors ${className}`}
      >
        <Settings size={20} />
      </button>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
