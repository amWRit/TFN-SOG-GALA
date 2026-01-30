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
  registrationId: string | null;
}

interface RegistrationData {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  quote?: string | null;
  bio?: string | null;
  involvement?: string | null;
  imageUrl?: string | null;
  payment?: string | null;
  paymentStatus?: boolean;
  tablePreference?: string | null;
  seatPreference?: string | null;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SeatingAdmin() {
    // Collapsible state for guest detail modal
    const [bioExpanded, setBioExpanded] = useState(false);
    const [quoteExpanded, setQuoteExpanded] = useState(false);
  const { data: seats, mutate } = useSWR<SeatData[]>("/api/admin/seating", fetcher);
  const { data: registrationsData } = useSWR("/api/admin/registration", fetcher);
  const registrations: RegistrationData[] = registrationsData?.registrations || [];
  // Map registrationId to registration for fast lookup
  const registrationMap = registrations.reduce((acc, reg) => {
    acc[reg.id] = reg;
    return acc;
  }, {} as Record<string, RegistrationData>);
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);

  // Form state for editing seat details
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
    const reg = seat.registrationId ? registrationMap[seat.registrationId] : null;
    setFormData({
      name: reg?.name || "",
      quote: reg?.quote || "",
      bio: reg?.bio || "",
      involvement: reg?.involvement || "",
      imageUrl: reg?.imageUrl || "",
    });
  };

  const handleSave = async () => {
    if (!selectedSeat) return;
    // If seat is assigned, update registration details
    if (selectedSeat.registrationId) {
      try {
        const res = await fetch(`/api/admin/registration/${selectedSeat.registrationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            quote: formData.quote,
            bio: formData.bio,
            involvement: formData.involvement,
            imageUrl: formData.imageUrl,
          }),
        });
        if (res.ok) {
          toast.success("Registration updated successfully!");
          mutate();
          setSelectedSeat(null);
          setShowEditModal(false);
        } else {
          toast.error("Failed to update registration");
        }
      } catch (error) {
        toast.error("Error updating registration");
      }
    } else {
      toast.error("No registration assigned to this seat.");
    }
  };

  const handleClear = async () => {
    if (!selectedSeat) return;
    if (!selectedSeat.registrationId) return;
    try {
      // 1. Unassign seat: set registrationId to null on seat
      const seatRes = await fetch("/api/admin/seating", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: selectedSeat.id,
          registrationId: null,
        }),
      });
      // 2. Optionally, update registration to set seatAssignedStatus false (if needed)
      await fetch(`/api/admin/registration/${selectedSeat.registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatAssignedStatus: false }),
      });
      if (seatRes.ok) {
        toast.success("Seat unassigned!");
        mutate();
        setSelectedSeat(null);
        setShowEditModal(false);
      } else {
        toast.error("Failed to unassign seat");
      }
    } catch (error) {
      toast.error("Error unassigning seat");
    }
  };

  const handleExportJSON = () => {
    if (!seats) return;

    const jsonData = seats
      .filter((seat) => seat.registrationId && registrationMap[seat.registrationId]?.name)
      .map((seat) => {
        const reg = seat.registrationId ? registrationMap[seat.registrationId] : null;
        return {
          seat: `T${seat.tableNumber}-${String(seat.seatNumber).padStart(2, "0")}`,
          tableNumber: seat.tableNumber,
          seatNumber: seat.seatNumber,
          name: reg?.name,
          quote: reg?.quote,
          bio: reg?.bio,
          involvement: reg?.involvement,
          image: reg?.imageUrl,
        };
      });

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

  // Group seats by table (guard against non-array)
  const tables: { [key: number]: SeatData[] } = {};
  if (Array.isArray(seats)) {
    seats.forEach((seat) => {
      if (!tables[seat.tableNumber]) {
        tables[seat.tableNumber] = [];
      }
      tables[seat.tableNumber].push(seat);
    });
  }

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

  // --- CSV Export Logic ---
  function exportSeatsToCSV() {
    if (!seats) return;
    const headers = [
      'Seat ID', 'Table Number', 'Seat Number',
      'Registration ID', 'Name', 'Email', 'Phone', 'Payment', 'Payment Status',
      'Table Preference', 'Seat Preference', 'Involvement', 'Bio', 'Quote', 'Image URL'
    ];
    const rows = seats.map(seat => {
      const reg = seat.registrationId ? registrationMap[seat.registrationId] : null;
      return [
        seat.id,
        seat.tableNumber,
        seat.seatNumber,
        reg?.id || '',
        reg?.name || '',
        reg?.email || '',
        reg?.phone || '',
        reg?.payment ?? '',
        reg ? (reg.paymentStatus ? 'Paid' : 'Unpaid') : '',
        reg?.tablePreference ?? '',
        reg?.seatPreference ?? '',
        reg?.involvement || '',
        reg?.bio || '',
        reg?.quote || '',
        reg?.imageUrl || ''
      ];
    });
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => {
        if (typeof field === 'string' && (field.includes(',') || field.includes('"') || field.includes('\n'))) {
          return '"' + field.replace(/"/g, '""') + '"';
        }
        return field;
      }).join(','))
      .join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seating-chart-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {/* Seating Grid with Add Table Button inside Card */}
      <div>
        <div className={styles.adminCard}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-2xl font-bold text-[#D4AF37]">
                Seating Chart
              </h2>
              <div className="flex gap-2">
                <button
                  className={styles.adminButtonSmall}
                  onClick={exportSeatsToCSV}
                  type="button"
                >
                  Export CSV
                </button>
                <button
                  className={styles.adminButtonSmall}
                  onClick={() => setShowAddTableModal(true)}
                  type="button"
                >
                  + Add Table
                </button>
              </div>
            </div>
            {showAddTableModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
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
                    {tables[tableNum]?.map((seat) => {
                      const reg = seat.registrationId ? registrationMap[seat.registrationId] : null;
                      return (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            selectedSeat?.id === seat.id
                              ? "border-[#D4AF37] bg-[#D4AF37]/20"
                              : reg
                              ? "border-[#D4AF37]/50 bg-[#D4AF37]/10"
                              : "border-[#f5f5f5]/20 bg-[#1a1a1a]/50"
                          }`}
                        >
                          <div className="text-xs text-center">
                            <div className="font-medium text-[#f5f5f5]">
                              {seat.seatNumber}
                            </div>
                            {reg && (
                              <div className="text-[#D4AF37] text-xs mt-1 truncate max-w-[80px] mx-auto" title={reg.name}>
                                {reg.name}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        {/* Details Modal */}
        {selectedSeat && !showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
              className={styles.adminCard + " max-w-md w-full relative animate-fade-in p-0"}
              style={{ maxHeight: '90vh', overflowY: 'auto', marginTop: '2vh', marginBottom: '2vh', minWidth: 0 }}
            >
              <button
                className="absolute top-3 right-4 text-2xl text-[#D4AF37] hover:text-[#B8941F] focus:outline-none"
                onClick={() => { setSelectedSeat(null); setShowEditModal(false); }}
                aria-label="Close"
                type="button"
              >
                ×
              </button>
              <div className="flex flex-col items-center p-3 pt-2">
                <div className="flex flex-col items-center w-full" style={{paddingTop: 12, paddingBottom: 12}}>
                  <div className="flex gap-2 mb-4 w-full justify-center">
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] font-bold px-3 py-1 rounded-full text-xs tracking-wide border border-[#D4AF37]/30">Table {selectedSeat.tableNumber}</span>
                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] font-bold px-3 py-1 rounded-full text-xs tracking-wide border border-[#D4AF37]/30">Seat {selectedSeat.seatNumber}</span>
                  </div>
                  {selectedSeat.registrationId && registrationMap[selectedSeat.registrationId]?.imageUrl ? (
                    <img
                      src={registrationMap[selectedSeat.registrationId].imageUrl!}
                      alt={registrationMap[selectedSeat.registrationId].name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-[#D4AF37] shadow-lg mb-3 bg-[#23272F]"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#23272F] border-4 border-[#D4AF37]/30 text-4xl text-[#D4AF37] mb-3">
                      <span>{selectedSeat.registrationId && registrationMap[selectedSeat.registrationId]?.name ? registrationMap[selectedSeat.registrationId].name[0] : "?"}</span>
                    </div>
                  )}
                  <div className="text-center w-full">
                    <h2 className="font-playfair text-2xl font-bold text-[#D4AF37] mb-1">
                      {selectedSeat.registrationId && registrationMap[selectedSeat.registrationId]?.name ? registrationMap[selectedSeat.registrationId].name : <span className="text-gray-400">(Empty)</span>}
                    </h2>
                  </div>
                </div>
                <div className="w-full border-t border-[#D4AF37]/20 my-4"></div>
                <div className="w-full space-y-2">
                  {/* Collapsible Quote */}
                  {selectedSeat.registrationId && registrationMap[selectedSeat.registrationId]?.quote && (
                    <div>
                      <span className="text-xs text-[#D4AF37] font-semibold uppercase">Quote</span>
                      <div className="italic text-[#f5f5f5]/80 text-sm mt-1 pl-3 max-w-xs text-left">
                        {(registrationMap[selectedSeat.registrationId]?.quote ?? "").length > 120 ? (
                          <>
                            {quoteExpanded
                              ? '“' + registrationMap[selectedSeat.registrationId]?.quote + '”'
                              : '“' + (registrationMap[selectedSeat.registrationId]?.quote ?? '').slice(0, 120) + '...”'}
                            <button
                              className="ml-2 text-xs text-[#D4AF37] underline focus:outline-none"
                              onClick={() => setQuoteExpanded((v) => !v)}
                              type="button"
                            >
                              {quoteExpanded ? 'Show less' : 'Show more'}
                            </button>
                          </>
                        ) : (
                          <>“{registrationMap[selectedSeat.registrationId]?.quote}”</>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Collapsible Bio */}
                  {selectedSeat.registrationId && registrationMap[selectedSeat.registrationId]?.bio && (
                    <div>
                      <span className="text-xs text-[#D4AF37] font-semibold uppercase">Bio</span>
                      <div className="text-[#f5f5f5] text-sm mt-1">
                        {registrationMap[selectedSeat.registrationId]?.bio && (registrationMap[selectedSeat.registrationId]?.bio ?? "").length > 120 ? (
                          <>
                            {bioExpanded
                              ? registrationMap[selectedSeat.registrationId]?.bio
                              : (registrationMap[selectedSeat.registrationId]?.bio ?? '').slice(0, 120) + '...'}
                            <button
                              className="ml-2 text-xs text-[#D4AF37] underline focus:outline-none"
                              onClick={() => setBioExpanded((v) => !v)}
                              type="button"
                            >
                              {bioExpanded ? 'Show less' : 'Show more'}
                            </button>
                          </>
                        ) : (
                          registrationMap[selectedSeat.registrationId]?.bio
                        )}
                      </div>
                    </div>
                  )}
                  {/* Involvement */}
                  {selectedSeat.registrationId && registrationMap[selectedSeat.registrationId]?.involvement && (
                    <div>
                      <span className="text-xs text-[#D4AF37] font-semibold uppercase">Involvement</span>
                      <div className="text-[#f5f5f5] text-sm mt-1">{registrationMap[selectedSeat.registrationId].involvement}</div>
                    </div>
                  )}
                  {/* Image URL */}
                  {selectedSeat.registrationId && registrationMap[selectedSeat.registrationId]?.imageUrl && (
                    <div>
                      <span className="text-xs text-[#D4AF37] font-semibold uppercase">Image URL</span>
                      <div className="text-blue-400 text-xs truncate"><a href={registrationMap[selectedSeat.registrationId].imageUrl!} target="_blank" rel="noopener noreferrer" className="underline">{registrationMap[selectedSeat.registrationId].imageUrl}</a></div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
              className={styles.adminCard + " max-w-md w-full relative animate-fade-in"}
              style={{ maxHeight: '90vh', overflowY: 'auto', marginTop: '5vh', marginBottom: '5vh', minWidth: 0 }}
            >
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
                  <div className="relative">
                    <textarea
                      value={formData.quote}
                      onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                      className={styles.adminInput}
                      rows={2}
                      maxLength={1000}
                      style={{ marginBottom: 0 }}
                    />
                    <div className="text-xs text-gray-400 text-right mt-1">Max length: 1000 characters</div>
                  </div>
                </div>
                <div>
                  <label className={styles.adminFormLabel}>
                    Bio
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className={styles.adminInput}
                      rows={3}
                      maxLength={1000}
                      style={{ marginBottom: 0 }}
                    />
                    <div className="text-xs text-gray-400 text-right mt-1">Max length: 1000 characters</div>
                  </div>
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
