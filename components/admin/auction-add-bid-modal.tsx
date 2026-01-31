import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface AuctionItem {
  id: string;
  title: string;
  currentBid: number;
}

interface AuctionAddBidModalProps {
  open: boolean;
  item: AuctionItem | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (itemId: string, amount: number, bidder: string) => Promise<void>;
}

export function AuctionAddBidModal({ open, item, isSubmitting, onClose, onSubmit }: AuctionAddBidModalProps) {
  const [amount, setAmount] = useState("");
  const [bidder, setBidder] = useState("");

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
            if (amountNum <= (item.currentBid || 0)) {
              toast.error(`Bid must be greater than current bid (NPR ${item.currentBid.toLocaleString()})`);
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
            <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-1">Bid Amount * <span className="text-xs text-[#D4AF37]">(Current: NPR {item.currentBid.toLocaleString()})</span></label>
            <input
              type="number"
              name="amount"
              min={((item.currentBid || 0) + 0.01).toFixed(2)}
              step="0.01"
              required
              className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-[#D4AF37]/30 text-[#f5f5f5] text-2xl"
              value={amount}
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
          <div className="flex gap-2 justify-end mt-6">
            <Button
              type="submit"
              className="px-4 py-2 rounded bg-[#D4AF37] text-[#1a1a1a] font-bold hover:bg-[#bfa134] disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Bid'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
