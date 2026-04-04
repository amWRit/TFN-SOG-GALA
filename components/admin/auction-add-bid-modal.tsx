"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface AuctionItem {
  id: string;
  title: string;
  currentBid: number;
  startingBid: number;
}

interface AuctionAddBidModalProps {
  open: boolean;
  item: AuctionItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (itemId: string, amount: number, bidder: string) => Promise<void>;
}


export function AuctionAddBidModal({ open, item, isSubmitting, onClose, onSubmit }: AuctionAddBidModalProps) {
  const minBid = item ? (item.currentBid > 0 ? item.currentBid + 1 : item.startingBid) : 1;
  const [amount, setAmount] = useState("");
  const [bidder, setBidder] = useState("");

  // Reset amount to minBid whenever modal opens or item changes
  React.useEffect(() => {
    if (open && item) {
      setAmount("");
    }
  }, [open, item]);

  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#222] rounded-2xl p-12 w-full max-w-xl min-h-[420px] relative border-4 border-[#D4AF37] shadow-2xl animate-pulse-slow flex flex-col justify-center">
        <button
          className="absolute top-4 right-4 text-[#D4AF37] text-4xl font-extrabold hover:text-white transition drop-shadow-lg z-10"
          onClick={onClose}
          title="Close"
          style={{ lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
        <h3 className="font-playfair text-xl font-bold text-[#D4AF37] mb-4 text-center">
          Add Bid for {item.title}
        </h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (isSubmitting) return;
            const amountNum = parseFloat(amount);
            let bidderName = bidder.trim();
            if (!amountNum || isNaN(amountNum)) {
              toast.error('Please enter a valid bid amount.');
              return;
            }
            const minBid = item.currentBid > 0 ? item.currentBid + 1 : item.startingBid;
            if (amountNum < minBid) {
              toast.error(`Bid must be at least NPR ${minBid.toLocaleString()}`);
              return;
            }
            if (!bidderName) bidderName = 'NA';
            await onSubmit(item.id, amountNum, bidderName);
            setAmount("");
            setBidder("");
          }}
          className="flex flex-col gap-6"
        >
          <div>
            <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-1">
              Bid Amount *
              <span className="text-xs text-[#D4AF37]">
                (Min: NPR {(item.currentBid > 0 ? item.currentBid + 1 : item.startingBid).toLocaleString()})
              </span>
            </label>
            <input
              type="number"
              name="amount"
              min={item.currentBid > 0 ? item.currentBid + 1 : item.startingBid}
              step=""
              required
              className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-[#D4AF37]/30 text-[#f5f5f5] text-2xl"
              value={amount}
              placeholder={(item.currentBid > 0 ? item.currentBid + 1 : item.startingBid).toLocaleString()}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-1">Bidder Name (optional)</label>
            <input
              type="text"
              name="bidder"
              placeholder="Leave blank for 'NA'"
              className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-[#D4AF37]/30 text-[#f5f5f5] text-2xl"
              value={bidder}
              onChange={e => setBidder(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between gap-2 mt-6">
            <span className="text-xs text-[#f5f5f5]/70">Press <b>Enter</b> to submit</span>
            <div className="flex gap-2 justify-end">
              <Button
                type="submit"
                className="px-4 py-2 rounded bg-[#D4AF37] text-[#1a1a1a] font-bold hover:bg-[#bfa134] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Bid'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
