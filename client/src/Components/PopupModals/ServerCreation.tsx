import { useState } from "react";
import { Modal } from "./CreateServerModal";
import {
  Users,
  Gamepad2,
  GraduationCap,
  BookOpen,
  Upload,
  ChevronRight,
  Plus,
} from "lucide-react";

type Step = "initial" | "type" | "customize";

export function ServerCreation() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("initial");

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setStep("initial"), 300);
  };

  const renderStep = () => {
    switch (step) {
      case "initial":
        return (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Create Your Server
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Your server is where you and your friends hang out. Make yours and
              start talking.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setStep("type")}
                className="w-full flex items-center justify-between p-4 bg-[#2B2D31] hover:bg-[#404249] rounded-md transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#5865F2] p-2 rounded-full">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-white font-medium">Create My Own</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>

              <div className="pt-2">
                <p className="text-gray-400 text-sm font-medium mb-2">
                  START FROM A TEMPLATE
                </p>
                {[
                  { icon: Gamepad2, text: "Gaming", color: "bg-[#5865F2]" },
                  {
                    icon: GraduationCap,
                    text: "School Club",
                    color: "bg-[#FF73FA]",
                  },
                  {
                    icon: BookOpen,
                    text: "Study Group",
                    color: "bg-[#5865F2]",
                  },
                ].map((item) => (
                  <button
                    key={item.text}
                    className="w-full flex items-center justify-between p-4 bg-[#2B2D31] hover:bg-[#404249] rounded-md transition-colors group mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`${item.color} p-2 rounded-full`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-white font-medium">
                        {item.text}
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>

              <div className="pt-4 text-center">
                <p className="text-gray-400 mb-2">Have an invite already?</p>
                <button className="w-full bg-[#4E505C] hover:bg-[#5D5F6C] text-white py-3 rounded-md transition-colors">
                  Join a Server
                </button>
              </div>
            </div>
          </div>
        );

      case "type":
        return (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Tell Us More About Your Server
            </h2>
            <p className="text-gray-400 text-center mb-6">
              In order to help you with your setup, is your new server for just
              a few friends or a larger community?
            </p>

            <div className="space-y-3">
              {[
                { icon: Users, text: "For a club or community" },
                { icon: Users, text: "For me and my friends" },
              ].map((item) => (
                <button
                  key={item.text}
                  onClick={() => setStep("customize")}
                  className="w-full flex items-center justify-between p-4 bg-[#2B2D31] hover:bg-[#404249] rounded-md transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#5865F2] p-2 rounded-full">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white font-medium">{item.text}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              ))}

              <p className="text-sm text-center pt-4 text-gray-400">
                Not sure? You can{" "}
                <button className="text-[#00A8FC] hover:underline">
                  skip this question
                </button>{" "}
                for now.
              </p>
            </div>

            <button
              onClick={() => setStep("initial")}
              className="mt-4 px-4 py-2 text-white hover:underline"
            >
              Back
            </button>
          </div>
        );

      case "customize":
        return (
          <div className="p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Customize Your Server
            </h2>
            <p className="text-gray-400 text-center mb-6">
              Give your new server a personality with a name and an icon. You
              can always change it later.
            </p>

            <div className="flex justify-center mb-6">
              <button className="relative group">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <div className="absolute bottom-0 right-0 bg-[#5865F2] rounded-full p-1">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-300 uppercase mb-2">
                SERVER NAME
              </label>
              <input
                type="text"
                className="w-full bg-[#1E1F22] text-white p-2.5 rounded-md border border-[#1E1F22] focus:border-[#5865F2] focus:outline-none"
                defaultValue="My Server"
              />
            </div>

            <p className="text-xs text-gray-400 mb-6">
              By creating a server, you agree to Discord's Community Guidelines.
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setStep("type")}
                className="px-4 py-2 text-white hover:underline"
              >
                Back
              </button>
              <button
                onClick={handleClose}
                className="px-8 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        // className="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-md transition-colors"
      >
        {/* Create a Server */}
        <Plus className="w-6 h-6 text-[#3ba55d]" />
      </button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        {renderStep()}
      </Modal>
    </>
  );
}
