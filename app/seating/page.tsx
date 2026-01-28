"use client";

import React from 'react';
import { Award, Users, X, Home } from 'lucide-react';




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

type Registration = {
  id: string;
  name: string;
  quote: string;
  bio: string;
  involvement: string;
  imageUrl?: string;
};

type Seat = {
  id: string;
  tableNumber: number;
  seatNumber: number;
  registrationId?: string | null;
  registration?: Registration | null;
};

type SeatCardProps = {
  seat: Seat;
  tableId: number | null;
  onClose: () => void;
};

const SeatCard: React.FC<SeatCardProps> = ({ seat, tableId, onClose }) => {
  const assigned = !!seat.registration;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-md border border-purple-500/20 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Decorative gradient */}
        <div className="absolute top-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-br from-purple-600/20 to-pink-600/20" />

        {/* Content */}
        <div className="relative p-4 pt-10 sm:p-8 sm:pt-12">
          {/* Profile Image or Placeholder */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full blur-xl opacity-50" />
              <img
                src={assigned ? (seat.registration?.imageUrl || "/images/userplaceholder.png") : "/images/seatplaceholder.png"}
                alt={assigned ? seat.registration?.name : "Vacant Seat"}
                className="relative w-20 h-20 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white/10 shadow-xl"
              />
            </div>
          </div>

          {/* Name or Vacant */}
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
            {assigned ? seat.registration?.name : "Vacant Seat"}
          </h3>

          {/* Badge or Placeholder */}
          <div className="flex justify-center mb-4 sm:mb-6">
            {assigned ? (
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getBadgeColor(seat.registration?.involvement || "")}`}>
                <Award className="w-4 h-4" />
                {seat.registration?.involvement}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-gray-600 to-gray-700">
                <Users className="w-4 h-4" />
                Not assigned yet
              </span>
            )}
          </div>

          {/* Quote or Placeholder */}
          {assigned && seat.registration?.quote ? (
            <blockquote className="mb-4 sm:mb-6 text-center">
              <p className="text-lg text-gray-300 italic" style={{ fontFamily: 'Playfair Display, serif' }}>
                "{seat.registration?.quote}"
              </p>
            </blockquote>
          ) : null}


          {/* Bio or Placeholder + Reserve Button */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-3 sm:p-5 border border-white/10 min-h-[48px] flex flex-col items-center gap-3">
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {assigned && seat.registration?.bio ? seat.registration?.bio : "Reserve this spot for yourself!"}
            </p>
            {!assigned && (
              <a
                href="/register"
                className="mt-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold shadow hover:from-pink-500 hover:to-purple-600 transition"
              >
                Reserve this seat
              </a>
            )}
          </div>

          {/* Seat Info */}
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-400">
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
          const assigned = !!seat.registration;
          return (
            <button
              key={seat.id}
              onClick={() => onSeatClick(seat, table.id)}
              className={`absolute top-1/2 left-1/2 group cursor-pointer focus:outline-none ${assigned ? 'border-2 border-pink-500' : 'border-2 border-gray-400'} rounded-full bg-white/5`}
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                width: '64px',
                height: '64px',
                boxShadow: assigned ? '0 0 0 2px #ec4899aa' : '0 0 0 2px #a3a3a3aa',
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-full blur-md transition-opacity duration-300 ${assigned ? 'bg-gradient-to-br from-purple-500 to-pink-500 opacity-60' : 'bg-gradient-to-br from-gray-400 to-gray-500 opacity-30'} group-hover:opacity-80`} />
                {/* Seat image */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-purple-400 transition-all duration-300 group-hover:scale-110 shadow-lg">
                  <img
                    src={assigned ? (seat.registration?.imageUrl || "/images/userplaceholder.png") : "/images/seatplaceholder.png"}
                    alt={assigned ? seat.registration?.name : "Vacant Seat"}
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
                    {assigned ? seat.registration?.name : 'Vacant'}
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
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <a href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-full shadow-lg font-semibold hover:bg-white transition-all border border-gray-200">
          <Home size={20} className="w-5 h-5" />
          Home
        </a>
      </div>
      {/* Header */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Seating Chart
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Click on any seat to view guest information and their involvement with our mission
          </p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-40 md:pb-24">
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
      <div className="fixed bottom-0 md:bottom-4 left-0 md:left-1/2 right-0 md:right-auto w-full md:w-auto -translate-x-0 md:-translate-x-1/2 bg-gray-900/90 backdrop-blur-md border border-purple-500/20 rounded-none md:rounded-2xl px-2 md:px-6 py-3 md:py-4 shadow-2xl z-40">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-sm text-gray-300 justify-center w-full">
          <div className="flex items-center gap-2 mb-1 md:mb-0">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center bg-gray-800">
              <Users className="w-5 h-5 text-gray-300" />
            </div>
            <span>Tap any seat to view details</span>
          </div>
          <div className="flex flex-row gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>{seats.length} Total Seats</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span>{seats.filter(seat => !seat.registration).length} Remaining Seats</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles moved to globals.css to prevent hydration mismatch */}
    </div>
  );
};

export default function SeatingPage() {
  return <SeatingChart />;
}
