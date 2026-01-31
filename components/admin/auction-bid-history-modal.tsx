"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface Bid {
  id: string;
  amount: number;
  bidderName: string;
  createdAt: string;
}

interface AuctionBidHistoryModalProps {
  open: boolean;
  itemId: string | null;
  onClose: () => void;
}

export function AuctionBidHistoryModal({ open, itemId, onClose }: AuctionBidHistoryModalProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !itemId) return;
    setLoading(true);
    fetch(`/api/admin/auction/items/${itemId}/bids`)
      .then(res => res.json())
      .then(data => setBids(data.bids || []))
      .finally(() => setLoading(false));
  }, [open, itemId]);

  if (!open || !itemId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="bg-[#222] rounded-2xl p-6 w-full max-w-lg min-h-[320px] relative border-4 border-[#D4AF37] shadow-2xl flex flex-col">
        <button
          className="absolute top-4 right-4 text-[#D4AF37] text-3xl font-extrabold hover:text-white transition drop-shadow-lg z-10"
          onClick={onClose}
          title="Close"
          style={{ lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
        <h3 className="font-playfair text-xl font-bold text-[#D4AF37] mb-4 text-center">
          Bid History
        </h3>
        {loading ? (
          <div className="text-center text-[#D4AF37] py-8">Loading...</div>
        ) : bids.length === 0 ? (
          <div className="text-center text-[#f5f5f5]/70 py-8">No bids yet for this item.</div>
        ) : (
          <div className="overflow-x-auto max-h-[340px]">
            <table className="min-w-full text-sm text-left text-[#f5f5f5]">
              <thead>
                <tr className="border-b border-[#D4AF37]/40">
                  <th className="px-3 py-2">Bidder</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {bids.map(bid => (
                  <tr key={bid.id} className="border-b border-[#D4AF37]/10">
                    <td className="px-3 py-2">{bid.bidderName}</td>
                    <td className="px-3 py-2">NPR {bid.amount.toLocaleString()}</td>
                    <td className="px-3 py-2">{new Date(bid.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <Button onClick={onClose} className="bg-[#D4AF37] text-[#1a1a1a] font-bold px-4 py-2 rounded">Close</Button>
        </div>
      </div>
    </div>
  );
}
