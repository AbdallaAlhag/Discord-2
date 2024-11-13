import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

// Types
interface MenuItem {
  icon: string;
  label: string;
  done: boolean;
}

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  label: string;
}

// types/menuTypes.ts
type MenuAction = {
  handler: () => void;
  // requiresAuthentication?: boolean;
  // requiresPermission?: string[];
};

type MenuActionMap = {
  [key: string]: MenuAction;
};

interface MenuActionsProps {
  onInvitePeople: () => void;
  // onCreateChannel: () => void;
  // Add other action handlers as needed
}

interface MenuItem {
  icon: string;
  label: string;
  done: boolean;
}

// MenuButton Component
const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, onClick, label }) => (
  <button
    onClick={onClick}
    className="flex items-center w-full px-4 py-3 text-white bg-[#2f3136] hover:bg-gray-700 transition-colors"
  >
    <span className="flex-1 text-left">{label}</span>
    <div className="relative w-5 h-5">
      <ChevronDown
        className={`absolute top-0 left-0 transition-all duration-300 transform ${
          isOpen ? "opacity-0 rotate-180" : "opacity-100 rotate-0"
        }`}
        size={20}
      />
      <X
        className={`absolute top-0 left-0 transition-all duration-300 transform ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        size={20}
      />
    </div>
  </button>
);

// MenuItem Component
const MenuItem: React.FC<{ item: MenuItem; actions: MenuActionMap }> = ({
  item,
  actions,
}) => {
  const handleClick = () => {
    const action = actions[item.label];
    if (action?.handler) {
      action.handler();
    }
  };

  return (
    <button
      className="flex items-center justify-between w-full h-full px-4 py-2 text-sm text-gray-300 bg-[#111214] hover:bg-gray-700 transition-colors"
      onClick={handleClick}
    >
      <span className={item.done ? "" : "opacity-50 "}>{item.label}</span>
      <span className="w-6">{item.icon}</span>{" "}
      <span className="w-6 opacity-0">🚀</span>
    </button>
  );
};

// Main ServerMenu Component
const ServerMenu: React.FC<{
  serverName: string;
  menuActions: MenuActionsProps;
}> = ({ serverName, menuActions }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    { icon: "🚀", label: "Server Boost", done: false },
    { icon: "👥", label: "Invite People", done: true },
    { icon: "⚙️", label: "Server Settings", done: false },
    { icon: "➕", label: "Create Channel", done: false },
    { icon: "📁", label: "Create Category", done: false },
    { icon: "📅", label: "Create Event", done: false },
    { icon: "📱", label: "App Directory", done: false },
    { icon: "🔔", label: "Notification Settings", done: false },
    { icon: "🔒", label: "Privacy Settings", done: false },
    { icon: "✏️", label: "Edit Server Profile", done: false },
    { icon: "👁️", label: "Hide Muted Channels", done: false },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleClickButton = (event: MouseEvent) => {
      if (event.target instanceof HTMLButtonElement) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("click", handleClickButton);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("click", handleClickButton);
    };
  }, []);

  const actionMap: MenuActionMap = {
    "Invite People": {
      handler: menuActions.onInvitePeople,
    },
    // "Create Channel": {
    //   handler: menuActions.onCreateChannel,
    // },
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-60  shadow-md" ref={menuRef}>
        <MenuButton
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          label={serverName}
        />

        <div
          className={`absolute top-full left-0 w-full mt-1 bg-gray-800 rounded-md shadow-lg z-50 transition-all duration-200 transform origin-top ${
            isOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }`}
        >
          <div className="py-2 w-11/12 mx-auto flex-row justify-center items-center rounded">
            {menuItems.map((item, index) => (
              <MenuItem key={index} item={item} actions={actionMap} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerMenu;
