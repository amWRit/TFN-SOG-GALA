
import React from "react";
import styles from '../../styles/admin-dashboard.module.css';

interface OkModalProps {
  open: boolean;
  title?: string;
  message: React.ReactNode;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
  okDisabled?: boolean;
  cancelDisabled?: boolean;
}

export function OkModal({ open, title, message, onOk, onCancel, okText = "OK", cancelText = "Cancel", okDisabled = false, cancelDisabled = false }: OkModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full relative animate-fade-in text-white">
        {title && <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>}
        <p className="mb-6 text-center">{message}</p>
        <div className="flex gap-4 justify-center">
          <button
            className={styles.adminButton}
            onClick={onOk}
            disabled={okDisabled}
          >
            {okText}
          </button>
          <button
            className={styles.adminButton}
            style={{ background: '#ef4444', color: '#fff', borderColor: '#ef4444', fontWeight: 600, boxShadow: 'none', outline: 'none', borderWidth: 1, borderStyle: 'solid', transition: 'background 0.2s' }}
            onClick={onCancel}
            disabled={cancelDisabled}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
