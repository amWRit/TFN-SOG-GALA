"use client";

import { useState, useRef } from "react";
import { OkModal } from "./ok-modal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";

export function SheetsSync() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<null | { type: 'registration' | 'seating' | 'import-csv', open: boolean }>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [clearExisting, setClearExisting] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // CSV sample and download logic
  const csvHeaders = [
    'name', 'email', 'phone', 'table_preference', 'seat_preference', 'payment', 'payment_status', 'quote', 'bio', 'involvement'
  ];
  const csvSampleRow = [
    'John Doe',
    'john@example.com',
    '9800000000',
    '2',
    '5',
    '100',
    'true',
    'Education is hope.',
    'Short bio here.',
    'Volunteer'
  ];
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

  // CSV import modal UI
  const renderImportCsvModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#23272F] rounded-lg p-6 max-w-2xl w-full relative animate-fade-in">
        <button
          className="absolute top-3 right-4 text-2xl text-[#D4AF37] hover:text-[#B8941F] focus:outline-none"
          onClick={() => setModal(null)}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
        <h3 className="text-xl font-bold text-[#D4AF37] mb-2">Import Registrations from CSV</h3>
        <div className="mb-2 text-[#f5f5f5]/80 text-sm">
          Please use a CSV file with the following columns (first row as header):<br/>
          <span className="text-[#D4AF37]">Required fields: <b>name</b>, <b>email</b></span>
        </div>
        <pre className="bg-[#1a1a1a] text-[#D4AF37] rounded p-2 text-xs mb-2 overflow-x-auto">
          <span style={{ fontWeight: 'bold' }}>{csvHeaders.join(',')}</span>
          {"\n"}
          {csvSampleRow.join(',')}
        </pre>
        <button
          className="mb-4 px-3 py-1 rounded bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30 hover:bg-[#D4AF37]/40 transition"
          onClick={handleDownloadSample}
        >
          Download Sample CSV
        </button>
        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={e => setCsvFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-[#D4AF37] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37]/20 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/40"
          />
        </div>
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
        <button
          className="w-full px-4 py-2 rounded bg-[#D4AF37] text-[#23272F] font-bold hover:bg-[#B8941F] transition"
          disabled={!csvFile || importLoading}
          onClick={async () => {
            if (!csvFile) return;
            setImportLoading(true);
            try {
              const text = await csvFile.text();
              // Simple CSV parsing (no quoted fields)
              const lines = text.split(/\r?\n/).filter(Boolean);
              if (lines.length < 2) {
                toast.error("CSV must have at least one data row.");
                return;
              }
              const header = lines[0].split(',').map(h => h.trim());
              const expected = ['name','email','phone','table_preference','seat_preference','payment','payment_status','quote','bio','involvement'];
              if (header.join(',') !== expected.join(',')) {
                toast.error("CSV header does not match expected format.");
                return;
              }
              const rows = lines.slice(1).map(line => {
                const cols = line.split(',');
                return Object.fromEntries(header.map((h, i) => [h, cols[i] ?? '']));
              });
              // Basic validation: check required fields
              for (const [i, row] of rows.entries()) {
                if (!row.name || !row.email) {
                  toast.error(`Row ${i+2}: Missing required fields (name, email).`);
                  return;
                }
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
                toast.error(err || "Import failed.");
              }
            } catch (e) {
              toast.error("Error importing CSV");
            } finally {
              setImportLoading(false);
            }
          }}
        >
          {importLoading ? 'Importing...' : 'Import'}
        </button>
      </div>
    </div>
  );

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sheets/sync", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Synced ${data.count || 0} records from Google Sheets!`);
      } else {
        toast.error("Failed to sync. Check your Google Sheets configuration.");
      }
    } catch (error) {
      toast.error("Error syncing with Google Sheets");
    } finally {
      setLoading(false);
    }
  };

  const registrationSheetId = process.env.NEXT_PUBLIC_REGISTRATION_GOOGLE_SHEETS_ID || process.env.REGISTRATION_GOOGLE_SHEETS_ID;
  const seatingSheetId = process.env.NEXT_PUBLIC_SEATING_GOOGLE_SHEETS_ID || process.env.SEATING_GOOGLE_SHEETS_ID;
  const registrationSheetUrl = registrationSheetId ? `https://docs.google.com/spreadsheets/d/${registrationSheetId}/edit` : '';
  const seatingSheetUrl = seatingSheetId ? `https://docs.google.com/spreadsheets/d/${seatingSheetId}/edit` : '';

  const doExport = async (type: 'registration' | 'seating') => {
    setLoading(true);
    try {
      const url = type === 'registration' ? "/api/admin/sheets/export-registration" : "/api/admin/sheets/export-seating";
      const res = await fetch(url, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        toast.success(`Exported ${data.count || 0} ${type === 'registration' ? 'registrations' : 'seats'} to Google Sheets!`);
      } else {
        toast.error(`Failed to export ${type === 'registration' ? 'registrations' : 'seats'}.`);
      }
    } catch (error) {
      toast.error(`Error exporting ${type === 'registration' ? 'registrations' : 'seats'}`);
    } finally {
      setLoading(false);
      setModal(null);
    }
  };

  return (
    <Card className="glass-strong p-6">
      <h2 className="font-playfair text-2xl font-bold text-[#D4AF37] mb-4">
        Google Sheets Sync
      </h2>
      <p className="text-[#f5f5f5]/80 mb-6">
        Sync seating assignments from your Google Sheets. Make sure your sheet
        has columns: name, quote, bio, involvement, image_url, table_number,
        seat_number
      </p>

      <div className="bg-[#1a1a1a]/50 p-4 rounded-lg mb-4">
        <h3 className="font-semibold text-[#D4AF37] mb-2">
          Configuration Required
        </h3>
        <ul className="text-sm text-[#f5f5f5]/60 space-y-1 list-disc list-inside">
          <li>Set up Google Service Account</li>
          <li>Add GOOGLE_SHEETS_ID to .env</li>
          <li>Add GOOGLE_SERVICE_ACCOUNT_KEY to .env</li>
          <li>Share your Google Sheet with the service account email</li>
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-4">
        <Button onClick={() => setModal({ type: 'import-csv', open: true })} 
          disabled={loading || importLoading}
          variant="outline"
        >
          <span className="sm:hidden">Import Registrations</span>
          <span className="hidden sm:inline">Import Registrations from CSV</span>
        </Button>
        <Button
          onClick={() => setModal({ type: 'registration', open: true })}
          disabled={loading}
          variant="outline"
        >
          <span className="sm:hidden">Export Registration</span>
          <span className="hidden sm:inline">Export Registration to Google Sheets</span>
        </Button>
        <Button
          onClick={() => setModal({ type: 'seating', open: true })}
          disabled={loading}
          variant="outline"
        >
          <span className="sm:hidden">Export Seating</span>
          <span className="hidden sm:inline">Export Seating to Google Sheets</span>
        </Button>
        {/* Confirmation Modal */}
        {modal?.type === 'import-csv' && modal.open && renderImportCsvModal()}
        {(modal?.type === 'registration' || modal?.type === 'seating') && (
          <OkModal
            open={modal?.type === 'registration' || modal?.type === 'seating'}
            title={modal?.type === 'registration' ? 'Export Registration Data' : 'Export Seating Data'}
            message={modal?.type === 'registration'
              ? (<span>
                  You are about to overwrite all data in the {registrationSheetUrl ? (
                    <a href={registrationSheetUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-400" style={{ wordBreak: 'break-all' }}> <br></br>
                      TFN-GALA 2026 Registration Sheet
                    </a>
                  ) : 'TFN-GALA 2026 Registration Google Sheet'}.
                  <br /><br />
                  This action cannot be undone. Proceed?
                </span>)
              : (<span>
                  You are about to overwrite all data in the {seatingSheetUrl ? (
                    <a href={seatingSheetUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-400" style={{ wordBreak: 'break-all' }}><br></br>
                      TFN-GALA 2026 Seating Sheet
                    </a>
                  ) : 'TFN-GALA 2026 Seating Google Sheet'}.
                  <br /><br />
                  This action cannot be undone. Proceed?
                </span>)}
            onOk={() => {
              if (modal?.type === 'registration' || modal?.type === 'seating') {
                doExport(modal.type);
              }
            }}
            onCancel={() => setModal(null)}
            okText={loading ? 'Exporting...' : 'Export'}
            cancelText="Cancel"
            okDisabled={loading}
            cancelDisabled={loading}
          />
        )}
      </div>
    </Card>
  );
}
