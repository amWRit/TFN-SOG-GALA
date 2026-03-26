import React from "react";

interface ImportCsvModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ImportCsvModalHeader: React.FC<ImportCsvModalHeaderProps> = ({ title, onClose }) => (
  <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
    <h2 className="text-lg font-bold text-[#D4AF37]">{title}</h2>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 focus:outline-none"
      aria-label="Close"
      type="button"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
);
