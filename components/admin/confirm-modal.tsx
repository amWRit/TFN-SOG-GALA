import React from "react";
import styles from "../../styles/admin-dashboard.module.css";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`${styles.adminCard} w-full max-w-sm p-6 relative animate-fade-in`} style={{ minWidth: 0 }}>
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-white z-10 text-2xl font-bold"
          aria-label="Close"
          disabled={loading}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-3 text-center">{title}</h2>
        <p className="mb-6 text-base text-gray-200 text-center">{message}</p>
        <div className="flex justify-center gap-2">
          <button
            className={`${styles.adminButton}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
          <button
            className={`${styles.adminButtonRed}`}
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
