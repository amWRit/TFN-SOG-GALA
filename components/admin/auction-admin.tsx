"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import useSWR from "swr";
import { Plus, Edit, Trash2 } from "lucide-react";

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

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      startingBid: "",
      endTime: "",
      isActive: true,
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

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
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
      }
    } catch (error) {
      toast.error("Error updating bid");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-playfair text-2xl font-bold text-[#D4AF37]">
          Auction Items
        </h2>
        <Button onClick={handleCreate}>
          <Plus size={18} className="mr-2" />
          Add Item
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="glass-strong p-6">
          <h3 className="font-playfair text-xl font-bold text-[#D4AF37] mb-4">
            {editingItem ? "Edit Item" : "New Item"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              />
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
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((item) => (
          <Card key={item.id} className="glass-strong p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-playfair text-lg font-bold text-[#D4AF37]">
                {item.title}
              </h3>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(item)}>
                  <Edit size={16} className="text-[#D4AF37]" />
                </button>
                <button onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>
            <div className="text-sm text-[#f5f5f5]/80 mb-2">
              Current Bid: ${item.currentBid.toLocaleString()}
            </div>
            {item.currentBidder && (
              <div className="text-xs text-[#f5f5f5]/60 mb-3">
                Leading: {item.currentBidder}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="New bid"
                className="flex-1 px-2 py-1 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded text-sm text-[#f5f5f5]"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const amount = parseFloat(e.currentTarget.value);
                    const bidder = prompt("Bidder name:");
                    if (bidder && amount) {
                      handleUpdateBid(item.id, amount, bidder);
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
