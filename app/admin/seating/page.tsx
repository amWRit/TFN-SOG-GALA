"use client";

import React, { useState } from "react";

export default function AdminSeatingPage() {
  const [tableNumber, setTableNumber] = useState(1);
  const [seatCount, setSeatCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const res = await fetch("/api/admin/seating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNumber, seatCount }),
      });
      if (res.ok) {
        setSuccess("Seats added successfully!");
      } else {
        setError("Failed to add seats.");
      }
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Table & Seats</h2>
        <label className="block mb-3">
          Table Number
          <input
            type="number"
            min={1}
            value={tableNumber}
            onChange={e => setTableNumber(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </label>
        <label className="block mb-6">
          Number of Seats
          <input
            type="number"
            min={1}
            max={20}
            value={seatCount}
            onChange={e => setSeatCount(Number(e.target.value))}
            className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600 text-white"
            required
          />
        </label>
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Table & Seats"}
        </button>
        {success && <p className="text-green-400 mt-4 text-center">{success}</p>}
        {error && <p className="text-pink-400 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
}
