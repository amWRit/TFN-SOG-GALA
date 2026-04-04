"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import styles from '../../styles/admin-dashboard.module.css';
import { Trash2, Pencil, Check, X } from "lucide-react";
import { OkModal } from "@/components/admin/ok-modal";
import toast from "react-hot-toast";

interface Bid {
  id: string;
  amount: number;
  bidderName: string;
  createdAt: string;
}

interface AuctionBidHistoryModalProps {
  open: boolean;
  itemId: string | null;
  isActive?: boolean;
  itemTitle?: string;
  onClose: () => void;
}

export function AuctionBidHistoryModal({ open, itemId, isActive, itemTitle, onClose }: AuctionBidHistoryModalProps) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteBidId, setDeleteBidId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  // Edit state
  const [editBidId, setEditBidId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editBidder, setEditBidder] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const handleDelete = async (bidId: string) => {
    setDeleteBidId(bidId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteBidId) return;
    await fetch(`/api/admin/auction/bid/${deleteBidId}`, { method: 'DELETE' });
    setBids(bids => bids.filter(b => b.id !== deleteBidId));
    setDeleteBidId(null);
    setConfirmOpen(false);
  };

  const handleClearAll = () => {
    setClearConfirmOpen(true);
  };

  const confirmClearAll = async () => {
    if (!itemId) return;
    await fetch(`/api/admin/auction/bid/clear?itemId=${itemId}`, { method: 'DELETE' });
    setBids([]);
    setClearConfirmOpen(false);
  };

  const handleEditStart = (bid: Bid) => {
    setEditBidId(bid.id);
    setEditAmount(String(bid.amount));
    setEditBidder(bid.bidderName);
  };

  const handleEditCancel = () => {
    setEditBidId(null);
    setEditAmount("");
    setEditBidder("");
  };

  const handleEditSave = async (bid: Bid) => {
    const newAmount = parseFloat(editAmount);
    if (!editAmount || isNaN(newAmount) || newAmount <= 0) {
      toast.error("Please enter a valid bid amount.");
      return;
    }

    setEditSaving(true);
    try {
      const res = await fetch(`/api/admin/auction/bid/${bid.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newAmount, bidderName: editBidder }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to update bid.");
        return;
      }
      setBids(prev =>
        prev.map(b =>
          b.id === bid.id
            ? { ...b, amount: newAmount, bidderName: editBidder || b.bidderName }
            : b
        )
      );
      setEditBidId(null);
      toast.success("Bid updated.");
    } catch {
      toast.error("Failed to update bid.");
    } finally {
      setEditSaving(false);
    }
  };

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
      <div className={"bg-[#222] rounded-2xl p-6 min-h-[320px] relative border-4 border-[#D4AF37] shadow-2xl flex flex-col " + styles.modalBox + " w-full max-w-full sm:max-w-lg lg:max-w-3xl sm:w-full mx-2"}>
        <button
          className={"absolute top-4 right-4 text-[#D4AF37] text-3xl font-extrabold hover:text-white transition drop-shadow-lg z-10 " + styles.closeButton}
          onClick={onClose}
          title="Close"
          style={{ lineHeight: 1, padding: 0 }}
        >
          ×
        </button>
        <h3 className={"font-playfair text-xl font-bold text-[#D4AF37] mb-1 text-center " + styles.modalTitle}>
          Bid History
        </h3>
        {itemTitle && (
          <p className="text-center text-[#f5f5f5]/60 text-sm mb-4 truncate">{itemTitle}</p>
        )}
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
                  <th className={"px-3 py-2 " + styles.tableHeaderCell}></th>
                </tr>
              </thead>
              <tbody>
                {bids.map(bid => (
                  editBidId === bid.id ? (
                    <tr key={bid.id} className={"border-b border-[#D4AF37]/30 bg-[#2a2a1a] " + styles.tableRow}>
                      <td className={"px-2 py-2 " + styles.tableCell}>
                        <input
                          type="text"
                          value={editBidder}
                          onChange={e => setEditBidder(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-[#1a1a1a] border border-[#D4AF37]/40 text-[#f5f5f5] text-sm"
                          placeholder="Bidder name"
                        />
                      </td>
                      <td className={"px-2 py-2 " + styles.tableCell}>
                        <input
                          type="number"
                          value={editAmount}
                          onChange={e => setEditAmount(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-[#1a1a1a] border border-[#D4AF37]/40 text-[#f5f5f5] text-sm"
                          placeholder="Amount"
                          autoFocus
                          onKeyDown={e => {
                            if (e.key === "Enter") handleEditSave(bid);
                            if (e.key === "Escape") handleEditCancel();
                          }}
                        />
                      </td>
                      <td className={"px-3 py-2 text-xs text-[#f5f5f5]/50 " + styles.tableCell}>
                        {new Date(bid.createdAt).toLocaleString()}
                      </td>
                      <td className={"px-2 py-2 text-right " + styles.tableCell}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEditSave(bid)}
                            disabled={editSaving}
                            title="Save"
                            className="text-green-400 hover:text-green-200 transition disabled:opacity-50"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            disabled={editSaving}
                            title="Cancel"
                            className="text-[#f5f5f5]/50 hover:text-white transition disabled:opacity-50"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                  <tr key={bid.id} className={"border-b border-[#D4AF37]/10 " + styles.tableRow}>
                    <td className={"px-3 py-2 " + styles.tableCell}>{bid.bidderName}</td>
                    <td className={"px-3 py-2 " + styles.tableCell}>NPR {bid.amount.toLocaleString()}</td>
                    <td className={"px-3 py-2 " + styles.tableCell}>{new Date(bid.createdAt).toLocaleString()}</td>
                    <td className={"px-3 py-2 text-right " + styles.tableCell}>
                      <div className="flex items-center justify-end gap-2">
                        {isActive && (
                          <button onClick={() => handleEditStart(bid)} title="Edit Bid" className="text-[#D4AF37] hover:text-white transition">
                            <Pencil size={16} />
                          </button>
                        )}
                        <button onClick={() => handleDelete(bid.id)} title="Delete Bid" className="text-red-500 hover:text-white transition">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={"flex justify-end mt-4 gap-2 " + styles.modalActions}>
          <Button onClick={onClose} className={styles.adminButtonSmallRed }>Close</Button>
          <Button onClick={handleClearAll} className={styles.adminButtonSmallRed }>Clear All</Button>
        </div>
        <OkModal
          open={confirmOpen}
          title="Delete Bid?"
          message="Are you sure you want to delete this bid? This action cannot be undone."
          onOk={confirmDelete}
          onCancel={() => setConfirmOpen(false)}
          okText="Delete"
          cancelText="Cancel"
        />
        <OkModal
          open={clearConfirmOpen}
          title="Clear All Bids?"
          message="Are you sure you want to delete all bids for this item? This action cannot be undone."
          onOk={confirmClearAll}
          onCancel={() => setClearConfirmOpen(false)}
          okText="Clear All"
          cancelText="Cancel"
        />
      </div>
    </div>
  );
}
