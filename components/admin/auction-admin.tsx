"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import useSWR from "swr";
import { Plus, Edit, Trash2, Gavel, Pause, Play } from "lucide-react";
import styles from '../../styles/admin-dashboard.module.css';

interface AuctionItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  startingBid: number;
  currentBid: number;
  currentBidder: string | null;
  endTime: Date | null;
  isActive: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AuctionAdmin() {
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidModalItem, setBidModalItem] = useState<AuctionItem | null>(null);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const { data: items, mutate } = useSWR<AuctionItem[]>(
    "/api/admin/auction/items",
    fetcher
  );
  const [editingItem, setEditingItem] = useState<AuctionItem | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    startingBid: "",
    endTime: "",
    isActive: true,
  });
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused'>('all');

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      startingBid: "",
      endTime: "",
      isActive: true
    });
    setShowForm(true);
  };

  const handleEdit = (item: AuctionItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      startingBid: item.startingBid.toString(),
      endTime: item.endTime
        ? new Date(item.endTime).toISOString().slice(0, 16)
        : "",
      isActive: item.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      const url = editingItem
        ? `/api/admin/auction/items/${editingItem.id}`
        : "/api/admin/auction/items";
      const method = editingItem ? "PUT" : "POST";

      // Convert Google Drive share link to direct image link if needed
      let imageUrl = formData.imageUrl.trim();
      // More robust Google Drive link extraction
      const driveMatch = imageUrl.match(
        /^https?:\/\/drive\.google\.com\/file\/d\/([\w-]+)\//
      );
      if (driveMatch) {
        const fileId = driveMatch[1];
        imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          startingBid: parseFloat(formData.startingBid),
          endTime: formData.endTime ? new Date(formData.endTime).toISOString() : null,
        }),
      });

      if (res.ok) {
        toast.success(editingItem ? "Item updated!" : "Item created!");
        mutate();
        setShowForm(false);
        setEditingItem(null);
      } else {
        toast.error("Failed to save item");
      }
    } catch (error) {
      toast.error("Error saving item");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/admin/auction/items/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Item deleted!");
        mutate();
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      toast.error("Error deleting item");
    }
  };

  const handleUpdateBid = async (itemId: string, newBid: number, bidder: string) => {
    try {
      const res = await fetch(`/api/admin/auction/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionItemId: itemId,
          amount: newBid,
          bidderName: bidder,
        }),
      });

      if (res.ok) {
        toast.success("Bid updated!");
        mutate();
        // Update modal label immediately
        setBidModalItem((prev) =>
          prev && prev.id === itemId
            ? { ...prev, currentBid: newBid, currentBidder: bidder }
            : prev
        );
      }
    } catch (error) {
      toast.error("Error updating bid");
    }
  };

  // Add handler to toggle isActive for an item
  const handleToggleActive = async (item: AuctionItem) => {
    try {
      await fetch(`/api/admin/auction/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      mutate();
      toast.success(`Auction item ${!item.isActive ? "resumed" : "paused"}`);
    } catch {
      toast.error("Failed to update item status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-row items-center justify-between mb-2 gap-2 md:gap-4 w-full">
        <h2 className="font-playfair text-2xl font-bold text-[#D4AF37] hidden md:block">
          Auction Items
        </h2>
        <div className="flex-shrink-0 flex justify-center" style={{ minWidth: 0 }}>
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-full font-semibold border transition flex items-center gap-2 ${statusFilter === 'all' ? 'bg-[#D4AF37] text-[#1a1a1a] border-[#D4AF37]' : 'bg-[#222] text-[#f5f5f5]/80 border-[#444]'}`}
              onClick={() => setStatusFilter('all')}
            >
              {/* Icon for All: gray circle, only on small screens */}
              <span className="inline-block md:hidden w-3 h-3 rounded-full bg-[#888] mr-2"></span>
              <span className="hidden md:inline">All</span>
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold border transition flex items-center gap-2 ${statusFilter === 'active' ? 'bg-[#D4AF37] text-[#1a1a1a] border-[#D4AF37]' : 'bg-[#222] text-[#f5f5f5]/80 border-[#444]'}`}
              onClick={() => setStatusFilter('active')}
            >
              {/* Icon for Active: green circle, only on small screens */}
              <span className="inline-block md:hidden w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <span className="hidden md:inline">Active</span>
            </button>
            <button
              className={`px-4 py-2 rounded-full font-semibold border transition flex items-center gap-2 ${statusFilter === 'paused' ? 'bg-[#D4AF37] text-[#1a1a1a] border-[#D4AF37]' : 'bg-[#222] text-[#f5f5f5]/80 border-[#444]'}`}
              onClick={() => setStatusFilter('paused')}
            >
              {/* Icon for Paused: red circle, only on small screens */}
              <span className="inline-block md:hidden w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              <span className="hidden md:inline">Paused</span>
            </button>
          </div>
        </div>
        <div className="flex-shrink-0 flex justify-end" style={{ minWidth: 0 }}>
          <button className={styles.adminButtonSmall} onClick={handleCreate} type="button">
            <span className="inline md:hidden"><Plus size={20} /></span>
            <span className="hidden md:inline-flex items-center"><Plus size={18} className="mr-2" />Add Item</span>
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="glass-strong p-6">
          <h3 className="font-playfair text-xl font-bold text-[#D4AF37] mb-4">
            {editingItem ? "Edit Item" : "New Item"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <style>{`
              /* Make the calendar icon in datetime-local input white */
              input[type="datetime-local"]::-webkit-calendar-picker-indicator {
                filter: invert(1) brightness(2);
              }
              input[type="datetime-local"]::-webkit-input-placeholder {
                color: #f5f5f5;
              }
              input[type="datetime-local"]::-moz-placeholder {
                color: #f5f5f5;
              }
              input[type="datetime-local"]:-ms-input-placeholder {
                color: #f5f5f5;
              }
              input[type="datetime-local"]::placeholder {
                color: #f5f5f5;
              }
            `}</style>
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                Starting Bid *
              </label>
              <input
                type="number"
                value={formData.startingBid}
                onChange={(e) =>
                  setFormData({ ...formData, startingBid: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                Image URL
              </label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                placeholder="Paste Google Drive shareable link or direct image URL"
              />
              <p className="text-xs text-[#D4AF37] mt-1">
                You can use a Google Drive shareable link set to <b>Anyone with the link can view</b>.<br/>
                <span className="text-[#D4AF37]">(e.g. <span className="break-all">https://drive.google.com/file/d/FILE_ID/view?usp=sharing</span>).</span><br/>
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                End Time
              </label>
              <input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label className="text-sm text-[#f5f5f5]/80">Active</label>
            </div>
          </div>
          <div className="flex gap-2 mt-4 justify-end">
            <button
              className={styles.adminButtonSmall}
              type="button"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className={styles.adminButtonSmallRed}
              type="button"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </Card>
      )}

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items?.filter(item => {
          if (statusFilter === 'all') return true;
          if (statusFilter === 'active') return item.isActive;
          if (statusFilter === 'paused') return !item.isActive;
        }).slice().sort((a, b) => a.title.localeCompare(b.title)).map((item) => (
          <Card key={item.id} className="glass-strong p-4 relative">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-playfair text-lg font-bold text-[#D4AF37]">
                {item.title}
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 transition flex items-center justify-center"
                  onClick={() => handleEdit(item)}
                  title="Edit"
                >
                  <Edit size={16} className="text-[#D4AF37]" />
                </button>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 transition flex items-center justify-center"
                  onClick={() => handleDelete(item.id)}
                  title="Delete"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 transition flex items-center justify-center"
                  onClick={() => {
                    setBidModalItem(item);
                    setShowBidModal(true);
                  }}
                  title="Add Bid"
                >
                  <Gavel className="h-5 w-5 text-[#D4AF37]" />
                </button>
              </div>
            </div>
            <div className="text-sm text-[#f5f5f5]/80 mb-1">
              Current Bid: NPR {item.currentBid.toLocaleString()}
            </div>
            <div className="text-xs text-[#f5f5f5]/60 mb-2">
              Current Bidder: {item.currentBidder ? item.currentBidder : 'NA'}
            </div>
            {/* Pause/Play Button in bottom right */}
            <button
              type="button"
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-[#D4AF37]/20  hover:bg-[#D4AF37]/40 border-2 border-[#D4AF37] flex items-center justify-center shadow-lg hover:bg-[#D4AF37]/20 transition z-10"
              onClick={() => handleToggleActive(item)}
              title={item.isActive ? "Pause Bidding" : "Resume Bidding"}
            >
              {item.isActive ? <Pause className="w-6 h-6 text-[#D4AF37]" /> : <Play className="w-6 h-6 text-[#D4AF37]" />}
            </button>
            {/* Add Bid button moved to header row */}
          </Card>
        ))}
      </div>
    {/* Bid Modal */}
    {showBidModal && bidModalItem && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className="bg-[#222] rounded-2xl p-12 w-full max-w-xl min-h-[420px] relative border-4 border-[#D4AF37] shadow-2xl animate-pulse-slow flex flex-col justify-center">
          <button
            className="absolute top-4 right-4 text-[#D4AF37] text-4xl font-extrabold hover:text-white transition drop-shadow-lg z-10"
            onClick={() => setShowBidModal(false)}
            title="Close"
            style={{ lineHeight: 1, padding: 0 }}
          >
            ×
          </button>
          <h3 className="font-playfair text-xl font-bold text-[#D4AF37] mb-4 text-center">
            Add Bid for {bidModalItem.title}
          </h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (isSubmittingBid) return;
              setIsSubmittingBid(true);
              try {
                const form = e.target as HTMLFormElement;
                const amountInput = form.elements.namedItem('amount') as HTMLInputElement;
                const bidderInput = form.elements.namedItem('bidder') as HTMLInputElement;
                const amount = parseFloat(amountInput.value);
                let bidder = bidderInput.value.trim();
                if (!amount || isNaN(amount)) {
                  toast.error('Please enter a valid bid amount.');
                  setIsSubmittingBid(false);
                  return;
                }
                if (amount <= (bidModalItem.currentBid || 0)) {
                  toast.error(`Bid must be greater than current bid (NPR ${bidModalItem.currentBid.toLocaleString()})`);
                  setIsSubmittingBid(false);
                  return;
                }
                if (!bidder) bidder = 'NA';
                await handleUpdateBid(bidModalItem.id, amount, bidder);
                // Clear the form fields after successful submission
                amountInput.value = '';
                bidderInput.value = '';
              } finally {
                setIsSubmittingBid(false);
              }
            }}
            className="flex flex-col gap-6"
          >
            <div>
              <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-1">Bid Amount * <span className="text-xs text-[#D4AF37]">(Current: NPR {bidModalItem.currentBid.toLocaleString()})</span></label>
              <input
                type="number"
                name="amount"
                min={((bidModalItem.currentBid || 0) + 0.01).toFixed(2)}
                step="0.01"
                required
                className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-[#D4AF37]/30 text-[#f5f5f5] text-2xl"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-1">Bidder Name (optional)</label>
              <input
                type="text"
                name="bidder"
                placeholder="Leave blank for 'NA'"
                className="w-full px-3 py-2 rounded bg-[#1a1a1a] border border-[#D4AF37]/30 text-[#f5f5f5] text-2xl"
              />
            </div>
            <div className="flex gap-2 justify-end mt-6">
              {/* Cancel button hidden for now */}
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#D4AF37] text-[#1a1a1a] font-bold hover:bg-[#bfa134] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSubmittingBid}
              >
                {isSubmittingBid ? 'Submitting...' : 'Submit Bid'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
  );
}
