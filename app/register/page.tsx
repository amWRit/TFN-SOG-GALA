"use client";

import React, { useState, useEffect } from 'react';
import { Home } from "lucide-react";
import styles from '../../styles/register.module.css';
import RegisterForm from '../../components/register/RegisterForm';
import PaymentInfo from '../../components/register/PaymentInfo';
import PaymentModal from '../../components/register/PaymentModal';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    table: '',
    seat: '',
    testimonial: ''
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"esewa" | "khalti" | null>(null);
  const amount = 10;
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
    setShowPaymentModal(true);
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
      {/* Payment Modal */}
      <PaymentModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelect={async (method: "esewa" | "khalti") => {
          setPaymentMethod(method);
          setShowPaymentModal(false);
          const transaction_uuid = `${Date.now()}-${Math.random().toString(36).substring(2,8)}`;
          if (method === "esewa") {
            // Call eSewa API route
            const res = await fetch('/api/pay-esewa', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount,
                transaction_uuid,
                product_code: 'EPAYTEST',
                success_url: window.location.origin + '/register?payment=success',
                failure_url: window.location.origin + '/register?payment=fail',
                tax_amount: 0,
                product_service_charge: 0,
                product_delivery_charge: 0,
              })
            });
            const data = await res.json();
            // Create and submit form as per eSewa docs
            const form = document.createElement('form');
            form.action = data.esewaUrl;
            form.method = 'POST';
            form.style.display = 'none';
            form.innerHTML = `
              <input type="hidden" name="amount" value="${data.amount}" />
              <input type="hidden" name="tax_amount" value="${data.tax_amount}" />
              <input type="hidden" name="total_amount" value="${data.total_amount}" />
              <input type="hidden" name="transaction_uuid" value="${data.transaction_uuid}" />
              <input type="hidden" name="product_code" value="${data.product_code}" />
              <input type="hidden" name="merchant_id" value="${data.merchant_id}" />
              <input type="hidden" name="product_service_charge" value="${data.product_service_charge}" />
              <input type="hidden" name="product_delivery_charge" value="${data.product_delivery_charge}" />
              <input type="hidden" name="success_url" value="${data.success_url}" />
              <input type="hidden" name="failure_url" value="${data.failure_url}" />
              <input type="hidden" name="signed_field_names" value="${data.signed_field_names}" />
              <input type="hidden" name="signature" value="${data.signature}" />
            `;
            document.body.appendChild(form);
            form.submit();
          } else if (method === "khalti") {
            // Call Khalti API route
            const res = await fetch('/api/pay-khalti', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                amount,
                transaction_uuid,
                product_identity: 'ticket',
                product_name: 'Event Ticket',
                return_url: window.location.origin + '/register?payment=success',
              })
            });
            const data = await res.json();
            window.location.href = data.payment_url;
          }
        }}
        amount={amount}
      />
      {/* No inline style overrides needed; all layout is now in register.module.css */}
    </div>
  );
}
// ...existing code...
