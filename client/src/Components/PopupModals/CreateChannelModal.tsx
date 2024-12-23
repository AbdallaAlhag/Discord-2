import React, { useState } from "react";
import { X, Hash, Volume2 } from "lucide-react";
import ReactDOM from "react-dom";

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (data: {
    name: string;
    type: "text" | "voice";
    isPrivate: boolean;
  }) => void;
}

export default function ChannelModal({
  isOpen,
  onClose,
  onCreateChannel,
}: ChannelModalProps) {
  const [channelType, setChannelType] = useState<"text" | "voice">("text");
  const [channelName, setChannelName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateChannel({
      name: channelName,
      type: channelType,
      isPrivate,
    });
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#313338] rounded-md w-full max-w-md p-4 text-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create Channel</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="text-xs text-gray-400 mb-2">in Text Channels</div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
              CHANNEL TYPE
            </label>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setChannelType("text")}
                className={`w-full flex items-center p-2 rounded ${
                  channelType === "text" ? "bg-[#404249]" : "hover:bg-[#404249]"
                }`}
              >
                <Hash className="mr-2" size={24} />
                <div className="text-left">
                  <div className="font-semibold">Text</div>
                  <div className="text-xs text-gray-400">
                    Send messages, images, GIFs, emoji, opinions, and puns
                  </div>
                </div>
                <div
                  className={`ml-auto rounded-full w-5 h-5 border-2 ${
                    channelType === "text"
                      ? "bg-indigo-500 border-indigo-500"
                      : "border-gray-500"
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => setChannelType("voice")}
                className={`w-full flex items-center p-2 rounded ${
                  channelType === "voice"
                    ? "bg-[#404249]"
                    : "hover:bg-[#404249]"
                }`}
              >
                <Volume2 className="mr-2" size={24} />
                <div className="text-left">
                  <div className="font-semibold">Voice</div>
                  <div className="text-xs text-gray-400">
                    Hang out together with voice, video, and screen share
                  </div>
                </div>
                <div
                  className={`ml-auto rounded-full w-5 h-5 border-2 ${
                    channelType === "voice"
                      ? "bg-indigo-500 border-indigo-500"
                      : "border-gray-500"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-400 uppercase mb-2 block">
              CHANNEL NAME
            </label>
            <div className="relative">
              <Hash
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="new-channel"
                className="w-full bg-[#1e1f22] text-gray-200 pl-10 pr-4 py-2 rounded focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="font-semibold flex items-center gap-2">
                Private Channel
              </div>
              <div className="text-xs text-gray-400">
                Only selected members and roles will be able to view this
                channel.
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-12 h-6 rounded-full transition-colors ${
                isPrivate ? "bg-indigo-500" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  isPrivate ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold hover:underline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-indigo-500 rounded hover:bg-indigo-600 transition-colors"
            >
              Create Channel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
