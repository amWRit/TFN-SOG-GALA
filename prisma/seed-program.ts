/**
 * Seed script for Program schedule items only
 * Run with:
 *   npx tsx prisma/seed-program.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Program schedule items...");

  // Optionally clear existing program data
  await prisma.program.deleteMany();

  const now = new Date();
  const programCount = 10;
  const programTypes = [
    "Welcome",
    "Speech",
    "Dinner",
    "Auction",
    "Performance",
    "Break",
    "Award",
    "Panel",
    "Closing",
    "Networking",
  ];
  const programData = Array.from({ length: programCount }, (_, i) => {
    const start = new Date(now.getTime() + i * 30 * 60 * 1000); // 30 min apart
    const end = new Date(start.getTime() + 25 * 60 * 1000); // 25 min duration
    return {
      title: `${programTypes[i]} Session`,
      description: `This is the ${programTypes[i].toLowerCase()} session of the event.`,
      startTime: start,
      endTime: end,
      location: `Main Hall${i % 2 === 0 ? '' : ' B'}`,
      sequence: i + 1,
      speaker: i % 3 === 0 ? `Speaker ${i + 1}` : null,
      speakerBio: i % 3 === 0 ? `Bio for Speaker ${i + 1}.` : null,
      type: programTypes[i],
      visibility: true,
      imageUrl: null,
      externalLink: null,
      notes: i % 2 === 0 ? "Internal note." : null,
      capacity: i % 2 === 0 ? 100 + i * 10 : null,
      rsvpRequired: i % 4 === 0,
    };
  });
  await prisma.program.createMany({ data: programData });
  console.log(`✅ Seeded ${programCount} program schedule items`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
