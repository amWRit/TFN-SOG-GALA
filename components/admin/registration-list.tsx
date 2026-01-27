import React, { useState } from "react";
import useSWR from "swr";
import styles from '../../styles/admin-dashboard.module.css';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  tablePreference?: number | null;
  seatPreference?: number | null;
  payment: number;
  paymentStatus: boolean;
  seatAssignedStatus: boolean;
  quote?: string | null;
  bio?: string | null;
  involvement?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function RegistrationList() {
  const { data, isLoading, error } = useSWR<{ registrations: Registration[] }>("/api/admin/registration", fetcher);
  const [selected, setSelected] = useState<Registration | null>(null);

  // Group by tablePreference, then seatPreference
  const grouped = (data?.registrations || []).reduce((acc, reg) => {
    const table = reg.tablePreference || 0;
    if (!acc[table]) acc[table] = [];
    acc[table].push(reg);
    return acc;
  }, {} as Record<number, Registration[]>);

  return (
    <div className={styles.adminCard}>
      <h2 className="font-playfair text-2xl font-bold text-[#D4AF37] mb-4">Registrations</h2>
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-pink-400">Error loading registrations.</div>}
      <div className="space-y-6">
        {Object.keys(grouped).sort((a, b) => Number(a) - Number(b)).map(table => (
          <div key={table}>
            <h3 className="text-lg font-semibold text-[#D4AF37] mb-2">Table {table === '0' ? <span className="text-gray-400">(No Pref)</span> : table}</h3>
            <div className="space-y-2">
              {grouped[Number(table)].sort((a, b) => (a.seatPreference || 0) - (b.seatPreference || 0)).map(reg => (
                <button
                  key={reg.id}
                  className="w-full flex items-center justify-between bg-[#23272F] rounded-lg px-4 py-2 hover:bg-[#D4AF37]/10 transition border border-[#D4AF37]/20"
                  onClick={() => setSelected(reg)}
                >
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-[#f5f5f5]">{reg.name}</span>
                    <span className="text-xs text-[#D4AF37]">Seat {reg.seatPreference || <span className="text-gray-400">?</span>}</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className={reg.paymentStatus ? "text-green-400 font-bold" : "text-pink-400 font-bold"}>
                      {reg.paymentStatus ? "Paid" : "Unpaid"}
                    </span>
                    <span className={reg.seatAssignedStatus ? "text-green-400 font-bold" : "text-pink-400 font-bold"}>
                      {reg.seatAssignedStatus ? "Assigned" : "Unassigned"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for registration details */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className={styles.adminCard + " max-w-md w-full relative animate-fade-in"}>
            <button
              className="absolute top-3 right-4 text-2xl text-[#D4AF37] hover:text-[#B8941F] focus:outline-none"
              onClick={() => setSelected(null)}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
            <div className="flex flex-col items-center p-6 pt-10">
              <div className="flex flex-col items-center w-full">
                <div className="flex gap-2 mb-4 w-full justify-center">
                  <span className="bg-[#D4AF37]/10 text-[#D4AF37] font-bold px-3 py-1 rounded-full text-xs tracking-wide border border-[#D4AF37]/30">Table {selected.tablePreference || <span className='text-gray-400'>(No Pref)</span>}</span>
                  <span className="bg-[#f5f5f5]/10 text-[#f5f5f5] font-bold px-3 py-1 rounded-full text-xs tracking-wide border border-[#f5f5f5]/20">Seat {selected.seatPreference || <span className='text-gray-400'>?</span>}</span>
                </div>
                {selected.imageUrl ? (
                  <img
                    src={selected.imageUrl}
                    alt={selected.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#D4AF37] shadow-lg mb-3 bg-[#23272F]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#23272F] border-4 border-[#D4AF37]/30 text-4xl text-[#D4AF37] mb-3">
                    <span>{selected.name[0]}</span>
                  </div>
                )}
                <div className="text-center w-full">
                  <h2 className="font-playfair text-2xl font-bold text-[#D4AF37] mb-1">
                    {selected.name}
                  </h2>
                  {selected.quote && (
                    <div className="italic text-[#f5f5f5]/80 text-base mb-2 border-l-4 border-[#D4AF37] pl-3 mx-auto max-w-xs">“{selected.quote}”</div>
                  )}
                </div>
              </div>
              <div className="w-full border-t border-[#D4AF37]/20 my-4"></div>
              <div className="w-full space-y-2">
                {selected.bio && (
                  <div>
                    <span className="text-xs text-[#D4AF37] font-semibold uppercase">Bio</span>
                    <div className="text-[#f5f5f5] text-sm mt-1">{selected.bio}</div>
                  </div>
                )}
                {selected.involvement && (
                  <div>
                    <span className="text-xs text-[#D4AF37] font-semibold uppercase">Involvement</span>
                    <div className="text-[#f5f5f5] text-sm mt-1">{selected.involvement}</div>
                  </div>
                )}
                {selected.phone && (
                  <div>
                    <span className="text-xs text-[#D4AF37] font-semibold uppercase">Phone</span>
                    <div className="text-[#f5f5f5] text-sm mt-1">{selected.phone}</div>
                  </div>
                )}
                <div>
                  <span className="text-xs text-[#D4AF37] font-semibold uppercase">Email</span>
                  <div className="text-blue-400 text-xs truncate"><a href={`mailto:${selected.email}`} className="underline">{selected.email}</a></div>
                </div>
                <div>
                  <span className="text-xs text-[#D4AF37] font-semibold uppercase">Payment</span>
                  <div className="text-[#f5f5f5] text-sm mt-1">{selected.payment} ({selected.paymentStatus ? 'Paid' : 'Unpaid'})</div>
                </div>
                <div>
                  <span className="text-xs text-[#D4AF37] font-semibold uppercase">Seat Assigned</span>
                  <div className="text-[#f5f5f5] text-sm mt-1">{selected.seatAssignedStatus ? 'Yes' : 'No'}</div>
                </div>
              </div>
              <RegistrationModalActions
                registration={selected}
                onClose={() => setSelected(null)}
                onUpdated={setSelected}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- RegistrationModalActions component ---
function RegistrationModalActions({ registration, onClose, onUpdated }: { registration: Registration, onClose: () => void, onUpdated: (r: Registration) => void }) {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    payment: registration.payment,
    paymentStatus: registration.paymentStatus,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/registration/${registration.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        onUpdated(data.registration);
        setEdit(false);
      } else {
        setError("Failed to update.");
      }
    } catch {
      setError("Network error.");
    }
    setSaving(false);
  };

  // You may need to import styles here if not already in scope
  // import styles from '../../styles/admin-dashboard.module.css';

  return (
    <div className="flex gap-4 justify-end mt-8 w-full flex-wrap">
      {error && <div className="text-pink-400 w-full mb-2">{error}</div>}
      {edit ? (
        <>
          <input
            type="number"
            className={styles.adminInput + " w-24"}
            value={form.payment}
            min={0}
            step={0.01}
            onChange={e => setForm(f => ({ ...f, payment: parseFloat(e.target.value) }))}
          />
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={form.paymentStatus}
              onChange={e => setForm(f => ({ ...f, paymentStatus: e.target.checked }))}
            />
            Paid
          </label>
          <button className={styles.adminButton + " flex-1"} onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button className={styles.adminButton + " flex-1 bg-transparent text-[#D4AF37] border border-[#D4AF37]"} type="button" onClick={() => setEdit(false)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <button className={styles.adminButton + " flex-1"} onClick={onClose}>
            Close
          </button>
          <button className={styles.adminButton + " flex-1"} onClick={() => setEdit(true)}>
            Edit
          </button>
          {registration.paymentStatus && !registration.seatAssignedStatus && (
            <button className={styles.adminButton + " flex-1 bg-green-600 hover:bg-green-700 text-white"}>
              Assign Seat
            </button>
          )}
        </>
      )}
    </div>
  );
}
