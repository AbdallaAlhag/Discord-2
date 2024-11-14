import { X, User, Mail, Phone, Shield, Key, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
// import { cn } from "@/lib/utils"

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-none max-h-[95vh] p-0 border-none bg-transparent">
        <div
          className="fixed inset-0 bg-[#2b2d31]
        backdrop-blur-sm flex items-center justify-center z-50"
        >
          {/* start of the modal? */}
          {/* <div className="bg-[#36393f] w-full max-w-[1000px] rounded-lg shadow-xl flex h-[85vh] relative animate-in fade-in-0 zoom-in-95"> */}
          <div className="w-full h-[100vh] bg-gradient-to-r from-[#2b2d31] to-[#313338] rounded-lg shadow-xl flex justify-center relative animate-in fade-in-0 zoom-in-95">
            {/* Sidebar */}
            <div className="w-[232px] bg-[#2b2d31] p-3 rounded-l-lg pt-16">
              <div className="px-2 py-[6px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-[#1E1F22] text-sm text-gray-300 px-2 py-1 rounded border-none focus:ring-0 placeholder-gray-500"
                  />
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-400 mb-2 px-2">
                USER SETTINGS
              </div>
              <button className="w-full text-left px-2 py-1.5 rounded bg-[#42464D] text-white mb-0.5">
                My Account
              </button>
              <button className="w-full text-left px-2 py-1.5 rounded text-gray-300 hover:bg-[#42464D] hover:text-white transition-colors">
                User Profile
              </button>
              <button className="w-full text-left px-2 py-1.5 rounded text-gray-300 hover:bg-[#42464D] hover:text-white transition-colors">
                Privacy & Safety
              </button>
              <button className="w-full text-left px-2 py-1.5 rounded text-gray-300 hover:bg-[#42464D] hover:text-white transition-colors">
                Authorized Apps
              </button>
              <button className="w-full text-left px-2 py-1.5 rounded text-gray-300 hover:bg-[#42464D] hover:text-white transition-colors">
                Connections
              </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col max-w-[750px] pt-10">
              <div className="flex items-center justify-between p-4 border-b border-[#202225]">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-white">
                    My Account
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
                {/* Banner */}
                <div className="h-[100px] bg-[#9c7b6b]" />

                {/* Profile Content */}
                <div className="p-4 -mt-16">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop"
                        alt="Profile picture"
                        className="w-[100px] h-[100px] rounded-full border-[6px] border-[#36393f] object-cover"
                      />
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#36393f]" />
                    </div>

                    <div className="flex-1 pt-16">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white">
                          Abdalla
                        </h3>
                        <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                          Edit User Profile
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {["DISPLAY NAME", "EMAIL", "PHONE NUMBER"].map(
                          (field, index) => (
                            <div
                              key={field}
                              className="bg-[#202225] p-4 rounded"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2 text-gray-300">
                                  {index === 0 && <User className="h-4 w-4" />}
                                  {index === 1 && <Mail className="h-4 w-4" />}
                                  {index === 2 && <Phone className="h-4 w-4" />}
                                  <span>{field}</span>
                                </div>
                                <div className="flex gap-2">
                                  {field === "PHONE NUMBER" && (
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
                              <p className="text-white">
                                {field === "DISPLAY NAME" && "Abdalla"}
                                {field === "EMAIL" && "••••••••••@gmail.com"}
                                {field === "PHONE NUMBER" && "•••••••9758"}
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-8 space-y-6">
                        <div>
                          <h4 className="text-white font-semibold mb-4">
                            Password and Authentication
                          </h4>
                          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                            Change Password
                          </Button>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-gray-300 mb-2">
                            <Shield className="h-4 w-4" />
                            <h5 className="font-medium">AUTHENTICATOR APP</h5>
                          </div>
                          <p className="text-gray-400 mb-3">
                            Protect your account with an extra layer of
                            security. Once configured, you'll be required to
                            enter your password and complete one additional step
                            in order to sign in.
                          </p>
                          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                            Enable Authenticator App
                          </Button>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-gray-300 mb-2">
                            <Key className="h-4 w-4" />
                            <h5 className="font-medium">SECURITY KEYS</h5>
                          </div>
                          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                            Register a Security Key
                          </Button>
                        </div>

                        <div className="pb-8">
                          <div className="flex items-center gap-2 text-red-400 mb-2">
                            <AlertTriangle className="h-4 w-4" />
                            <h5 className="font-medium">ACCOUNT REMOVAL</h5>
                          </div>
                          <div className="flex gap-3">
                            <Button className="bg-red-500 hover:bg-red-600 text-white">
                              Disable Account
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-500 text-red-500 hover:bg-red-500/10"
                            >
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
