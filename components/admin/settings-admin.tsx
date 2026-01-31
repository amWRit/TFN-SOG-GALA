
import React, { useState, useEffect } from "react";
import styles from "../../styles/admin-dashboard.module.css";
import { ConfirmModal } from "./confirm-modal";


type AdminAccount = {
  id: string;
  email: string;
  createdAt: string;
};

export function SettingsAdmin() {
  const [activeSubTab, setActiveSubTab] = useState<"account" | "future">("account");
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (activeSubTab === "account") {
      fetchAdmins();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSubTab]);

  async function fetchAdmins() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/accounts");
      const data = await res.json();
      if (res.ok) {
        setAdmins(data.admins);
      } else {
        setError(data.error || "Failed to load admins");
      }
    } catch (e) {
      setError("Failed to load admins");
    }
    setLoading(false);
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!form.email || !form.password) {
      setFormError("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setFormSuccess("Admin added successfully.");
        setForm({ email: "", password: "" });
        fetchAdmins();
      } else {
        setFormError(data.error || "Failed to add admin");
      }
    } catch (e) {
      setFormError("Failed to add admin");
    }
    setLoading(false);
  }

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    async function handleDeleteAdmin() {
        if (!deleteId) return;
        setDeleteLoading(true);
        setDeleteError(null);
        try {
        const res = await fetch(`/api/admin/accounts/${deleteId}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok) {
            setAdmins((admins: AdminAccount[]) => admins.filter((a: AdminAccount) => a.id !== deleteId));
            setDeleteId(null);
        } else {
            setDeleteError(data.error || "Failed to delete admin");
        }
        } catch (e) {
        setDeleteError("Failed to delete admin");
        }
        setDeleteLoading(false);
    }

  return (
    <div className="bg-gray-900 rounded-lg p-6 min-h-[300px]">
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold transition-colors ${activeSubTab === "account" ? "bg-[#D4AF37] text-[#1a1a1a]" : "bg-gray-800 text-[#f5f5f5]/80 hover:text-[#D4AF37]"}`}
          onClick={() => setActiveSubTab("account")}
        >
          Account
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold transition-colors ${activeSubTab === "future" ? "bg-[#D4AF37] text-[#1a1a1a]" : "bg-gray-800 text-[#f5f5f5]/80 hover:text-[#D4AF37]"}`}
          onClick={() => setActiveSubTab("future")}
        >
          Future
        </button>
      </div>
      {activeSubTab === "account" && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">Admin Accounts</h2>
          <div className="flex flex-col md:flex-row gap-6 items-stretch" style={{ minHeight: 340, height: 340 }}>
            {/* Left: Add Admin Form */}
            <div className="flex-1 min-w-[260px] flex flex-col" style={{ height: 420 }}>
              <div className={`${styles.adminCard} h-full flex flex-col`} style={{ height: '100%' }}>
                <h3 className="font-semibold mb-2 text-[#D4AF37]">Add New Admin</h3>
                <form onSubmit={handleAddAdmin} className="flex flex-col flex-1">
                  <label className={styles.adminFormLabel} htmlFor="admin-email">Email</label>
                  <input
                    id="admin-email"
                    className={styles.adminInput}
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    autoComplete="off"
                    required
                  />
                  <label className={styles.adminFormLabel} htmlFor="admin-password">Password</label>
                  <input
                    id="admin-password"
                    className={styles.adminInput}
                    type="password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                  />
                  {formError && <div className="text-red-400 mb-2">{formError}</div>}
                  {formSuccess && <div className="text-green-400 mb-2">{formSuccess}</div>}
                  <div className="mt-auto pt-2">
                    <button className={styles.adminButton} type="submit" disabled={loading}>
                      {loading ? "Adding..." : "Add Admin"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* Right: Admin List */}
            <div className="flex-1 min-w-[260px] flex flex-col" style={{ height: 540 }}>
              <div className={`${styles.adminCard} h-full flex flex-col`} style={{ height: '100%' }}>
                <h3 className="font-semibold mb-2 text-[#D4AF37]">All Admins</h3>
                {loading ? (
                  <div className="text-[#f5f5f5]/80">Loading...</div>
                ) : error ? (
                  <div className="text-red-400">{error}</div>
                ) : (
                  <div className="flex-1 overflow-y-auto w-full">
                    <div className="w-full md:w-auto overflow-x-auto">
                      <table className="w-full min-w-[400px] text-sm mt-2">
                        <thead>
                          <tr className="text-[#D4AF37] text-left">
                            <th className="py-1 pr-4">Email</th>
                            <th className="py-1 pr-4">Created</th>
                            <th className="py-1 pr-4"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {admins.map(a => (
                            <tr key={a.id} className="border-b border-[#d4af3722]">
                              <td className="py-1 pr-4">{a.email}</td>
                              <td className="py-1 pr-4">{new Date(a.createdAt).toLocaleString()}</td>
                              <td className="py-1 pr-4">
                                <button
                                  className={styles.adminButtonSmallRed}
                                  title="Delete admin"
                                  onClick={() => setDeleteId(a.id)}
                                  disabled={deleteLoading}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
                <ConfirmModal
                  open={!!deleteId}
                  title="Delete Admin Account"
                  message="Are you sure you want to delete this admin account? This action cannot be undone."
                  confirmLabel={deleteLoading ? "Deleting..." : "Delete"}
                  cancelLabel="Cancel"
                  loading={deleteLoading}
                  onConfirm={handleDeleteAdmin}
                  onCancel={() => setDeleteId(null)}
                />
                {deleteError && <div className="text-red-400 mt-2">{deleteError}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
      {activeSubTab === "future" && (
        <div>
          <h2 className="text-xl font-bold mb-2 text-[#D4AF37]">Future Features</h2>
          <p className="text-[#f5f5f5]/80">This section is reserved for future settings and features.</p>
        </div>
      )}
    </div>
  );
}
