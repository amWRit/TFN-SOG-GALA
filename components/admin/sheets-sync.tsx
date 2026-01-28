"use client";

import { useState } from "react";
import { OkModal } from "./ok-modal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";

export function SheetsSync() {
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<null | { type: 'registration' | 'seating', open: boolean }>(null);

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
        <Button disabled title="Import is currently disabled">
          <span className="sm:hidden">Import</span>
          <span className="hidden sm:inline">Import from Google Sheets (Disabled)</span>
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
        <OkModal
          open={!!modal}
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
                    TFN-GALA 2026 Seating Sheet'
                  </a>
                ) : 'TFN-GALA 2026 Seating Google Sheet'}.
                <br /><br />
                This action cannot be undone. Proceed?
              </span>)}
          onOk={() => modal && doExport(modal.type)}
          onCancel={() => setModal(null)}
          okText={loading ? 'Exporting...' : 'Export'}
          cancelText="Cancel"
          okDisabled={loading}
          cancelDisabled={loading}
        />
      </div>
    </Card>
  );
}
