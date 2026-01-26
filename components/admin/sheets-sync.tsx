"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { RefreshCw } from "lucide-react";

export function SheetsSync() {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sheets/sync", {
        method: "POST",
      });

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

      <div className="space-y-4">
        <div className="bg-[#1a1a1a]/50 p-4 rounded-lg">
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

        <Button onClick={handleSync} disabled={loading}>
          <RefreshCw
            size={18}
            className={`mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Sync Now
        </Button>
      </div>
    </Card>
  );
}
