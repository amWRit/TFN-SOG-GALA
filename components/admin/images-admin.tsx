import React, { useState, useEffect } from "react";
import { Trash2, Pencil } from "lucide-react";
import { ConfirmModal } from "./index";
import styles from "../../styles/admin-dashboard.module.css";

type ImageResource = {
  id: string;
  label: string;
  fileId: string;
  alt?: string;
  type?: string;
  createdAt: string;
};

export function ImagesAdmin() {
  const [images, setImages] = useState<ImageResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ label: "", driveLink: "", alt: "", type: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
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
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/images");
      const data = await res.json();
      if (res.ok) {
        setImages(data.images);
      } else {
        setError(data.error || "Failed to load images");
      }
    } catch (e) {
      setError("Failed to load images");
    }
    setLoading(false);
  }

  function extractFileIdFromDriveLink(link: string): string | null {
    // Handles links like https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const match = link.match(/\/d\/([\w-]+)/);
    return match ? match[1] : null;
  }

  // Track if user has manually edited the alt field
  const [altTouched, setAltTouched] = useState(false);

  // Generate alt text from label
  function generateAltFromLabel(label: string) {
    return label.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  // Update alt dynamically if not touched
  useEffect(() => {
    if (!altTouched) {
      setForm(f => ({ ...f, alt: generateAltFromLabel(f.label) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.label]);

  async function handleAddOrEditImage(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!form.label || !form.driveLink) {
      setFormError("Label and fileId are required.");
      return;
    }
    // Client-side unique constraint check
    const fileId = extractFileIdFromDriveLink(form.driveLink);
    if (!fileId) {
      setFormError("Invalid Google Drive link. Please use a shareable link.");
      return;
    }
    if (!editId && images.some(img => img.label === form.label)) {
      setFormError("An image with this label already exists.");
      return;
    }
    if (!editId && images.some(img => img.fileId === fileId)) {
      setFormError("An image with this Google Drive file already exists.");
      return;
    }
    // Auto-generate alt text from label if not provided
    const altText = form.alt && form.alt.trim() !== "" ? form.alt : form.label.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const payload = { ...form, alt: altText };
    setLoading(true);
    try {
      let res, data;
      if (editId) {
        res = await fetch(`/api/admin/images/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
      } else {
        res = await fetch("/api/admin/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        data = await res.json();
      }
      if (res.ok) {
        setFormSuccess(editId ? "Image updated successfully." : "Image added successfully.");
        setForm({ label: "", driveLink: "", alt: "", type: "" });
        setEditId(null);
        setAltTouched(false);
        fetchImages();
      } else {
        setFormError(data.error || (editId ? "Failed to update image" : "Failed to add image"));
      }
    } catch (e) {
      setFormError(editId ? "Failed to update image" : "Failed to add image");
    }
    setLoading(false);
  }

  async function handleDeleteImage() {
    if (!deleteId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/admin/images/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setImages((images: ImageResource[]) => images.filter((img: ImageResource) => img.id !== deleteId));
        setDeleteId(null);
      } else {
        setDeleteError(data.error || "Failed to delete image");
      }
    } catch (e) {
      setDeleteError("Failed to delete image");
    }
    setDeleteLoading(false);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-[#D4AF37]">Images</h2>
      <div className="flex flex-col md:flex-row gap-6 items-stretch" style={{ minHeight: 340 }}>
        {/* Left: Add Image Form */}
        <div className="flex-1 min-w-[260px] flex flex-col" style={{ height: 610 }}>
          <div className={`${styles.adminCard} h-full flex flex-col`} style={{ height: '100%' }}>
            <h3 className="font-semibold mb-2 text-[#D4AF37]">{editId ? "Edit Image" : "Add New Image"}</h3>
            <form onSubmit={handleAddOrEditImage} className="flex flex-col flex-1">
              <label className={styles.adminFormLabel} htmlFor="image-label">Label</label>
              <input
                id="image-label"
                className={styles.adminInput}
                type="text"
                value={form.label}
                onChange={e => {
                  setForm(f => ({ ...f, label: e.target.value }));
                  if (altTouched && e.target.value === "") setAltTouched(false);
                }}
                autoComplete="off"
                required
                placeholder="e.g. Fonepay_QR_SIBL"
              />
              <label className={styles.adminFormLabel} htmlFor="image-driveLink">Google Drive Shareable Link</label>
              <input
                id="image-driveLink"
                className={styles.adminInput + " placeholder:text-s"}
                type="text"
                value={form.driveLink}
                onChange={e => setForm(f => ({ ...f, driveLink: e.target.value }))}
                required
                placeholder="e.g: https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
              />
              <label className={styles.adminFormLabel} htmlFor="image-alt">Alt Text</label>
              <input
                id="image-alt"
                className={styles.adminInput}
                type="text"
                value={form.alt}
                onChange={e => {
                  setForm(f => ({ ...f, alt: e.target.value }));
                  setAltTouched(true);
                }}
                placeholder="e.g. Fonepay QR Siddhartha Bank"
              />
              <label className={styles.adminFormLabel} htmlFor="image-type">Type (optional)</label>
              <input
                id="image-type"
                className={styles.adminInput}
                type="text"
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                placeholder="e.g. payment_qr"
              />
              {formError && <div className="text-red-400 mb-2">{formError}</div>}
              {formSuccess && <div className="text-green-400 mb-2">{formSuccess}</div>}
              <div className="mt-auto pt-2 flex justify-end">
                <button className={styles.adminButton} type="submit" disabled={loading}>
                  {loading ? (editId ? "Saving..." : "Adding...") : (editId ? "Save Image" : "Add Image")}
                </button>
                {editId && (
                  <button
                    type="button"
                    className={styles.adminButtonRed}
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      setEditId(null);
                      setForm({ label: "", driveLink: "", alt: "", type: "" });
                      setFormError(null);
                      setFormSuccess(null);
                      setAltTouched(false);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
        {/* Right: Image List */}
        <div className="flex-1 min-w-[260px] flex flex-col" style={{ height: 610 }}>
          <div className={`${styles.adminCard} h-full flex flex-col`} style={{ height: '100%' }}>
            <h3 className="font-semibold mb-2 text-[#D4AF37]">All Images</h3>
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
                        <th className="py-1 pr-4">Label</th>
                        <th className="py-1 pr-4">File ID</th>
                        <th className="py-1 pr-4 hidden sm:table-cell">Created</th>
                        <th className="py-1 pr-4 sticky right-0 z-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {images.map(img => (
                        <tr key={img.id} className="border-b border-[#d4af3722]">
                          <td className="py-1 pr-4">{img.label}</td>
                          <td className="py-1 pr-4">{img.fileId}</td>
                          <td className="py-1 pr-4 hidden sm:table-cell">{new Date(img.createdAt).toLocaleString()}</td>
                          <td className="py-1 pr-4 flex gap-2 sticky right-0 z-10">
                            <button
                              className={styles.adminButtonSmallRed}
                              title="Edit image"
                              onClick={() => {
                                setEditId(img.id);
                                setForm({
                                  label: img.label,
                                  driveLink: `https://drive.google.com/file/d/${img.fileId}/view?usp=sharing`,
                                  alt: img.alt || "",
                                  type: img.type || ""
                                });
                                setFormError(null);
                                setFormSuccess(null);
                                setAltTouched(false);
                              }}
                              style={{ padding: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fbbf24', border: 'none' }}
                              disabled={deleteLoading || loading}
                            >
                              <Pencil size={18} color="#000000" strokeWidth={2} />
                            </button>
                            <button
                              className={styles.adminButtonSmallRed}
                              title="Delete image"
                              onClick={() => setDeleteId(img.id)}
                              disabled={deleteLoading}
                              style={{ padding: 0, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Trash2 size={18} color="#fff" strokeWidth={2} />
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
              title="Delete Image?"
              message="Are you sure you want to delete this image? This action cannot be undone."
              confirmLabel="Delete"
              cancelLabel="Cancel"
              loading={deleteLoading}
              onConfirm={handleDeleteImage}
              onCancel={() => setDeleteId(null)}
            />
            {deleteError && <div className="text-red-400 mt-2">{deleteError}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
