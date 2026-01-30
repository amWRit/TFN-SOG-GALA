import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProgramListCard from "./program-list-card";
import ProgramDetailCard from "./program-detail-card";
import ProgramModal, { ProgramModalMode } from "./program-modal";
import styles from "../../styles/admin-dashboard.module.css";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

async function fetchPrograms() {
  const res = await fetch("/api/program", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export function ProgramAdmin() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ProgramModalMode>("view");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrograms().then((data) => {
      setPrograms(data);
      setLoading(false);
    });
  }, []);

  const handleView = (item: any) => {
    setSelected(item);
    setModalMode("view");
    setModalOpen(true);
  };
  const handleAdd = () => {
    setSelected(null);
    setModalMode("add");
    setModalOpen(true);
  };
  const handleEdit = () => {
    setModalMode("edit");
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelected(null);
  };
  const handleDelete = () => {
    // TODO: Implement delete logic
    setModalOpen(false);
    setSelected(null);
  };
  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      let res;
      if (modalMode === "add") {
        res = await fetch("/api/program", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else if (modalMode === "edit" && selected?.id) {
        res = await fetch(`/api/program/${selected.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      if (res?.ok) {
        toast.success(modalMode === "add" ? "Program added!" : "Program updated!");
        // Refresh list
        setLoading(true);
        fetchPrograms().then((data) => {
          setPrograms(data);
          setLoading(false);
        });
        setModalOpen(false);
        setSelected(null);
      } else {
        toast.error("Failed to save program");
      }
    } catch (e) {
      toast.error("Error saving program");
    } finally {
      setSaving(false);
    }
  };

  // dnd-kit setup
  const sensors = useSensors(useSensor(PointerSensor));

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = programs.findIndex((p) => p.id === active.id);
      const newIndex = programs.findIndex((p) => p.id === over.id);
      const newItems = arrayMove(programs, oldIndex, newIndex).map((item, idx) => ({ ...item, sequence: idx + 1 }));
      setPrograms(newItems);
      // Persist new order to backend
      try {
        await fetch("/api/program", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: newItems.map(({ id, sequence }) => ({ id, sequence })) }),
        });
      } catch (e) {
        // Optionally show error toast
      }
    }
  }

  // Sortable wrapper for each card
  function SortableProgramCard({ item, onView }: { item: any; onView: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.6 : 1,
      zIndex: isDragging ? 10 : undefined,
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes}>
        <ProgramListCard item={item} onView={onView} dragHandleProps={listeners} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={styles.sectionTitle}>Program Schedule</h2>
        <Button variant="default" className="flex items-center gap-2" onClick={handleAdd}>
          <Plus size={18} /> Add Program
        </Button>
      </div>
      {loading ? (
        <div className="text-gray-400 py-10 text-center">Loading programs...</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={programs.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-2">
              {programs.map((item) => (
                <SortableProgramCard key={item.id} item={item} onView={() => handleView(item)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Program Modal for add/edit/view */}
        <ProgramModal
          open={modalOpen}
          mode={modalMode}
          item={selected}
          onSave={handleSave}
          onClose={handleCloseModal}
          onEdit={modalMode === "view" ? handleEdit : undefined}
          onDelete={modalMode === "view" ? handleDelete : undefined}
          saving={saving}
        />
    </div>
  );
}
