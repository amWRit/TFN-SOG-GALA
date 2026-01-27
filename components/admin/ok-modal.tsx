import React from "react";

interface OkModalProps {
  open: boolean;
  title?: string;
  message: string;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
}

export function OkModal({ open, title, message, onOk, onCancel, okText = "OK", cancelText = "Cancel" }: OkModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full relative animate-fade-in text-white">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <p className="mb-6 text-center">{message}</p>
        <div className="flex gap-4 justify-center">
          <button
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
            onClick={onOk}
          >
            {okText}
          </button>
          <button
            className="bg-gray-700 text-white px-6 py-2 rounded-full font-semibold hover:bg-gray-600 transition-all duration-300"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
