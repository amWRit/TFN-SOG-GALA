"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import styles from '../../styles/admin-dashboard.module.css';

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
    <div className={"fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md " + styles.modalBackdrop}>
      <div className={"bg-[#222] rounded-2xl p-6 min-h-[320px] relative border-4 border-[#D4AF37] shadow-2xl flex flex-col " + styles.modalBox + " w-full max-w-full sm:max-w-lg sm:w-full mx-2"}>
        <button
          className={"absolute top-4 right-4 text-[#D4AF37] text-3xl font-extrabold hover:text-white transition drop-shadow-lg z-10 " + styles.closeButton}
          onClick={onClose}
          title="Close"
          style={{ lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
        <h3 className={"font-playfair text-xl font-bold text-[#D4AF37] mb-4 text-center " + styles.modalTitle}>
          Bid History
        </h3>
        {loading ? (
          <div className={"text-center text-[#D4AF37] py-8 " + styles.loadingText}>Loading...</div>
        ) : bids.length === 0 ? (
          <div className={"text-center text-[#f5f5f5]/70 py-8 " + styles.emptyText}>No bids yet for this item.</div>
        ) : (
          <div className={"overflow-x-auto max-h-[340px] " + styles.tableWrapper}>
            <table className={"min-w-full text-sm text-left text-[#f5f5f5] " + styles.table}>
              <thead>
                <tr className={"border-b border-[#D4AF37]/40 " + styles.tableHeaderRow}>
                  <th className={"px-3 py-2 " + styles.tableHeaderCell}>Bidder</th>
                  <th className={"px-3 py-2 " + styles.tableHeaderCell}>Amount</th>
                  <th className={"px-3 py-2 " + styles.tableHeaderCell}>Time</th>
                </tr>
              </thead>
              <tbody>
                {bids.map(bid => (
                  <tr key={bid.id} className={"border-b border-[#D4AF37]/10 " + styles.tableRow}>
                    <td className={"px-3 py-2 " + styles.tableCell}>{bid.bidderName}</td>
                    <td className={"px-3 py-2 " + styles.tableCell}>NPR {bid.amount.toLocaleString()}</td>
                    <td className={"px-3 py-2 " + styles.tableCell}>{new Date(bid.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={"flex justify-end mt-4 " + styles.modalActions}>
          <Button onClick={onClose} className={styles.adminButtonSmallRed }>Close</Button>
        </div>
      </div>
    </div>
  );
}
