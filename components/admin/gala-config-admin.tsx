import React, { useState, useEffect } from "react";

export function GalaConfigAdmin() {
  const [form, setForm] = useState({ galaYear: 2026, targetAmount: 10000 });
  const [preAuctionTotal, setPreAuctionTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("/api/fundraising/summary")
      .then((res) => res.json())
      .then((data) => {
        setForm({
          galaYear: data.galaYear,
          targetAmount: data.targetAmount,
        });
        setPreAuctionTotal(data.preAuctionTotal ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    const res = await fetch("/api/admin/gala-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess(true);
    } else {
      setError("Failed to update config");
    }
    setSaving(false);
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#101b36] p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold text-[#D4AF37] mb-2">Gala Config</h2>
      <div>
        <label className="block text-[#f5f5f5]/80 mb-1">Gala Year</label>
        <input type="number" name="galaYear" value={form.galaYear} onChange={handleChange} className="w-full rounded px-3 py-2 bg-gray-800 text-white" />
      </div>
      <div>
        <label className="block text-[#f5f5f5]/80 mb-1">Target Amount</label>
        <input type="number" name="targetAmount" value={form.targetAmount} onChange={handleChange} className="w-full rounded px-3 py-2 bg-gray-800 text-white" />
      </div>
      <div>
        <label className="block text-[#f5f5f5]/60 mb-1 text-sm">Pre-auction Total (auto-computed)</label>
        <div className="w-full rounded px-3 py-2 bg-gray-900 text-gray-400 border border-gray-700 select-none">
          NPR {preAuctionTotal.toLocaleString()}
        </div>
        <p className="text-xs text-gray-500 mt-1">Managed automatically from Pre-auction entries.</p>
      </div>
      <button type="submit" className="bg-[#D4AF37] text-[#1a1a1a] font-semibold px-4 py-2 rounded mt-2" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
      {success && <div className="text-green-400 mt-2">Config updated!</div>}
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </form>
  );
}
