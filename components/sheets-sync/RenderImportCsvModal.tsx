import React from "react";
import toast from "react-hot-toast";
import { CsvSample } from "./CsvSample";
import { ImportCsvFileInput } from "./ImportCsvFileInput";
import { ImportCsvModalHeader } from "./ImportCsvModalHeader";
import { ImportCsvModalFooter } from "./ImportCsvModalFooter";
import { ImportCsvErrorList } from "./ImportCsvErrorList";
import { CSV_HEADERS, CSV_SAMPLE_ROW } from "./csvConstants";

interface RenderImportCsvModalProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  setCsvFile: (file: File | null) => void;
  clearExisting: boolean;
  setClearExisting: (v: boolean) => void;
  importErrors: string[];
  importLoading: boolean;
  csvFile: File | null;
  setImportLoading: (v: boolean) => void;
  setImportErrors: (v: string[]) => void;
  setModal: (v: any) => void;
}

export function RenderImportCsvModal({
  fileInputRef,
  setCsvFile,
  clearExisting,
  setClearExisting,
  importErrors,
  importLoading,
  csvFile,
  setImportLoading,
  setImportErrors,
  setModal,
}: RenderImportCsvModalProps) {
  const csvHeaders = CSV_HEADERS;
  const csvSampleRow = CSV_SAMPLE_ROW;
  const csvSample = `${csvHeaders.join(',')}` + "\n" + `${csvSampleRow.join(',')}`;
  const handleDownloadSample = () => {
    const blob = new Blob([csvSample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-registrations.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#23272F] rounded-lg p-6 max-w-2xl w-full relative animate-fade-in">
        <ImportCsvModalHeader title="Import Registrations from CSV" onClose={() => setModal(null)} />
        <div className="mb-2 text-[#f5f5f5]/80 text-sm">
          Please use a CSV file with the following columns (first row as header):<br/>
          <span className="text-[#D4AF37]">Required fields: <b>name</b>, <b>email</b></span>
        </div>
        <CsvSample csvHeaders={csvHeaders} csvSampleRow={csvSampleRow} onDownload={handleDownloadSample} />
        <ImportCsvFileInput fileInputRef={fileInputRef} setCsvFile={setCsvFile} />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="clear-existing"
            checked={clearExisting}
            onChange={e => setClearExisting(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="clear-existing" className="text-xs text-[#D4AF37]">Clear existing registrations before import</label>
        </div>
        <ImportCsvErrorList errors={importErrors} />
        <ImportCsvModalFooter
          isLoading={importLoading}
          onImport={async () => {
            if (!csvFile) return;
            setImportLoading(true);
            setImportErrors([]);
            try {
              const text = await csvFile.text();
              // Simple CSV parsing (no quoted fields)
              const lines = text.split(/\r?\n/).filter(Boolean);
              if (lines.length < 2) {
                setImportErrors(["CSV must have at least one data row."]);
                return;
              }
              const header = lines[0].split(',').map(h => h.trim());
              const expected = CSV_HEADERS;
              if (header.join(',') !== expected.join(',')) {
                setImportErrors(["CSV header does not match expected format."]);
                return;
              }
              const rows = lines.slice(1).map(line => {
                const cols = line.split(',');
                return Object.fromEntries(header.map((h, i) => [h, cols[i] ?? '']));
              });
              // Basic validation: check required fields
              const rowErrors: string[] = [];
              for (const [i, row] of rows.entries()) {
                if (!row.name || !row.email) {
                  rowErrors.push(`Row ${i+2}: Missing required fields (name, email).`);
                }
              }
              if (rowErrors.length) {
                setImportErrors(rowErrors);
                return;
              }
              // Send to backend
              const res = await fetch("/api/admin/registration/import-csv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ registrations: rows, clearExisting }),
              });
              if (res.ok) {
                const data = await res.json();
                toast.success(`Imported ${data.count || rows.length} registrations!`);
                setModal(null);
                setCsvFile(null);
              } else {
                const err = await res.text();
                setImportErrors([err || "Import failed."]);
              }
            } catch (e) {
              setImportErrors(["Error importing CSV"]);
            } finally {
              setImportLoading(false);
            }
          }}
          onCancel={() => setModal(null)}
        />
      </div>
    </div>
  );
}
