import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import styles from '../../styles/admin-dashboard.module.css';

export type ProgramModalMode = "add" | "edit" | "view";

interface ProgramModalProps {
  open: boolean;
  mode: ProgramModalMode;
  item?: any;
  onSave: (data: any) => void;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  saving?: boolean;
}

const defaultProgram = {
  title: "",
  description: "",
  type: "",
  startTime: "",
  endTime: "",
  location: "",
  speaker: "",
  speakerBio: "",
  externalLink: ""
};

export const ProgramModal: React.FC<ProgramModalProps> = ({ open, mode, item, onSave, onClose, onEdit, onDelete, saving }) => {
  const [form, setForm] = useState(item ? { ...defaultProgram, ...item } : defaultProgram);
  const isView = mode === "view";
  const isEdit = mode === "edit";
  const isAdd = mode === "add";

  React.useEffect(() => {
    setForm(item ? { ...defaultProgram, ...item } : defaultProgram);
  }, [item, open]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={"glass-strong rounded-xl shadow-lg w-full max-w-lg md:max-w-2xl p-6 md:p-10 relative animate-fade-in text-white mx-2"}
        style={{ minWidth: 0, maxHeight: '90vh', overflowY: 'auto', marginTop: '5vh', marginBottom: '5vh' }}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white z-10 text-2xl font-bold"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isAdd && "Add Program"}
          {isEdit && "Edit Program"}
          {isView && "View Program"}
        </h2>
        {/* Edit/Delete buttons in view mode */}
        {isView && (onEdit || onDelete) && (
          <div className="flex gap-3 justify-center mb-4">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#D4AF37] text-[#18181b] font-semibold hover:bg-[#bfa43a] transition"
                title="Edit"
              >
                <Pencil size={18} />
              </button>
            )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            {isView ? (
              <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent font-bold text-lg">{form.title}</div>
            ) : (
              <input
                className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                name="title"
                value={form.title ?? ""}
                onChange={handleChange}
                required
                maxLength={100}
              />
            )}
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">Description</label>
            {isView ? (
              <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent whitespace-pre-line">{form.description}</div>
            ) : (
              <textarea
                className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                name="description"
                value={form.description ?? ""}
                onChange={handleChange}
                rows={3}
                maxLength={500}
              />
            )}
          </div>
          {/* Type & Location */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Type</label>
              {isView ? (
                <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent">{form.type}</div>
              ) : (
                <input
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                  name="type"
                  value={form.type ?? ""}
                  onChange={handleChange}
                  maxLength={30}
                />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Location</label>
              {isView ? (
                <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent">{form.location}</div>
              ) : (
                <input
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                  name="location"
                  value={form.location ?? ""}
                  onChange={handleChange}
                  maxLength={60}
                />
              )}
            </div>
          </div>
          {/* Start & End Time */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Start Time</label>
              {isView ? (
                <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent">
                  {form.startTime ? new Date(form.startTime).toLocaleString() : ""}
                </div>
              ) : (
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                  name="startTime"
                  value={form.startTime ? form.startTime.slice(0, 16) : ""}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">End Time</label>
              {isView ? (
                <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent">
                  {form.endTime ? new Date(form.endTime).toLocaleString() : ""}
                </div>
              ) : (
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                  name="endTime"
                  value={form.endTime ? form.endTime.slice(0, 16) : ""}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          </div>
          {/* Speaker & Bio */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Speaker</label>
              {isView ? (
                <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent">{form.speaker}</div>
              ) : (
                <input
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                  name="speaker"
                  value={form.speaker ?? ""}
                  onChange={handleChange}
                  maxLength={60}
                />
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">Speaker Bio</label>
              {isView ? (
                <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent">{form.speakerBio}</div>
              ) : (
                <input
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                  name="speakerBio"
                  value={form.speakerBio ?? ""}
                  onChange={handleChange}
                  maxLength={200}
                />
              )}
            </div>
          </div>
          {/* External Link */}
          <div>
            <label className="block text-sm font-semibold mb-1">External Link</label>
            {isView ? (
              <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent break-all">
                {form.externalLink ? (
                  (() => {
                    const url = form.externalLink.match(/^https?:\/\//i)
                      ? form.externalLink
                      : `https://${form.externalLink}`;
                    return (
                      <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-[#D4AF37]">{form.externalLink}</a>
                    );
                  })()
                ) : ""}
              </div>
            ) : (
              <input
                className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                name="externalLink"
                value={form.externalLink ?? ""}
                onChange={handleChange}
                maxLength={200}
              />
            )}
          </div>
          {/* Save/Cancel buttons for add/edit only */}
          {!isView && (
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 py-2 rounded-lg bg-[#D4AF37] text-[#18181b] font-semibold hover:bg-[#bfa43a] transition disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? (isAdd ? "Adding..." : "Saving...") : (isAdd ? "Add Program" : "Save Changes")}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProgramModal;
