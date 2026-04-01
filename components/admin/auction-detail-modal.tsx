"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface AuctionItem {
  id: string;
  title: string;
  sequence: number;
  patron?: string | null;
  description: string | null;
  imageUrl: string | null;
  actualPrice?: number;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endTime: Date | null;
  isActive: boolean;
}

interface AuctionDetailModalProps {
  open: boolean;
  item: AuctionItem | null;
  onClose: () => void;
}

export function AuctionDetailModal({ open, item, onClose }: AuctionDetailModalProps) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-2">
      <div className="glass-strong rounded-2xl w-full max-w-3xl p-5 md:p-6 border border-[#D4AF37]/30 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 flex items-center justify-center"
          aria-label="Close"
        >
          <X size={18} className="text-[#D4AF37]" />
        </button>

        <div className="flex items-center gap-3 mb-4 pr-10">
          <div className="text-xl md:text-2xl font-bold text-[#D4AF37] w-10 text-center select-none">{item.sequence}</div>
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#D4AF37] leading-tight">{item.title}</h3>
        </div>

        <div className="space-y-4">
          <div className="relative w-full h-56 rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#111]">
            <Image
              src={item.imageUrl && item.imageUrl.trim() !== "" ? item.imageUrl : "/images/auctionitemplateholder.jpg"}
              alt={item.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-lg bg-[#1a1a1a]/50 border border-[#D4AF37]/20 p-3">
              <div className="text-xs text-[#f5f5f5]/70">Actual Price</div>
              <div className="text-sm font-semibold text-[#f5f5f5]">NPR {(item.actualPrice || 0).toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-[#1a1a1a]/50 border border-[#D4AF37]/20 p-3">
              <div className="text-xs text-[#f5f5f5]/70">Starting Bid</div>
              <div className="text-base font-semibold text-[#f5f5f5]">NPR {item.startingBid.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-[#1a1a1a]/50 border border-[#D4AF37]/20 p-3">
              <div className="text-xs text-[#f5f5f5]/70">Current Bidder</div>
              <div className="text-sm font-semibold text-[#f5f5f5]">{item.currentBidder || "NA"}</div>
            </div>
            <div className="rounded-lg bg-[#1a1a1a]/50 border border-[#D4AF37]/20 p-3">
              <div className="text-xs text-[#f5f5f5]/70">Current Bid</div>
              <div className="text-base font-semibold text-[#f5f5f5]">NPR {item.currentBid.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg bg-[#1a1a1a]/50 border border-[#D4AF37]/20 p-3">
              <div className="text-xs text-[#f5f5f5]/70">End Time</div>
              <div className="text-sm font-semibold text-[#f5f5f5]">
                {item.endTime ? new Date(item.endTime).toLocaleString() : "NA"}
              </div>
            </div>
            <div className="rounded-lg bg-[#1a1a1a]/50 border border-[#D4AF37]/20 p-3">
              <div className="text-xs text-[#f5f5f5]/70">Status</div>
              <div className="text-sm font-semibold text-[#f5f5f5]">{item.isActive ? "Active" : "Paused"}</div>
            </div>
          </div>

          <div>
            <div className="text-xs text-[#f5f5f5]/70 mb-1">About the Product</div>
            <div className="text-sm text-[#f5f5f5]/90 whitespace-pre-line">{item.description || "NA"}</div>
          </div>

          <div>
            <div className="text-xs text-[#f5f5f5]/70 mb-1">About the Patron</div>
            <div className="text-sm text-[#f5f5f5]/90 whitespace-pre-line">{item.patron || "NA"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
