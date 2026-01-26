/**
 * Seed script for Gala 2026
 * - Clears existing Seat, AuctionItem, Bid data
 * - Inserts 20 sample seats and 20 sample auction items
 *
 * Run with:
 *   npx prisma db seed
 * or:
 *   npx tsx prisma/seed.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with sample gala data...");

  // Clear existing data (respect relations: bids -> auction items -> seats)
  await prisma.bid.deleteMany();
  await prisma.auctionItem.deleteMany();
  await prisma.seat.deleteMany();

  // Shared demo images
  const seatImg =
    "https://cdn-icons-png.flaticon.com/256/1683/1683707.png";
  const auctionImg =
    "https://cdn-icons-png.flaticon.com/512/433/433013.png";

  // --- Seats: 20 demo guests spread across tables ---
  const seatCount = 20;
  const seatData = Array.from({ length: seatCount }, (_, i) => {
    const index = i; // 0-based
    const tableNumber = Math.floor(index / 8) + 1; // 8 seats per table
    const seatNumber = (index % 8) + 1;

    return {
      tableNumber,
      seatNumber,
      name: `Guest ${index + 1}`,
      quote: `“Education changes everything” — Guest ${index + 1}`,
      bio: `Bio for Guest ${index + 1}. Long-time supporter of education in Nepal.`,
      involvement: index % 2 === 0 ? "Donor" : "Supporter",
      imageUrl: seatImg,
    };
  });

  await prisma.seat.createMany({ data: seatData, skipDuplicates: true });
  console.log(`✅ Seeded ${seatCount} seats`);

  // --- Auction Items: 20 demo items ---
  const auctionItemCount = 20;
  const now = new Date();

  const auctionItemsData = Array.from(
    { length: auctionItemCount },
    (_, i) => {
      const index = i;
      const baseBid = Math.floor(Math.random() * 1000) + 100;

      return {
        title: `Auction Item ${index + 1}`,
        description: `Description for Auction Item ${index + 1}. A unique experience or item supporting Teach For Nepal-style initiatives.`,
        imageUrl: auctionImg,
        startingBid: baseBid,
        currentBid: baseBid,
        currentBidder: null,
        endTime: new Date(
          now.getTime() + (index + 1) * 10 * 60 * 1000 // stagger end times
        ),
        isActive: true,
      };
    }
  );

  await prisma.auctionItem.createMany({ data: auctionItemsData });
  console.log(`✅ Seeded ${auctionItemCount} auction items`);

  console.log("🌱 Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

