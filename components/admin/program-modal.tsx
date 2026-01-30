// Comprehensive list of program types
const programTypes = [
  "Welcome",
  "Registration",
  "Opening Remarks",
  "Speech",
  "Keynote",
  "Fireside Chat",
  "Workshop",
  "Panel",
  "Q&A",
  "Dinner",
  "Auction",
  "Raffle",
  "Performance",
  "Entertainment",
  "Break",
  "Intermission",
  "Award",
  "Sponsor Recognition",
  "Group Photo",
  "Networking",
  "Refreshments",
  "Farewell",
  "Closing",
  "Other"
];
import React, { useState } from "react";
import { Pencil, Trash2, CalendarClock, MapPin, User, Link2, Info, AlignLeft } from "lucide-react";
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

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
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
        <h2 className="text-2xl font-bold mb-4 text-center flex items-center gap-2 justify-center">
          {isAdd && <><Info className="inline-block mb-1" size={24}/> Add Program</>}
          {isEdit && <><Pencil className="inline-block mb-1" size={22}/> Edit Program</>}
          {isView && <><Info className="inline-block mb-1" size={24}/> Program Details</>}
        </h2>
        {/* Edit/Delete buttons in view mode */}
        {isView && (onEdit || onDelete) && (
          <div className="flex gap-3 justify-center mb-4">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className={styles.adminButtonSmall}
                title="Edit"
              >
                <Pencil size={18} />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className={styles.adminButtonSmallRed}
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
            <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><AlignLeft size={18}/> Title</label>
            {isView ? (
              <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent font-bold text-lg flex items-center gap-2">
                <AlignLeft size={20} className="opacity-70" /> {form.title}
              </div>
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
          <div className="my-4">
            <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><Info size={18}/> Description</label>
            {isView ? (
              <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent whitespace-pre-line flex items-start gap-2">
                <Info size={18} className="opacity-70 mt-1" /> <span>{form.description}</span>
              </div>
            ) : (
              <>
                <textarea
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                  name="description"
                  value={form.description ?? ""}
                  onChange={handleChange}
                  rows={3}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-400 mt-1 text-right">Max length: 1000 characters</div>
              </>
            )}
          </div>
          {/* Type & Location */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><Info size={16}/> Type</label>
              {isView ? (
                <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent flex items-center gap-2">
                  <Info size={16} className="opacity-70" /> {form.type}
                </div>
              ) : (
                <select
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                  name="type"
                  value={form.type ?? ""}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select type…</option>
                  {programTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><MapPin size={16}/> Location</label>
              {isView ? (
                <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent flex items-center gap-2">
                  <MapPin size={16} className="opacity-70" /> {form.location}
                </div>
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
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><CalendarClock size={16}/> Start Time</label>
              {isView ? (
                <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent flex items-center gap-2">
                  <CalendarClock size={16} className="opacity-70" /> {form.startTime ? new Date(form.startTime).toLocaleString() : ""}
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
              <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><CalendarClock size={16}/> End Time</label>
              {isView ? (
                <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent flex items-center gap-2">
                  <CalendarClock size={16} className="opacity-70" /> {form.endTime ? new Date(form.endTime).toLocaleString() : ""}
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
          <div>
            <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><User size={16}/> Speaker</label>
            {isView ? (
              <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent flex items-center gap-2">
                <User size={16} className="opacity-70" /> {form.speaker}
              </div>
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
          <div className="mt-2">
            <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><User size={16}/> Speaker Bio</label>
            {isView ? (
              <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent flex items-center gap-2">
                <User size={16} className="opacity-70" /> {form.speakerBio}
              </div>
            ) : (
              <>
                <textarea
                  className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
                  name="speakerBio"
                  value={form.speakerBio ?? ""}
                  onChange={handleChange}
                  rows={3}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-400 mt-1 text-right">Max length: 1000 characters</div>
              </>
            )}
          </div>
          {/* External Link */}
          <div>
            <label className="block text-sm font-semibold mb-1 flex items-center gap-2"><Link2 size={16}/> External Link</label>
            {isView ? (
              <div className="w-full px-4 py-2 rounded-lg text-[#f5f5f5] bg-transparent border border-transparent break-all flex items-center gap-2">
                <Link2 size={16} className="opacity-70" />
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
                className={styles.adminButtonSmall + " flex-1"}
                disabled={saving}
              >
                {saving ? (isAdd ? "Adding..." : "Saving...") : (isAdd ? "Add Program" : "Save Changes")}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className={styles.adminButtonSmallRed + " flex-1"}
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
