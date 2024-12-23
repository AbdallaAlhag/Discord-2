import { X, User, Mail, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
// import { cn } from "@/lib/utils"
import { useAuth } from "@/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import LogoutButton from "../Profile/LogoutButton";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProp {
  avatarUrl: string;
  createdAt: string;
  email: string;
  id: number;
  username: string;
}

interface TabProps {
  userInfo?: UserProp;
}
type TabType = "account" | "profile" | "privacy" | "apps" | "connections";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { userId } = useAuth();
  const [userInfo, setUserInfo] = useState<UserProp>();
  const [activeTab, setActiveTab] = useState<TabType>("account");

  useEffect(() => {
    axios
      .get(`${VITE_API_BASE_URL}/user/${userId}`)
      .then((response) => {
        setUserInfo(response.data.user);
        // console.log(response.data.user);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountTab userInfo={userInfo} />;
      case "profile":
        return <UserProfileTab userInfo={userInfo} />;
      case "privacy":
        return <div className="p-4 text-white">Privacy & Safety Settings</div>;
      case "apps":
        return <div className="p-4 text-white">Authorized Apps Settings</div>;
      case "connections":
        return <div className="p-4 text-white">Connections Settings</div>;
      default:
        return null;
    }
  };

  const TabButton = ({ tab, label }: { tab: TabType; label: string }) => (
    <button
      className={`w-full text-left px-2 py-1.5 rounded text-white ${
        activeTab === tab
          ? "bg-[#42464D] "
          : " hover:bg-[#42464D] "
      }z-[199]`}
      onClick={() => {
        console.log("tab is being clicked");
        setActiveTab(tab);
      }}
    >
      {label}
    </button>
  );

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-none max-h-[95vh] p-0 border-none bg-transparent z-[200]">
          {/* Accessible Title and Description */}
          <DialogTitle className="sr-only">Settings</DialogTitle>
          <DialogDescription className="sr-only">
            Navigate user settings tabs and update preferences.
          </DialogDescription>

          <div className="fixed inset-0 bg-[#2b2d31] backdrop-blur-sm flex items-center justify-center z-30">
            <div className="w-full h-[100vh] bg-gradient-to-r from-[#2b2d31] to-[#313338] rounded-lg shadow-xl flex justify-center relative animate-in fade-in-0 zoom-in-95">
              {/* Sidebar */}
              <div className="w-[232px] bg-[#2b2d31] p-3 rounded-l-lg pt-12">
                <div className="py-[16px]">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-[#1E1F22] text-sm text-gray-300 px-2 py-2 rounded border-none focus:ring-0 placeholder-gray-500"
                  />
                </div>
                <div className="text-xs font-semibold text-gray-400 mb-2 px-2">
                  USER SETTINGS
                </div>
                <TabButton tab="account" label="My Account" />
                <TabButton tab="profile" label="User Profile" />
                <TabButton tab="privacy" label="Privacy & Safety" />
                <LogoutButton className="w-full text-left px-2 py-1.5 rounded transition-colors text-white hover:bg-[#42464D] hover:text-white flex justify-between" />
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col max-w-[750px] pt-10">
                <div className="flex items-center justify-between p-4 border-b border-[#202225]">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">
                      {activeTab === "account" && "My Account"}
                      {activeTab === "profile" && "User Profile"}
                      {activeTab === "privacy" && "Privacy & Safety"}
                    </h2>
                  </div>
                  <Button
                    variant="dark"
                    size="circle"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
// Account Tab Component
const AccountTab: React.FC<TabProps> = ({ userInfo }) => (
  <>
    <div className="h-[100px] bg-[#9c7b6b]" />
    <div className="p-4 -mt-16">
      <div className="flex flex-col items-start gap-4">
        <div className="relative">
          <img
            src={userInfo?.avatarUrl}
            alt="Profile picture"
            className="w-[100px] h-[100px] rounded-full border-[6px] border-[#36393f] object-cover"
          />
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#36393f]" />
        </div>

        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              {userInfo?.username}
            </h3>
            <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
              Edit User Profile
            </Button>
          </div>

          <div className="space-y-4">
            {[
              { label: "DISPLAY NAME", icon: User, value: userInfo?.username },
              { label: "EMAIL", icon: Mail, value: userInfo?.email },
            ].map((field) => (
              <div key={field.label} className="bg-[#202225] p-4 rounded">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 text-gray-300">
                    <field.icon className="h-4 w-4" />
                    <span>{field.label}</span>
                  </div>
                  <div className="flex gap-2">
                    {field.label === "PHONE NUMBER" && (
                      <Button
                        variant="secondary"
                        className="h-8 bg-[#2f3136] text-gray-300 hover:bg-gray-700"
                      >
                        Remove
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      className="h-8 bg-[#2f3136] text-gray-300 hover:bg-gray-700"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <p className="text-white">{field.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-6 pb-8">
            <SecuritySection />
          </div>
        </div>
      </div>
    </div>
  </>
);

// Security Section Component
const SecuritySection = () => (
  <>
    <div>
      <h4 className="text-white font-semibold mb-4">
        Password and Authentication
      </h4>
      <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
        Change Password
      </Button>
    </div>

    <div>
      <div className="flex items-center gap-2 text-red-400 mb-2">
        <AlertTriangle className="h-4 w-4" />
        <h5 className="font-medium">ACCOUNT REMOVAL</h5>
      </div>
      <div className="flex gap-3">
        {" "}
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-500/10"
        >
          Delete Account
        </Button>
      </div>
    </div>
  </>
);

const UserProfileTab: React.FC<TabProps> = ({ userInfo }) => (
  <div className="min-h-screen  text-white">
    <div className="max-w-3xl mx-auto">
      <div className="flex border-b border-gray-700 py-2">
        <button className="px-4 py-2 text-white border-b-2 border-white">
          User Profile
        </button>
        <button className="px-4 py-2 text-gray-400 hover:text-gray-200">
          Server Profiles
        </button>
      </div>{" "}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="p-4 space-y-6">
            <div>
              <label className="block text-gray-400 text-sm uppercase mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={userInfo?.username}
                className="w-full bg-[#1e1f22] text-white p-2 rounded"
                readOnly
              />
            </div>
            <div className="h-px bg-gray-700 my-4" />

            <div>
              <label className="block text-gray-400 text-sm uppercase mb-2">
                Pronouns
              </label>
              <input
                type="text"
                placeholder="Add your pronouns"
                className="w-full bg-[#1e1f22] text-white p-2 rounded"
              />
            </div>
            <div className="h-px bg-gray-700 my-4" />

            <div>
              <label className="block text-gray-400 text-sm uppercase mb-2">
                Avatar
              </label>
              <div className="flex gap-4">
                <button className="bg-[#5865f2] text-white px-4 py-2 rounded hover:bg-[#6d76f4]">
                  Change Avatar
                </button>
                <button className="text-white px-4 py-2 hover:underline">
                  Remove Avatar
                </button>
              </div>
            </div>
            <div className="h-px bg-gray-700 my-4" />

            <div>
              <label className="block text-gray-400 text-sm uppercase mb-2">
                Banner Color
              </label>
              <button
                className="w-16 h-16 bg-[#B39C8E] rounded flex items-center justify-center cursor-pointer hover:opacity-90"
                aria-label="Change banner color"
              >
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </button>
            </div>
            <div className="h-px bg-gray-700 my-4" />

            <div>
              <label className="block text-white text-sm uppercase mb-2">
                About Me
              </label>
              <p className="block text-gray-400 text-sm uppercase mb-2">
                You can use markdown and links if you'd like.
              </p>
              <div className="relative">
                <textarea className="w-full bg-[#1E1F22] text-gray-200 p-3 rounded min-h-[120px] resize-none" />
                <div className="absolute bottom-2 right-2 flex items-center gap-2">
                  <span className="text-xs text-gray-400">175</span>
                  <button className="text-gray-400 hover:text-gray-200"></button>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
        <div className="p-4">
          <h2 className="text-gray-400 text-sm uppercase mb-4">Preview</h2>
          <div className="bg-[#2B2D31] rounded-lg p-4">
            <div className="relative">
              <div className="w-full h-24 object-cover rounded-lg bg-[#b39c8e]" />
              <div className="absolute -bottom-6 left-4">
                <img
                  src={userInfo?.avatarUrl}
                  alt="Avatar"
                  className="w-[72px] h-[72px] rounded-full border-4 border-[#2B2D31]"
                />
                <div className="absolute bottom-0 right-0">
                  <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-[#2B2D31]" />
                </div>
              </div>
            </div>

            <div className="mt-8 p-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-xl font-bold">Abdalla</h3>
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {userInfo?.username}
                {userInfo?.id}
              </div>
              <div className="text-gray-400 text-sm mt-1">{/* user bio */}</div>{" "}
              <button className="bg-[#1E1F22] text-white px-4 py-2 rounded hover:bg-gray-800 mt-1">
                Example Button
              </button>
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  </div>
);
