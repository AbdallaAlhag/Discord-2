import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/70 transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-50 w-full max-w-md transform transition-all">
        <div className="bg-[#313338] rounded-md shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}
