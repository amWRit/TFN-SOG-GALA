import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import styles from "../../styles/admin-dashboard.module.css";
import { ConfirmModal } from "./confirm-modal";

type AdminAccount = {
  id: string;
  email: string;
  createdAt: string;
};

export function AdminAccounts() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (formSuccess) {
      const timeout = setTimeout(() => setFormSuccess(null), 1500);
      return () => clearTimeout(timeout);
    }
  }, [formSuccess]);

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div>
      <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">Admin Accounts</h2>
      <div className="flex flex-col md:flex-row gap-6 items-stretch" style={{ minHeight: 340, height: 340 }}>
        {/* Left: Add Admin Form */}
        <div className="flex-1 min-w-[260px] flex flex-col" style={{ height: 480 }}>
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
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
              <div className="flex items-center mt-1 mb-2">
                <input
                  id="show-password"
                  type="checkbox"
                  checked={showPassword}
                  onChange={e => setShowPassword(e.target.checked)}
                  className="mr-2"
                  style={{ width: 20, height: 20 }}
                />
                <label htmlFor="show-password" className="text-sm text-[#f5f5f5]/80 select-none cursor-pointer">Show password</label>
              </div>
              {formError && <div className="text-red-400 mb-2">{formError}</div>}
              {formSuccess && <div className="text-green-400 mb-2">{formSuccess}</div>}
              <div className="mt-auto pt-2 flex justify-end">
                <button className={styles.adminButton} type="submit" disabled={loading}>
                  {loading ? "Adding..." : "Add Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Right: Admin List */}
        <div className="flex-1 min-w-[260px] flex flex-col" style={{ height: 480 }}>
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
                        <th className="py-1 pr-4 hidden sm:table-cell">Created</th>
                        <th className="py-1 pr-4 sticky right-0 z-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map(a => (
                        <tr key={a.id} className="border-b border-[#d4af3722]">
                          <td className="py-1 pr-4">{a.email}</td>
                          <td className="py-1 pr-4 hidden sm:table-cell">{new Date(a.createdAt).toLocaleString()}</td>
                          <td className="py-1 pr-4 sticky right-0 z-10">
                            <button
                              className={styles.adminButtonSmallRed}
                              title="Delete admin"
                              onClick={() => setDeleteId(a.id)}
                              disabled={deleteLoading}
                              style={{ padding: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Trash2 size={18} />
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
  );
}
