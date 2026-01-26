
"use client";

import React from 'react';
import { Award, Users, X } from 'lucide-react';




type TableType = {
  id: number;
  name: string;
  seats: Seat[];
};

function groupSeatsByTable(seats: Seat[]): TableType[] {
  const tables: Record<number, TableType> = {};
  seats.forEach((seat) => {
    if (!tables[seat.tableNumber]) {
      tables[seat.tableNumber] = { id: seat.tableNumber, name: `Table ${seat.tableNumber}`, seats: [] };
    }
    tables[seat.tableNumber].seats.push(seat);
  });
  // Sort seats by seatNumber
  Object.values(tables).forEach((table) => {
    table.seats.sort((a, b) => a.seatNumber - b.seatNumber);
  });
  // Return sorted tables
  return Object.values(tables).sort((a, b) => a.id - b.id);
}

const getBadgeColor = (involvement: string) => {
  const colors = {
    'Founding Member': 'from-purple-600 to-pink-600',
    'Major Donor': 'from-amber-500 to-orange-600',
    'Sponsor': 'from-blue-500 to-cyan-600',
    'Partner': 'from-green-500 to-emerald-600',
    'Advisor': 'from-indigo-500 to-purple-600',
    'Volunteer': 'from-pink-500 to-rose-600',
    'Alumni': 'from-teal-500 to-cyan-600',
    'Youth Leader': 'from-yellow-500 to-amber-600',
    'Educator': 'from-red-500 to-pink-600',
    'Media': 'from-violet-500 to-purple-600',
    'VIP': 'from-amber-600 to-yellow-500',
    'default': 'from-gray-600 to-gray-700'
  };
  return (colors as Record<string, string>)[involvement] || colors.default;
};

type Seat = {
  id: number;
  name: string;
  quote: string;
  bio: string;
  involvement: string;
  imageUrl?: string;
  tableNumber: number;
  seatNumber: number;
};

type SeatCardProps = {
  seat: Seat;
  tableId: number | null;
  onClose: () => void;
};

const SeatCard: React.FC<SeatCardProps> = ({ seat, tableId, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl max-w-md w-full border border-purple-500/20 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />

        {/* Content */}
        <div className="relative p-8 pt-12">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-xl opacity-50" />
              <img
                src={seat.imageUrl || "/images/userplaceholder.png"}
                alt={seat.name}
                className="relative w-32 h-32 rounded-full object-cover border-4 border-white/10 shadow-xl"
              />
            </div>
          </div>

          {/* Name */}
          <h3 className="text-3xl font-bold text-white text-center mb-2">
            {seat.name}
          </h3>

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getBadgeColor(seat.involvement)}`}>
              <Award className="w-4 h-4" />
              {seat.involvement}
            </span>
          </div>

          {/* Quote */}
          <blockquote className="mb-6 text-center">
            <p className="text-lg text-gray-300 italic" style={{ fontFamily: 'Playfair Display, serif' }}>
              "{seat.quote}"
            </p>
          </blockquote>

          {/* Bio */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <p className="text-gray-300 leading-relaxed">
              {seat.bio}
            </p>
          </div>

          {/* Seat Info */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <Users className="w-4 h-4" />
            <span>Table {tableId} • Seat {seat.seatNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Removed duplicate TableType definition */

type TableProps = {
  table: TableType;
  onSeatClick: (seat: Seat, tableId: number) => void;
};

const Table: React.FC<TableProps> = ({ table, onSeatClick }) => {
  const seatCount = table.seats.length;
  const radius = 120;
  
  const getSeatPosition = (index: number) => {
    const angle = (index * 360) / seatCount - 90;
    const radian = (angle * Math.PI) / 180;
    const x = radius * Math.cos(radian);
    const y = radius * Math.sin(radian);
    return { x, y };
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Table label */}
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-white mb-1">{table.name}</h3>
        <p className="text-sm text-gray-400">{seatCount} Seats</p>
      </div>

      {/* Table visualization */}
      <div className="relative" style={{ width: '320px', height: '320px' }}>
        {/* Table center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-4 border-purple-500/20 shadow-xl flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              {table.id}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wider">Table</div>
          </div>
        </div>

        {/* Seats */}
        {table.seats.map((seat, index) => {
          const { x, y } = getSeatPosition(index);
          return (
            <button
              key={seat.id}
              onClick={() => onSeatClick(seat, table.id)}
              className="absolute top-1/2 left-1/2 group cursor-pointer"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
              }}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                
                {/* Seat image */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-3 border-white/20 group-hover:border-purple-400 transition-all duration-300 group-hover:scale-110 shadow-lg">
                  <img
                    src={"/images/seatplaceholder.png"}
                    alt={seat.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Seat number */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900 shadow-lg">
                  {seat.seatNumber}
                </div>

                {/* Name tooltip on hover (desktop only) */}
                <div className="hidden md:block absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl border border-purple-500/30">
                    {seat.name}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};


import { useEffect, useState } from 'react';

const SeatingChart = () => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSeats() {
      setLoading(true);
      try {
        const res = await fetch('/api/seating');
        const data = await res.json();
        setSeats(data);
      } catch (e) {
        setSeats([]);
      } finally {
        setLoading(false);
      }
    }
    fetchSeats();
  }, []);

  const tables = groupSeatsByTable(seats);

  const handleSeatClick = (seat: Seat, tableId: number) => {
    setSelectedSeat(seat);
    setSelectedTable(tableId);
  };

  const handleClose = () => {
    setSelectedSeat(null);
    setSelectedTable(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Home Button */}
      <div className="fixed top-6 left-6 z-50">
        <a href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-full shadow-lg font-semibold hover:bg-white transition-all border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V19a1.5 1.5 0 001.5 1.5h3.75m6 0H18a1.5 1.5 0 001.5-1.5v-8.5" />
          </svg>
          Home
        </a>
      </div>
      {/* Header */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Seating Chart
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Click on any seat to view guest information and their involvement with our mission
          </p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-400 py-20 text-xl">Loading seating data...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 lg:gap-16">
              {tables.map((table) => (
                <Table
                  key={table.id}
                  table={table}
                  onSeatClick={handleSeatClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Seat Detail Modal */}
      {selectedSeat && (
        <SeatCard
          seat={selectedSeat}
          tableId={selectedTable}
          onClose={handleClose}
        />
      )}

      {/* Legend */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-md border border-purple-500/20 rounded-2xl px-6 py-4 shadow-2xl">
        <div className="flex items-center gap-6 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600" />
            <span>Click to view details</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span>{seats.length} Total Guests</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default function SeatingPage() {
  return <SeatingChart />;
}
