import React, { useEffect, useState } from "react";
import ProgramListCard from "./program-list-card";
import ProgramDetailCard from "./program-detail-card";
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
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchPrograms().then((data) => {
      setPrograms(data);
      setLoading(false);
    });
  }, []);

  const handleView = (item: any) => {
    setSelected(item);
    setShowDetail(true);
  };
  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelected(null);
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
        <Button variant="default" className="flex items-center gap-2">
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

      {/* Detail Modal */}
      {showDetail && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative">
            <button
              onClick={handleCloseDetail}
              className="absolute top-2 right-2 text-gray-400 hover:text-white z-10 text-2xl font-bold"
              aria-label="Close"
            >
              ×
            </button>
            <ProgramDetailCard item={selected} isAdmin className={styles.auctionDetailCard} onEdit={() => {}} onDelete={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
}
