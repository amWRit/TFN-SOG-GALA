import React from "react";


interface ImportCsvFileInputProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setCsvFile: (file: File | null) => void;
}

export const ImportCsvFileInput: React.FC<ImportCsvFileInputProps> = ({ fileInputRef, setCsvFile }) => (
  <div className="mb-4">
    <input
      ref={fileInputRef}
      type="file"
      accept=".csv"
      onChange={e => setCsvFile(e.target.files?.[0] || null)}
      className="block w-full text-sm text-[#D4AF37] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/40"
    />
  </div>
);
