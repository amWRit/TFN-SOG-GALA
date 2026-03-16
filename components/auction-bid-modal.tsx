"use client";

import { useState } from "react";
import { Gavel, X } from "lucide-react";

interface BidModalItem {
  id: string;
  title: string;
  currentBid: number;
  isActive: boolean;
  endTime: Date | null;
}

interface BidModalProps {
  item: BidModalItem;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BidModal({ item, onClose, onSuccess }: BidModalProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [bidderName, setBidderName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isClosed =
    !item.isActive ||
    (item.endTime && new Date(item.endTime).getTime() <= Date.now());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#dadfe1] rounded-2xl w-full max-w-lg relative shadow-2xl border border-[#1f365f]/20 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-[#d13239]" />

        <div className="p-8">
          {/* Close button */}
          <button
            className="absolute top-5 right-5 text-[#1f365f]/50 hover:text-[#1f365f] transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={22} />
          </button>

          {/* Item info */}
          <div className="mb-7">
            <div className="text-xs text-[#1f365f]/50 uppercase tracking-widest font-semibold mb-2">
              Placing bid on
            </div>
            <div className="text-2xl font-bold text-[#1f365f] leading-snug mb-3">
              {item.title}
            </div>
            <div className="flex items-center justify-center gap-10 flex-wrap">
              <div className="flex flex-col items-center">
                <span className="text-xs text-[#1f365f]/50 uppercase tracking-wider mb-0.5">Current Bid</span>
                <span className="font-playfair text-3xl font-bold text-[#D4AF37]">
                  NPR {item.currentBid.toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-[#1f365f]/50 uppercase tracking-wider mb-0.5">Minimum Bid</span>
                <span className="font-playfair text-3xl font-bold text-[#D4AF37]">
                  NPR {(item.currentBid + 1).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-5"
            onSubmit={async e => {
              e.preventDefault();
              if (isClosed || submitting) return;
              setError(null);
              setSuccess(null);
              setSubmitting(true);
              try {
                const res = await fetch("/api/auction/items/bid", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    auctionItemId: item.id,
                    amount: Number(bidAmount),
                    bidderName: bidderName.trim(),
                  }),
                });
                if (res.ok) {
                  setSuccess("Bid placed successfully!");
                  setBidAmount("");
                  setBidderName("");
                  setTimeout(() => {
                    onClose();
                    onSuccess?.();
                  }, 1200);
                } else {
                  const data = await res.json();
                  setError(data.error || "Failed to place bid");
                }
              } catch {
                setError("Network error. Please try again.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1f365f] uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-white text-[#1f365f] border border-[#1f365f]/25 focus:outline-none focus:border-[#d13239] transition-colors placeholder:text-[#1f365f]/35 text-base"
                placeholder="Enter your full name"
                value={bidderName}
                onChange={e => setBidderName(e.target.value)}
                required
                minLength={2}
                maxLength={64}
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#1f365f] uppercase tracking-wider">
                Bid Amount <span className="normal-case font-normal text-[#1f365f]/50">(NPR)</span>
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 rounded-xl bg-white text-[#1f365f] border border-[#1f365f]/25 focus:outline-none focus:border-[#d13239] transition-colors placeholder:text-[#1f365f]/35 text-base"
                placeholder={`e.g. ${(item.currentBid + 100).toLocaleString()}`}
                value={bidAmount}
                onChange={e => setBidAmount(e.target.value)}
                min={item.currentBid + 1}
                step={1}
                required
                disabled={submitting}
              />
            </div>

            {error && (
              <div className="text-red-700 text-sm text-center bg-red-100 border border-red-300 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-700 text-sm text-center bg-green-100 border border-green-300 px-4 py-3 rounded-xl">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 mt-1 rounded-xl bg-[#d13239] hover:bg-[#b82b31] text-white font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#d13239]/30"
              disabled={!!isClosed || submitting}
            >
              <Gavel size={18} />
              {submitting ? "Placing Bid…" : "Confirm Bid"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
