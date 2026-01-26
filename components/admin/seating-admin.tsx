"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import useSWR from "swr";

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

  const handleSeatClick = (seat: SeatData) => {
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

  // Group seats by table
  const tables: { [key: number]: SeatData[] } = {};
  seats?.forEach((seat) => {
    if (!tables[seat.tableNumber]) {
      tables[seat.tableNumber] = [];
    }
    tables[seat.tableNumber].push(seat);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Seating Grid */}
      <div className="lg:col-span-2">
        <Card className="glass-strong p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-playfair text-2xl font-bold text-[#D4AF37]">
              Seating Chart
            </h2>
            <Button variant="outline" onClick={handleExportJSON}>
              Export JSON
            </Button>
          </div>
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
      </div>

      {/* Edit Form */}
      <div>
        <Card className="glass-strong p-6">
          <h2 className="font-playfair text-2xl font-bold text-[#D4AF37] mb-6">
            {selectedSeat
              ? `Edit Seat T${selectedSeat.tableNumber}-${selectedSeat.seatNumber}`
              : "Select a seat to edit"}
          </h2>

          {selectedSeat && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                  Quote
                </label>
                <textarea
                  value={formData.quote}
                  onChange={(e) =>
                    setFormData({ ...formData, quote: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                  Bio
                </label>
                <input
                  type="text"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
                  Involvement
                </label>
                <input
                  type="text"
                  value={formData.involvement}
                  onChange={(e) =>
                    setFormData({ ...formData, involvement: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="e.g., Fellow 2022"
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
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  placeholder="/images/people/name.jpg"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex-1">
                  Save
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
