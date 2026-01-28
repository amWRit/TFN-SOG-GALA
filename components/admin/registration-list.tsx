import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import useSWR from "swr";
import styles from '../../styles/admin-dashboard.module.css';

interface Registration {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  payment: number;
  paymentStatus: boolean;
  quote?: string | null;
  bio?: string | null;
  involvement?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  tablePreference?: number | null;
  seatPreference?: number | null;
  seatAssignedStatus?: boolean;
}

interface Seat {
  id: string;
  tableNumber: number;
  seatNumber: number;
  registrationId: string | null;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function RegistrationList() {
  const { data, isLoading, error, mutate } = useSWR<{ registrations: Registration[] }>('/api/admin/registration', fetcher);
  const { data: seatData, isLoading: seatsLoading, error: seatsError, mutate: mutateSeats } = useSWR<Seat[]>('/api/admin/seating', fetcher);
  const [selected, setSelected] = useState<Registration | null>(null);

  // Map registrationId to seat
  const registrationIdToSeat: Record<string, Seat> = {};
  (seatData || []).forEach(seat => {
    if (seat.registrationId) registrationIdToSeat[seat.registrationId] = seat;
  });

  // Group registrations by tablePreference (or 0 if none)
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
                    <span className="text-xs text-[#D4AF37]">
                      {registrationIdToSeat[reg.id]
                        ? `Seat ${registrationIdToSeat[reg.id].seatNumber}`
                        : <span className="text-gray-400">Unassigned</span>}
                    </span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className={reg.paymentStatus ? "text-green-400 font-bold" : "text-pink-400 font-bold"}>
                      {reg.paymentStatus ? "Paid" : "Unpaid"}
                    </span>
                    <span className={registrationIdToSeat[reg.id] ? "text-green-400 font-bold" : "text-pink-400 font-bold"}>
                      {registrationIdToSeat[reg.id] ? "Assigned" : "Unassigned"}
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
          <div className={styles.adminCard + " max-w-md w-full relative animate-fade-in max-h-[95vh] overflow-y-auto sm:max-h-[90vh]"} style={{ overscrollBehavior: 'contain' }}>
            <button
              className="sticky top-3 right-4 text-2xl text-[#D4AF37] hover:text-[#B8941F] focus:outline-none float-right z-10 bg-transparent"
              onClick={() => setSelected(null)}
              aria-label="Close"
              type="button"
              style={{ position: 'absolute', top: 12, right: 16 }}
            >
              ×
            </button>
            <div className="flex flex-col items-center p-6 pt-10">
              <div className="flex flex-col items-center w-full">
                <div className="flex gap-2 mb-4 w-full justify-center">
                  {registrationIdToSeat[selected.id] ? (
                    <>
                      <span className="bg-[#D4AF37]/10 text-[#D4AF37] font-bold px-3 py-1 rounded-full text-xs tracking-wide border border-[#D4AF37]/30">
                        Table {registrationIdToSeat[selected.id].tableNumber}
                      </span>
                      <span className="bg-[#f5f5f5]/10 text-[#f5f5f5] font-bold px-3 py-1 rounded-full text-xs tracking-wide border border-[#f5f5f5]/20">
                        Seat {registrationIdToSeat[selected.id].seatNumber}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="bg-[#D4AF37]/10 text-[#D4AF37] font-bold px-3 py-1 rounded-full text-xs tracking-wide border border-[#D4AF37]/30">
                        Table {selected.tablePreference || <span className='text-gray-400'>(No Pref)</span>}
                      </span>
                      <span className="bg-[#f5f5f5]/10 text-[#f5f5f5] font-bold px-3 py-1 rounded-full text-xs tracking-wide border border-[#f5f5f5]/20">
                        Seat {selected.seatPreference || <span className='text-gray-400'>?</span>}
                      </span>
                    </>
                  )}
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
                  {/* Quote removed */}
                </div>
              </div>
              <div className="w-full border-t border-[#D4AF37]/20 my-4"></div>
              <div className="w-full space-y-2">
                {/* Bio removed */}
                {/* Preferences section */}
                <div>
                  <span className="text-xs text-[#D4AF37] font-semibold uppercase">Preferences</span>
                  <div className="text-[#f5f5f5] text-sm mt-1">
                    Table {selected.tablePreference || <span className="text-gray-400">(No Pref)</span>}, Seat {selected.seatPreference || <span className="text-gray-400">?</span>}
                  </div>
                </div>
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
                  <div className="text-[#f5f5f5] text-sm mt-1">
                    {registrationIdToSeat[selected.id]
                      ? `Yes (Table ${registrationIdToSeat[selected.id].tableNumber} Seat ${registrationIdToSeat[selected.id].seatNumber})`
                      : 'No'}
                  </div>
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
  const [showSeatPicker, setShowSeatPicker] = useState(false);
  const [seatPickerMode, setSeatPickerMode] = useState<'assign' | 'change'>("assign");
  const { data: seats, mutate: mutateSeats } = useSWR<Seat[]>(showSeatPicker ? "/api/admin/seating" : "/api/admin/seating", fetcher);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Always recalculate assignedSeat on every render
  const assignedSeat = React.useMemo(() => {
    if (!seats) return undefined;
    return seats.find(seat => seat.registrationId === registration.id);
  }, [seats, registration.id]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // Only update registration payment/paymentStatus, not seat assignment
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

  // Assign seat (for unassigned)
  const handleAssignSeat = () => {
    setSeatPickerMode('assign');
    setShowSeatPicker(true);
    setSelectedTable(null);
    setSelectedSeat(null);
  };

  // Change seat (for assigned)
  const handleChangeSeat = () => {
    setSeatPickerMode('change');
    setShowSeatPicker(true);
    setSelectedTable(null);
    setSelectedSeat(null);
  };

  // Unassign seat (for assigned)
  const handleUnassignSeat = async () => {
    setSaving(true);
    setError("");
    try {
      if (assignedSeat) {
        await fetch(`/api/admin/seating`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seatId: assignedSeat.id,
            registrationId: null,
          }),
        });
        mutateSeats && mutateSeats();
        onUpdated(registration);
        setEdit(false);
      }
    } catch {
      setError("Network error.");
    }
    setSaving(false);
  };

  // Confirm seat assignment/change
  const handleConfirmSeat = async () => {
    if (!selectedTable || !selectedSeat) {
      setError("Please select a table and seat.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (!seats) {
        setError("Seats data not loaded.");
        setSaving(false);
        return;
      }
      const seatObj = seats.find((s: any) => s.tableNumber === selectedTable && s.seatNumber === selectedSeat);
      if (!seatObj) {
        setError("Seat not found.");
        setSaving(false);
        return;
      }
      // If changing: unassign old seat first
      if (seatPickerMode === 'change' && assignedSeat) {
        await fetch(`/api/admin/seating`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            seatId: assignedSeat.id,
            registrationId: null,
          }),
        });
      }
      // Assign new seat
      await fetch(`/api/admin/seating`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seatId: seatObj.id,
          registrationId: registration.id,
        }),
      });
      mutateSeats && mutateSeats();
      onUpdated(registration);
      setShowSeatPicker(false);
    } catch {
      setError("Network error.");
    }
    setSaving(false);
  };

  // Table/seat picker modal
  const renderSeatPicker = () => {
    if (!seats) return <div className="text-center py-8">Loading seats...</div>;
    // Group seats by table
    const tables = seats.reduce((acc: Record<number, any[]>, seat: any) => {
      if (!acc[seat.tableNumber]) acc[seat.tableNumber] = [];
      acc[seat.tableNumber].push(seat);
      return acc;
    }, {});
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        <div className={styles.adminCard + " max-w-lg w-full relative animate-fade-in p-6 max-h-[95vh] overflow-y-auto sm:max-h-[90vh]"} style={{ overscrollBehavior: 'contain' }}>
          <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Assign Seat</h3>
          {error && <div className="text-pink-400 mb-2">{error}</div>}
          <div className="flex flex-wrap gap-4 max-h-80 overflow-y-auto">
            {Object.keys(tables).sort((a, b) => Number(a) - Number(b)).map(tableNum => (
              <div key={tableNum} className="min-w-[120px]">
                <div className="font-semibold text-[#D4AF37] mb-1">Table {tableNum}</div>
                <div className="flex flex-wrap gap-2">
                  {tables[Number(tableNum)].map((seat: any) => {
                    const isAssigned = !!seat.registrationId;
                    return (
                      <button
                        key={seat.id}
                        disabled={isAssigned}
                        className={`px-2 py-1 rounded border text-xs ${selectedTable === seat.tableNumber && selectedSeat === seat.seatNumber ? 'bg-[#D4AF37] text-[#23272F] border-[#D4AF37]' : 'bg-[#23272F] text-[#f5f5f5] border-[#D4AF37]/30'} ${isAssigned ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#D4AF37]/20'}`}
                        style={isAssigned ? { pointerEvents: 'none', cursor: 'not-allowed' } : {}}
                        onClick={() => { setSelectedTable(seat.tableNumber); setSelectedSeat(seat.seatNumber); }}
                      >
                        Seat {seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-6 justify-end">
            <button className={styles.adminButton + " bg-transparent text-[#D4AF37] border border-[#D4AF37]"} type="button" onClick={() => setShowSeatPicker(false)}>
              Cancel
            </button>
            <button className={styles.adminButton} onClick={handleConfirmSeat} disabled={saving}>
              {saving ? "Assigning..." : "Assign"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showSeatPicker && renderSeatPicker()}
      <div className="flex gap-4 justify-end mt-8 w-full flex-wrap">
        {error && <div className="text-pink-400 w-full mb-2">{error}</div>}
            {edit ? (
          <>
            <div className="flex flex-col sm:flex-row gap-4 w-full items-center mb-2">
              <div className="flex flex-col w-full max-w-[140px]">
                <label className="text-xs text-[#D4AF37] font-semibold mb-1" htmlFor="payment-input">Payment</label>
                <input
                  id="payment-input"
                  type="number"
                  className="rounded-lg border border-[#D4AF37] bg-[#23272F] text-[#f5f5f5] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] w-full transition"
                  value={form.payment}
                  min={0}
                  step={0.01}
                  onChange={e => setForm(f => ({ ...f, payment: parseFloat(e.target.value) }))}
                />
              </div>
              <div className="flex flex-col w-full max-w-[120px] items-center">
                <label className="text-xs text-[#D4AF37] font-semibold mb-1" htmlFor="paid-checkbox">Paid</label>
                <input
                  id="paid-checkbox"
                  type="checkbox"
                  checked={form.paymentStatus}
                  onChange={e => setForm(f => ({ ...f, paymentStatus: e.target.checked }))}
                  className="form-checkbox h-5 w-5 text-[#D4AF37] border-[#D4AF37] focus:ring-[#D4AF37] rounded transition"
                />
              </div>
            </div>
            {/* Seat assignment controls in edit mode */}
            <div className="flex items-center gap-2 mt-2 w-full">
              <span className="text-xs text-[#D4AF37] font-semibold whitespace-nowrap">Seat</span>
              {(seats && assignedSeat) ? (
                <>
                  <span className="text-xs text-[#f5f5f5] font-mono bg-[#23272F]/60 rounded px-2 py-1 border border-[#D4AF37]/20">
                    Table {assignedSeat.tableNumber} Seat {assignedSeat.seatNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleChangeSeat}
                    title="Change Seat"
                    className="rounded-full bg-[#23272F] hover:bg-[#D4AF37]/20 focus:bg-[#D4AF37]/30 transition-colors flex items-center justify-center h-7 w-7 text-[#D4AF37]"
                    style={{ lineHeight: 1, border: 'none', boxShadow: 'none' }}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={async () => { await handleUnassignSeat(); mutateSeats && mutateSeats(); }}
                    title="Unassign Seat"
                    className="rounded-full bg-[#23272F] hover:bg-pink-700 focus:bg-pink-800 transition-colors flex items-center justify-center h-7 w-7 text-pink-400 hover:text-white focus:text-white"
                    style={{ lineHeight: 1, border: 'none', boxShadow: 'none' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-xs text-[#f5f5f5] font-mono bg-[#23272F]/60 rounded px-2 py-1 border border-[#D4AF37]/20">No</span>
                  {registration.paymentStatus && (
                    <button
                      type="button"
                      onClick={handleAssignSeat}
                      title="Assign Seat"
                      className="rounded-full bg-[#23272F] hover:bg-green-700 focus:bg-green-800 transition-colors flex items-center justify-center h-7 w-7 text-green-400 hover:text-white focus:text-white ml-2"
                      style={{ lineHeight: 1, border: 'none', boxShadow: 'none' }}
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="flex gap-2 w-full mt-2">
              <button className={styles.adminButton + " flex-1"} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
              <button className={styles.adminButton + " flex-1 bg-transparent text-[#D4AF37] border border-[#D4AF37]"} type="button" onClick={() => setEdit(false)}>
                Cancel
              </button>
            </div>
            {/* Seat picker modal for change */}
            {showSeatPicker && seats && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                <div className={styles.adminCard + " max-w-lg w-full relative animate-fade-in p-6 max-h-[95vh] overflow-y-auto sm:max-h-[90vh]"} style={{ overscrollBehavior: 'contain' }}>
                  <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Change Seat</h3>
                  {error && <div className="text-pink-400 mb-2">{error}</div>}
                  <div className="flex flex-wrap gap-4 max-h-80 overflow-y-auto">
                    {Object.keys(seats.reduce((acc: Record<number, any[]>, seat: any) => {
                      if (!acc[seat.tableNumber]) acc[seat.tableNumber] = [];
                      acc[seat.tableNumber].push(seat);
                      return acc;
                    }, {})).sort((a, b) => Number(a) - Number(b)).map(tableNum => (
                      <div key={tableNum} className="min-w-[120px]">
                        <div className="font-semibold text-[#D4AF37] mb-1">Table {tableNum}</div>
                        <div className="flex flex-wrap gap-2">
                          {seats.filter((seat: any) => seat.tableNumber === Number(tableNum)).map((seat: any) => {
                            // In assign mode: disable if seat.registrationId is not null
                            // In change mode: disable if seat.registrationId is not null and not this registration's current seat
                            const isAssigned = seat.registrationId && seat.registrationId !== registration.id;
                            return (
                              <button
                                key={seat.id}
                                disabled={isAssigned}
                                className={`px-2 py-1 rounded border text-xs ${(selectedTable === seat.tableNumber && selectedSeat === seat.seatNumber) ? 'bg-[#D4AF37] text-[#23272F] border-[#D4AF37]' : 'bg-[#23272F] text-[#f5f5f5] border-[#D4AF37]/30'} ${isAssigned ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#D4AF37]/20'}`}
                                style={isAssigned ? { pointerEvents: 'none', cursor: 'not-allowed' } : {}}
                                onClick={() => { setSelectedTable(seat.tableNumber); setSelectedSeat(seat.seatNumber); }}
                              >
                                Seat {seat.seatNumber}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-6 justify-end">
                    <button className={styles.adminButton + " bg-transparent text-[#D4AF37] border border-[#D4AF37]"} type="button" onClick={() => setShowSeatPicker(false)}>
                      Cancel
                    </button>
                    <button className={styles.adminButton} onClick={handleConfirmSeat} disabled={saving}>
                      {saving ? 'Changing...' : 'Change'}
                    </button>
                  </div>
                </div>
              </div>
            )}
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
              <button className={styles.adminButton + " flex-1 bg-green-600 hover:bg-green-700 text-white"} onClick={handleAssignSeat}>
                Assign Seat
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
