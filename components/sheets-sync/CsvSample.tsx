import React from "react";

interface CsvSampleProps {
  csvHeaders: string[];
  csvSampleRow: string[];
  onDownload: () => void;
}

export const CsvSample: React.FC<CsvSampleProps> = ({ csvHeaders, csvSampleRow, onDownload }) => (
  <>
    <pre className="bg-[#1a1a1a] text-[#D4AF37] rounded p-2 text-xs mb-2 overflow-x-auto">
      <span style={{ fontWeight: 'bold' }}>{csvHeaders.join(',')}</span>
      {"\n"}
      {csvSampleRow.join(',')}
    </pre>
    <button
      className="mb-4 px-3 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30 hover:bg-[#D4AF37]/40 transition"
      onClick={onDownload}
    >
      Download Sample CSV
    </button>
  </>
);
