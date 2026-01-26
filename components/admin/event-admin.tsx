"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";

export function EventAdmin() {
  const [highlights, setHighlights] = useState({
    text: "Join us for an elegant evening supporting education in Nepal.",
  });

  const handleSave = async () => {
    try {
      // In a real app, save to database
      toast.success("Event details saved!");
    } catch (error) {
      toast.error("Failed to save");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="glass-strong p-6">
        <h2 className="font-playfair text-2xl font-bold text-[#D4AF37] mb-6">
          Event Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#f5f5f5]/80 mb-2">
              Event Highlights Text
            </label>
            <textarea
              value={highlights.text}
              onChange={(e) =>
                setHighlights({ ...highlights, text: e.target.value })
              }
              className="w-full px-4 py-2 bg-[#1a1a1a]/50 border border-[#D4AF37]/30 rounded-lg text-[#f5f5f5]"
              rows={4}
            />
          </div>

          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>

      <Card className="glass-strong p-6">
        <h2 className="font-playfair text-2xl font-bold text-[#D4AF37] mb-6">
          Upload Images
        </h2>
        <p className="text-[#f5f5f5]/60 mb-4">
          Upload images to /public/images/ folder. Images will be available at
          /images/filename.jpg
        </p>
        <div className="border-2 border-dashed border-[#D4AF37]/30 rounded-lg p-8 text-center">
          <Upload size={48} className="mx-auto mb-4 text-[#D4AF37]/50" />
          <p className="text-[#f5f5f5]/60">
            Drag and drop images here or click to browse
          </p>
          <p className="text-sm text-[#f5f5f5]/40 mt-2">
            Note: Upload images directly to /public/images/ via your deployment
            platform or file system
          </p>
        </div>
      </Card>
    </div>
  );
}
