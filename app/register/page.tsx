"use client";

import React, { useState, useEffect } from 'react';
import { Home } from "lucide-react";
import styles from '../../styles/register.module.css';
import RegisterForm from '../../components/register/RegisterForm';
import PaymentInfo from '../../components/register/PaymentInfo';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    table: '',
    seat: '',
    testimonial: ''
  });
  const [seats, setSeats] = useState<{tableNumber: number, seatNumber: number, name: string | null}[]>([]);
  const [tableOptions, setTableOptions] = useState<number[]>([]);
  const [seatOptions, setSeatOptions] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/seating/available')
      .then(res => res.json())
      .then(data => {
        setSeats(data.seats);
        const tables = Array.from(new Set(data.seats.map((s: any) => s.tableNumber))) as number[];
        setTableOptions(tables);
      });
  }, []);

  useEffect(() => {
    if (form.table) {
      const availableSeats = seats.filter(s => s.tableNumber === Number(form.table) && !s.name).map(s => s.seatNumber);
      setSeatOptions(availableSeats);
    } else {
      setSeatOptions([]);
    }
  }, [form.table, seats]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: '', email: '', phone: '', table: '', seat: '', testimonial: '' });
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch {
      setError('Network error.');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles['register-hero']}>
      {/* Home Button */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <a href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-full shadow-lg font-semibold hover:bg-white transition-all border border-gray-200">
          <Home size={20} className="w-5 h-5" />
          Home
        </a>
      </div>
      {/* Left: Register Form */}
      <div style={{ flex: 1, boxSizing: 'border-box' }}>
        <RegisterForm
          form={form}
          tableOptions={tableOptions}
          seatOptions={seatOptions}
          submitting={submitting}
          success={success}
          error={error}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
      {/* Right: Payment/Donate Info */}
      <div style={{ flex: 1, boxSizing: 'border-box' }}>
        <PaymentInfo />
      </div>
      {/* No inline style overrides needed; all layout is now in register.module.css */}
    </div>
  );
}
