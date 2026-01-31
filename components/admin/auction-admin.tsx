"use client";

import { useState } from "react";
import { AuctionAddBidModal } from "@/components/admin/auction-add-bid-modal";
import { AuctionItemAdminCard } from "@/components/admin/auction-item-admin-card";
import { AuctionBidHistoryModal } from "@/components/admin/auction-bid-history-modal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import useSWR from "swr";
import { Plus, Edit, Trash2, Gavel, Pause, Play, Pencil } from "lucide-react";
import { OkModal } from "@/components/admin/ok-modal";
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
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyItemId, setHistoryItemId] = useState<string | null>(null);
  
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

  // Modal state for delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/auction/items/${deleteId}`, {
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
    setDeleting(false);
    setDeleteId(null);
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
          <AuctionItemAdminCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onAddBid={(item) => { setBidModalItem(item); setShowBidModal(true); }}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onShowHistory={(item) => { setHistoryItemId(item.id); setShowHistoryModal(true); }}
            deleteId={deleteId}
            deleting={deleting}
            confirmDelete={confirmDelete}
            cancelDelete={() => setDeleteId(null)}
          />
        ))}
      </div>
    <AuctionBidHistoryModal
      open={showHistoryModal}
      itemId={historyItemId}
      onClose={() => setShowHistoryModal(false)}
    />
    <AuctionAddBidModal
      open={showBidModal}
      item={bidModalItem}
      isSubmitting={isSubmittingBid}
      onClose={() => setShowBidModal(false)}
      onSubmit={handleUpdateBid}
    />
  </div>
  );
}
