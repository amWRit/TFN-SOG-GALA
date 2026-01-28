"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import Image from "next/image";
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

interface SeatPopoverProps {
  seat: SeatData;
  position: { x: number; y: number };
  onClose: () => void;
}

function SeatPopover({ seat, position, onClose }: SeatPopoverProps) {
  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{ left: position.x, top: position.y }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <Card className="glass-strong w-80 p-6 pointer-events-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-[#f5f5f5]/60 hover:text-[#D4AF37]"
        >
          ×
        </button>
        {seat.imageUrl && (
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#D4AF37]">
            <Image
              src={seat.imageUrl}
              alt={seat.name || "Guest"}
              fill
              className="object-cover"
            />
          </div>
        )}
        <h3 className="font-playfair text-2xl font-semibold text-[#D4AF37] text-center mb-2">
          {seat.name || `Seat ${seat.seatNumber}`}
        </h3>
        {seat.quote && (
          <p className="font-playfair text-lg italic text-[#f5f5f5]/90 text-center mb-3">
            &quot;{seat.quote}&quot;
          </p>
        )}
        {seat.bio && (
          <p className="text-sm text-[#f5f5f5]/80 text-center mb-2">{seat.bio}</p>
        )}
        {seat.involvement && (
          <div className="mt-3 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-medium">
              {seat.involvement}
            </span>
          </div>
        )}
      </Card>
      </motion.div>
    </div>
  );
}

interface SeatProps {
  seat: SeatData;
  onClick: (seat: SeatData, event: React.MouseEvent) => void;
}

function Seat({ seat, onClick }: SeatProps) {
  const isEmpty = !seat.name;
  
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => onClick(seat, e)}
      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 transition-all ${
        isEmpty
          ? "border-[#f5f5f5]/20 bg-[#1a1a1a]/50 hover:border-[#D4AF37]/50"
          : "border-[#D4AF37] bg-[#D4AF37]/10 hover:border-[#D4AF37] hover:glow-gold"
      }`}
    >
      {seat.imageUrl ? (
        <Image
          src={seat.imageUrl}
          alt={seat.name || "Seat"}
          fill
          className="object-cover rounded-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xs text-[#f5f5f5]/40">{seat.seatNumber}</span>
        </div>
      )}
      {seat.name && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-[#D4AF37] whitespace-nowrap">
          {seat.name.split(" ")[0]}
        </div>
      )}
    </motion.button>
  );
}

interface TableProps {
  tableNumber: number;
  seats: SeatData[];
  onSeatClick: (seat: SeatData, event: React.MouseEvent) => void;
}

function Table({ tableNumber, seats, onSeatClick }: TableProps) {
  // Arrange seats in a circle around the table
  const seatPositions = seats.map((_, index) => {
    const angle = (index / seats.length) * 2 * Math.PI - Math.PI / 2;
    const radius = 60; // Distance from center
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative"
    >
      <Card className="glass-strong p-8 md:p-12 relative">
        {/* Table Label */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="font-playfair text-2xl font-bold text-[#D4AF37] bg-[#1a1a1a] px-4">
            Table {tableNumber}
          </span>
        </div>

        {/* Table Circle */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
          {/* Table center */}
          <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/30 bg-[#D4AF37]/5" />

          {/* Seats arranged in circle */}
          {seats.map((seat, index) => {
            const pos = seatPositions[index];
            return (
              <div
                key={seat.id}
                className="absolute"
                style={{
                  left: `calc(50% + ${pos.x}px)`,
                  top: `calc(50% + ${pos.y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Seat seat={seat} onClick={onSeatClick} />
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function SeatingChart() {
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });

  // Fetch seating data from API
  const { data: seats, error, isLoading } = useSWR<SeatData[]>(
    "/api/seating",
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  const handleSeatClick = (seat: SeatData, event: React.MouseEvent) => {
    if (!seat.name) return; // Don't show popover for empty seats
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setPopoverPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 20,
    });
    setSelectedSeat(seat);
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
        <p className="mt-4 text-[#f5f5f5]/60">Loading seating chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Error loading seating chart. Please try again later.</p>
      </div>
    );
  }

  // Group seats by table
  const tables: { [key: number]: SeatData[] } = {};
  seats?.forEach((seat) => {
    if (!tables[seat.tableNumber]) {
      tables[seat.tableNumber] = [];
    }
    tables[seat.tableNumber].push(seat);
  });

  // Sort seats within each table
  Object.keys(tables).forEach((tableNum) => {
    tables[Number(tableNum)].sort((a, b) => a.seatNumber - b.seatNumber);
  });

  return (
    <div className="relative">
      {/* Grid of 12 tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((tableNum) => (
          <Table
            key={tableNum}
            tableNumber={tableNum}
            seats={tables[tableNum] || []}
            onSeatClick={handleSeatClick}
          />
        ))}
      </div>

      {/* Popover */}
      <AnimatePresence>
        {selectedSeat && (
          <SeatPopover
            seat={selectedSeat}
            position={popoverPosition}
            onClose={() => setSelectedSeat(null)}
          />
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {selectedSeat && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setSelectedSeat(null)}
        />
      )}
    </div>
  );
}
