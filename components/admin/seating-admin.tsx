"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import useSWR from "swr";
import styles from '../../styles/admin-dashboard.module.css';
import { Pencil, Trash2 } from "lucide-react";
import { OkModal } from "@/components/admin/ok-modal";

interface SeatData {
  id: string;
  tableNumber: number;
  seatNumber: number;
  name: string | null;
  quote: string | null;
  bio: string | null;
  involvement: string | null;
  imageUrl: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SeatingAdmin() {
  const { data: seats, mutate } = useSWR<SeatData[]>("/api/admin/seating", fetcher);
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    quote: "",
    bio: "",
    involvement: "",
    imageUrl: "",
  });
  // Add Table/Seats form state
  const [tableNumber, setTableNumber] = useState(1);
  const [seatCount, setSeatCount] = useState(8);
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState("");

  // Add Table modal state
  const [showAddTableModal, setShowAddTableModal] = useState(false);

  const handleSeatClick = (seat: SeatData) => {
    setShowAddTableModal(false);
    setSelectedSeat(seat);
    setFormData({
      name: seat.name || "",
      quote: seat.quote || "",
      bio: seat.bio || "",
      involvement: seat.involvement || "",
      imageUrl: seat.imageUrl || "",
    });
  };

  const handleSave = async () => {
    if (!selectedSeat) return;

    try {
      const res = await fetch("/api/admin/seating", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: selectedSeat.id,
          ...formData,
        }),
      });

      if (res.ok) {
        toast.success("Seat updated successfully!");
        mutate();
        setSelectedSeat(null);
        setShowEditModal(false);
      } else {
        toast.error("Failed to update seat");
      }
    } catch (error) {
      toast.error("Error updating seat");
    }
  };

  const handleClear = async () => {
    if (!selectedSeat) return;

    try {
      const res = await fetch("/api/admin/seating", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: selectedSeat.id,
          name: null,
          quote: null,
          bio: null,
          involvement: null,
          imageUrl: null,
        }),
      });

      if (res.ok) {
        toast.success("Seat cleared!");
        mutate();
        setSelectedSeat(null);
        setShowEditModal(false);
      }
    } catch (error) {
      toast.error("Error clearing seat");
    }
  };

  const handleExportJSON = () => {
    if (!seats) return;

    const jsonData = seats
      .filter((seat) => seat.name)
      .map((seat) => ({
        seat: `T${seat.tableNumber}-${String(seat.seatNumber).padStart(2, "0")}`,
        tableNumber: seat.tableNumber,
        seatNumber: seat.seatNumber,
        name: seat.name,
        quote: seat.quote,
        bio: seat.bio,
        involvement: seat.involvement,
        image: seat.imageUrl,
      }));

    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `seating-chart-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON exported!");
  };

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setAddMsg("");
    try {
      const res = await fetch("/api/admin/seating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber, seatCount }),
      });
      if (res.ok) {
        setAddMsg("Table and seats added!");
        mutate();
      } else {
        setAddMsg("Failed to add table/seats.");
      }
    } catch {
      setAddMsg("Network error.");
    }
    setAdding(false);
  };

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Group seats by table
  const tables: { [key: number]: SeatData[] } = {};
  seats?.forEach((seat) => {
    if (!tables[seat.tableNumber]) {
      tables[seat.tableNumber] = [];
    }
    tables[seat.tableNumber].push(seat);
  });

  // Remove useEffect that forcibly closes edit modal on seat select

  // Delete handler
  const handleDelete = async () => {
    if (!selectedSeat) return;
    try {
      // You may want to implement a DELETE endpoint for seats
      await fetch(`/api/admin/seating/${selectedSeat.id}`, { method: "DELETE" });
      toast.success("Seat deleted!");
      mutate();
      setSelectedSeat(null);
      setShowDeleteModal(false);
    } catch {
      toast.error("Error deleting seat");
    }
  };

  return (
    <>
      {/* Seating Grid with Add Table Button inside Card */}
      <div>
        <Card className="glass-strong p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-2xl font-bold text-[#D4AF37]">
                Seating Chart
              </h2>
              <div className="flex gap-2">
                <button
                  className={styles.adminButton}
                  onClick={handleExportJSON}
                  type="button"
                >
                  Export
                </button>
                <button
                  className={styles.adminButton}
                  onClick={() => setShowAddTableModal(true)}
                  type="button"
                >
                  + Add Table
                </button>
              </div>
            </div>
            {showAddTableModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className={styles.adminCard + " max-w-md w-full relative animate-fade-in"}>
                  <button
                    className="absolute top-3 right-4 text-2xl text-[#D4AF37] hover:text-[#B8941F] focus:outline-none"
                    onClick={() => setShowAddTableModal(false)}
                    aria-label="Close"
                    type="button"
                  >
                    ×
                  </button>
                  <h2 className="font-playfair text-xl font-bold text-[#D4AF37] mb-4">Add Table & Seats</h2>
                  <form onSubmit={handleAddTable} className="flex flex-col gap-4 items-center">
                    <label className={styles.adminFormLabel + " flex flex-col w-full"}>
                      Table Number
                      <input
                        type="number"
                        min={1}
                        value={tableNumber}
                        onChange={e => setTableNumber(Number(e.target.value))}
                        className={styles.adminInput + " mt-1"}
                        required
                      />
                    </label>
                    <label className={styles.adminFormLabel + " flex flex-col w-full"}>
                      Number of Seats
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={seatCount}
                        onChange={e => setSeatCount(Number(e.target.value))}
                        className={styles.adminInput + " mt-1"}
                        required
                      />
                    </label>
                    <button
                      type="submit"
                      className={styles.adminButton + " w-full"}
                      disabled={adding}
                    >
                      {adding ? "Adding..." : "Add Table & Seats"}
                    </button>
                  </form>
                  {addMsg && <p className={addMsg.includes('added') ? "text-green-400 mt-2" : "text-pink-400 mt-2"}>{addMsg}</p>}
                </div>
              </div>
            )}
            <div className="space-y-8">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((tableNum) => (
                <div key={tableNum}>
                  <h3 className="text-lg font-semibold text-[#D4AF37] mb-3">
                    Table {tableNum}
                  </h3>
                  <div className="grid grid-cols-5 gap-2">
                    {tables[tableNum]?.map((seat) => (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seat)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedSeat?.id === seat.id
                            ? "border-[#D4AF37] bg-[#D4AF37]/20"
                            : seat.name
                            ? "border-[#D4AF37]/50 bg-[#D4AF37]/10"
                            : "border-[#f5f5f5]/20 bg-[#1a1a1a]/50"
                        }`}
                      >
                        <div className="text-xs text-center">
                          <div className="font-medium text-[#f5f5f5]">
                            {seat.seatNumber}
                          </div>
                          {seat.name && (
                            <div className="text-[#D4AF37] text-xs mt-1 truncate">
                              {seat.name.split(" ")[0]}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        {/* Details Modal */}
        {selectedSeat && !showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className={styles.adminCard + " max-w-md w-full relative animate-fade-in p-0 overflow-visible"}>
              <button
                className="absolute top-3 right-4 text-2xl text-[#D4AF37] hover:text-[#B8941F] focus:outline-none"
                onClick={() => { setSelectedSeat(null); setShowEditModal(false); }}
                aria-label="Close"
                type="button"
              >
                ×
              </button>
              <div className="flex flex-col items-center p-6 pt-10">
                <div className="flex flex-col items-center w-full">
                  <div className="flex gap-2 mb-4 w-full justify-center">
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] font-bold px-3 py-1 rounded-full text-xs tracking-wide border border-[#D4AF37]/30">Table {selectedSeat.tableNumber}</span>
                    <span className="bg-[#f5f5f5]/10 text-[#f5f5f5] font-bold px-3 py-1 rounded-full text-xs tracking-wide border border-[#f5f5f5]/20">Seat {selectedSeat.seatNumber}</span>
                  </div>
                  {selectedSeat.imageUrl ? (
                    <img
                      src={selectedSeat.imageUrl}
                      alt={selectedSeat.name || "Seat image"}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#D4AF37] shadow-lg mb-3 bg-[#23272F]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#23272F] border-4 border-[#D4AF37]/30 text-4xl text-[#D4AF37] mb-3">
                      <span>{selectedSeat.name ? selectedSeat.name[0] : "?"}</span>
                    </div>
                  )}
                  <div className="text-center w-full">
                    <h2 className="font-playfair text-2xl font-bold text-[#D4AF37] mb-1">
                      {selectedSeat.name || <span className="text-gray-400">(Empty)</span>}
                    </h2>
                    {selectedSeat.quote && (
                      <div className="italic text-[#f5f5f5]/80 text-base mb-2 border-l-4 border-[#D4AF37] pl-3 mx-auto max-w-xs">“{selectedSeat.quote}”</div>
                    )}
                  </div>
                </div>
                <div className="w-full border-t border-[#D4AF37]/20 my-4"></div>
                <div className="w-full space-y-2">
                  {selectedSeat.bio && (
                    <div>
                      <span className="text-xs text-[#D4AF37] font-semibold uppercase">Bio</span>
                      <div className="text-[#f5f5f5] text-sm mt-1">{selectedSeat.bio}</div>
                    </div>
                  )}
                  {selectedSeat.involvement && (
                    <div>
                      <span className="text-xs text-[#D4AF37] font-semibold uppercase">Involvement</span>
                      <div className="text-[#f5f5f5] text-sm mt-1">{selectedSeat.involvement}</div>
                    </div>
                  )}
                  {selectedSeat.imageUrl && (
                    <div>
                      <span className="text-xs text-[#D4AF37] font-semibold uppercase">Image URL</span>
                      <div className="text-blue-400 text-xs truncate"><a href={selectedSeat.imageUrl} target="_blank" rel="noopener noreferrer" className="underline">{selectedSeat.imageUrl}</a></div>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 justify-end mt-8 w-full">
                  <button
                    className="flex items-center gap-2 text-[#D4AF37] hover:text-[#B8941F] font-semibold px-4 py-2 rounded transition"
                    onClick={() => setShowEditModal(true)}
                  >
                    <Pencil size={18} /> Edit
                  </button>
                  <button
                    className="flex items-center gap-2 text-pink-400 hover:text-pink-300 font-semibold px-4 py-2 rounded transition"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Edit Modal */}
        {selectedSeat && showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className={styles.adminCard + " max-w-md w-full relative animate-fade-in"}>
              <button
                className="absolute top-3 right-4 text-2xl text-[#D4AF37] hover:text-[#B8941F] focus:outline-none"
                onClick={() => { setShowEditModal(false); }}
                aria-label="Close"
                type="button"
              >
                ×
              </button>
              <h2 className="font-playfair text-xl font-bold text-[#D4AF37] mb-6">
                Edit Seat T{selectedSeat.tableNumber}-{selectedSeat.seatNumber}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={styles.adminFormLabel}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={styles.adminInput}
                  />
                </div>
                <div>
                  <label className={styles.adminFormLabel}>
                    Quote
                  </label>
                  <textarea
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className={styles.adminInput}
                    rows={2}
                  />
                </div>
                <div>
                  <label className={styles.adminFormLabel}>
                    Bio
                  </label>
                  <input
                    type="text"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className={styles.adminInput}
                  />
                </div>
                <div>
                  <label className={styles.adminFormLabel}>
                    Involvement
                  </label>
                  <input
                    type="text"
                    value={formData.involvement}
                    onChange={(e) => setFormData({ ...formData, involvement: e.target.value })}
                    className={styles.adminInput}
                    placeholder="e.g., Fellow 2022"
                  />
                </div>
                <div>
                  <label className={styles.adminFormLabel}>
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className={styles.adminInput}
                    placeholder="/images/people/name.jpg"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className={styles.adminButton + " flex-1"}>
                    Save
                  </button>
                  <button type="button" className={styles.adminButton + " flex-1 bg-transparent text-[#D4AF37] border border-[#D4AF37]"} onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirm Modal */}
        <OkModal
          open={showDeleteModal}
          title="Delete Seat"
          message="Are you sure you want to delete this seat? This cannot be undone."
          onOk={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          okText="Delete"
          cancelText="Cancel"
        />
      </div>
    </>
  );
}
