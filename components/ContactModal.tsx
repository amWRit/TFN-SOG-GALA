import { User, Phone } from "lucide-react";
import React from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-xs w-full text-center relative">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-3 mt-2 mb-4">
          <div className="flex items-center gap-2 text-[#084691] text-base font-semibold">
            <User size={20} /> TFN Staff
          </div>
          <div className="flex items-center gap-2 text-[#d71a21] text-base font-semibold">
            <Phone size={20} /> 9800000000
          </div>
        </div>
        <div className="text-[#084691] text-sm mb-2">
          To place a bid on this item, please contact the TFN staff.
        </div>
      </div>
    </div>
  );
}
