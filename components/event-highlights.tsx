"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import Image from "next/image";

interface Highlight {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

// Sample highlights - replace with actual data
const highlights: Highlight[] = [
  {
    id: 1,
    title: "Elegant Reception",
    description: "Welcome cocktails and networking in our beautifully decorated venue",
    imageUrl: "/images/placeholderimg.png",
  },
  {
    id: 2,
    title: "Gourmet Dinner",
    description: "A curated menu featuring Nepali and international cuisine",
    imageUrl: "/images/placeholderimg.png",
  },
  {
    id: 3,
    title: "Live Auction",
    description: "Bid on exclusive experiences and items supporting our mission",
    imageUrl: "/images/placeholderimg.png",
  },
  {
    id: 4,
    title: "Inspiring Speakers",
    description: "Hear from fellows and students whose lives have been transformed",
    imageUrl: "/images/placeholderimg.png",
  },
  {
    id: 5,
    title: "Musical Performance",
    description: "Enjoy live music celebrating Nepali culture",
    imageUrl: "/images/placeholderimg.png",
  },
  {
    id: 6,
    title: "Dancing & Celebration",
    description: "End the evening with music and celebration",
    imageUrl: "/images/placeholderimg.png",
  },
];

export function EventHighlights() {
  const [selectedHighlight, setSelectedHighlight] = useState<Highlight | null>(null);

  return (
    <>
      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
        {highlights.map((highlight, index) => (
          <motion.div
            key={highlight.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="mb-6 break-inside-avoid"
          >
            <Card
              className="glass-strong overflow-hidden cursor-pointer group hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedHighlight(highlight)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/90 via-transparent to-transparent z-10" />
                <Image
                  src={highlight.imageUrl}
                  alt={highlight.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="font-playfair text-2xl font-semibold text-[#D4AF37] mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-[#f5f5f5]/90">{highlight.description}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedHighlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            onClick={() => setSelectedHighlight(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full glass-strong rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedHighlight(null)}
                className="absolute top-4 right-4 z-10 text-[#f5f5f5] hover:text-[#D4AF37] transition-colors"
              >
                <X size={24} />
              </button>
              <div className="relative aspect-video">
                <Image
                  src={selectedHighlight.imageUrl}
                  alt={selectedHighlight.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="p-8">
                <h3 className="font-playfair text-3xl font-semibold text-[#D4AF37] mb-4">
                  {selectedHighlight.title}
                </h3>
                <p className="text-lg text-[#f5f5f5]/90">
                  {selectedHighlight.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
