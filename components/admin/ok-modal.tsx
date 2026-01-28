
import React from "react";
import styles from '../../styles/admin-dashboard.module.css';

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
            className={styles.adminButton}
            onClick={onOk}
          >
            {okText}
          </button>
          <button
            className={styles.adminButton + " bg-transparent text-pink-400 border border-pink-400 hover:bg-pink-400/10"}
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
