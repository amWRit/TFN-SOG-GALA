"use client";

import React, { useState, useEffect } from "react";
import { Trash2, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";

const CATEGORIES = ["Ticket Sales", "Program Support", "Other"] as const;
type Category = (typeof CATEGORIES)[number];

interface PreAuctionEntry {
  id: string;
  category: string;
  amount: number;
  note: string | null;
  createdAt: string;
}

export function PreAuctionAdmin() {
  const [entries, setEntries] = useState<PreAuctionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ category: Category; amount: string; note: string }>({
    category: "Ticket Sales",
    amount: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchEntries = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/pre-auction-entries");
    if (res.ok) {
      const data = await res.json();
      setEntries(data.entries ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!form.category || isNaN(amount) || amount <= 0) {
      toast.error("Enter a valid category and amount");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/admin/pre-auction-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: form.category, amount, note: form.note || null }),
    });
    if (res.ok) {
      toast.success("Entry added");
      setForm({ category: "Ticket Sales", amount: "", note: "" });
      await fetchEntries();
    } else {
      toast.error("Failed to add entry");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const res = await fetch(`/api/admin/pre-auction-entries/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Entry removed");
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } else {
      toast.error("Failed to remove entry");
    }
    setDeleting(null);
  };

  // Group totals per category
  const totals = CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[cat] = entries.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
    return acc;
  }, {});

  const grandTotal = entries.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-[#D4AF37]">Pre-Auction Fundraising</h2>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => (
          <div key={cat} className="bg-[#101b36] rounded-lg px-4 py-3 text-center">
            <div className="text-xs uppercase tracking-widest text-gray-400 mb-1">{cat}</div>
            <div className="text-lg font-bold text-white">NPR {totals[cat].toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="bg-[#1a2540] rounded-lg px-4 py-3 text-center">
        <span className="text-xs uppercase tracking-widest text-yellow-500 mr-2">Total Pre-Auction</span>
        <span className="text-xl font-bold text-yellow-300">NPR {grandTotal.toLocaleString()}</span>
      </div>

      {/* Add entry form */}
      <form onSubmit={handleAdd} className="bg-[#101b36] p-4 rounded-lg space-y-3">
        <h3 className="text-sm font-semibold text-[#f5f5f5]/80 uppercase tracking-wide">Add Entry</h3>
        <div className="flex gap-3 flex-wrap">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
            className="rounded px-3 py-2 bg-gray-800 text-white flex-1 min-w-[140px]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Amount (NPR)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="rounded px-3 py-2 bg-gray-800 text-white flex-1 min-w-[130px]"
            min={1}
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="rounded px-3 py-2 bg-gray-800 text-white flex-1 min-w-[160px]"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 bg-[#D4AF37] text-[#1a1a1a] font-semibold px-4 py-2 rounded disabled:opacity-60"
        >
          <PlusCircle size={16} />
          {submitting ? "Adding..." : "Add Entry"}
        </button>
      </form>

      {/* Entries list */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-gray-400 text-sm text-center py-4">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-4">No entries yet.</div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between bg-[#101b36] rounded-lg px-4 py-3"
            >
              <div className="flex flex-col">
                <span className="text-xs text-gray-400 uppercase tracking-wide">{entry.category}</span>
                <span className="text-white font-semibold">NPR {entry.amount.toLocaleString()}</span>
                {entry.note && <span className="text-xs text-gray-500 mt-0.5">{entry.note}</span>}
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                disabled={deleting === entry.id}
                className="text-red-400 hover:text-red-300 p-1 disabled:opacity-40"
                title="Remove entry"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
