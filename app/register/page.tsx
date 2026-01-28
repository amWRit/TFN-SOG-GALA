"use client";

import React, { useState, useEffect } from 'react';
import styles from '../../styles/homepage.module.css';

const RegisterForm = () => {
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
    // Fetch available seats on mount
    useEffect(() => {
      fetch('/api/seating/available')
        .then(res => res.json())
        .then(data => {
          setSeats(data.seats);
          // Get all unique table numbers
          const tables = Array.from(new Set(data.seats.map((s: any) => s.tableNumber))) as number[];
          setTableOptions(tables);
        });
    }, []);

    // Update seat options when table changes
    useEffect(() => {
      if (form.table) {
        const availableSeats = seats.filter(s => s.tableNumber === Number(form.table) && !s.name).map(s => s.seatNumber);
        setSeatOptions(availableSeats);
      } else {
        setSeatOptions([]);
      }
    }, [form.table, seats]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    <>
      {/* Home Button */}
      <div className="fixed top-6 left-6 z-50">
        <a href="/" className="flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-900 rounded-full shadow-lg font-semibold hover:bg-white transition-all border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4.5 10.5V19a1.5 1.5 0 001.5 1.5h3.75m6 0H18a1.5 1.5 0 001.5-1.5v-8.5" />
          </svg>
          Home
        </a>
      </div>
      <div className={styles.heroContainer}>
        <form className={styles.formCard} onSubmit={handleSubmit}>
        <h2 className={styles.gradientText} style={{fontSize: '2.2rem', marginBottom: '0.5rem', lineHeight: 1.2}}>
          Secure Your Spot! <span style={{fontSize: '1.5rem'}}></span>
        </h2>
        <input
          className={styles.input}
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name || ''}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email || ''}
          onChange={handleChange}
          required
        />
        <input
          className={styles.input}
          type="tel"
          name="phone"
          placeholder="Your Phone Number (optional)"
          value={form.phone || ''}
          onChange={handleChange}
        />
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16}}>
          <select
            className={styles.input}
            name="table"
            value={form.table || ''}
            onChange={handleChange}
            required
            style={{flex: 1, minWidth: 0}}
          >
            <option value="">Table #</option>
            {tableOptions.map(t => (
              <option key={t} value={t}>Table {t}</option>
            ))}
          </select>
          <select
            className={styles.input}
            name="seat"
            value={form.seat || ''}
            onChange={handleChange}
            required
            disabled={!form.table}
            style={{flex: 1, minWidth: 0}}
          >
            <option value="">Seat #</option>
            {seatOptions.map(s => (
              <option key={s} value={s}>Seat {s}</option>
            ))}
          </select>
        </div>
        <textarea
          className={styles.input}
          name="testimonial"
          placeholder="Share a quote or testimonial about Teach For Nepal! 💬"
          value={form.testimonial || ''}
          onChange={handleChange}
          rows={3}
        />
        <button
          type="submit"
          disabled={submitting}
          className={styles.primaryButton + ' w-full mt-2'}
        >
          {submitting ? 'Saving...' : 'Reserve My Seat'}
        </button>
        {success && (
          <>
            <div className={styles.confetti} aria-hidden>🎊🎈🥳</div>
            <p style={{ color: '#A78BFA', marginTop: '1rem', fontWeight: 600, fontSize: '1.1rem' }}>
              Thank you for registering! See you at the Gala!
            </p>
          </>
        )}
        {error && <p style={{ color: '#F472B6', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
    </>
  );
};

export default RegisterForm;
