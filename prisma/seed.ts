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

  // Clear existing data (respect relations: bids -> auction items -> seats -> registrations)
  await prisma.bid.deleteMany();
  await prisma.auctionItem.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.registration.deleteMany();

  // Shared demo images
  const seatImg =
    "https://cdn-icons-png.flaticon.com/256/1683/1683707.png";
  const auctionImg =
    "https://cdn-icons-png.flaticon.com/512/433/433013.png";

  // --- Registrations: 10 demo people ---
  const registrationCount = 10;
  // Generate 20 unique seat positions
  const allSeatPositions = Array.from({ length: 20 }, (_, i) => {
    const tableNumber = Math.floor(i / 8) + 1;
    const seatNumber = (i % 8) + 1;
    return { tableNumber, seatNumber };
  });
  // Shuffle seat positions for random preferences
  function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }
  const shuffledSeats = shuffle([...allSeatPositions]);

  const registrationsData = Array.from({ length: registrationCount }, (_, i) => {
    // For first 5 assigned, use the first 5 seats for both assignment and preference
    // For last 5, use next 5 seats for preference (but not assigned)
    let tablePreference = null;
    let seatPreference = null;
    if (i < 5) {
      tablePreference = shuffledSeats[i].tableNumber;
      seatPreference = shuffledSeats[i].seatNumber;
    } else {
      tablePreference = shuffledSeats[i + 5].tableNumber;
      seatPreference = shuffledSeats[i + 5].seatNumber;
    }
    return {
      name: `Guest ${i + 1}`,
      email: `guest${i + 1}@example.com`,
      phone: `555-000${i + 1}`,
      payment: i < 5 ? 100 : 0, // First 5 paid
      paymentStatus: i < 5 ? true : false,
      seatAssignedStatus: i < 5 ? true : false,
      quote: `“Education changes everything” — Guest ${i + 1}`,
      bio: `Bio for Guest ${i + 1}. Long-time supporter of education in Nepal.`,
      involvement: i % 2 === 0 ? "Donor" : "Supporter",
      imageUrl: seatImg,
      tablePreference,
      seatPreference,
    };
  });
  const createdRegistrations = await prisma.registration.createMany({ data: registrationsData });
  // Fetch created registrations with IDs
  const registrations = await prisma.registration.findMany();

  // --- Seats: 20 seats, assign first 5 to first 5 registrations ---
  const seatCount = 20;
  const seatData = Array.from({ length: seatCount }, (_, i) => {
    const index = i; // 0-based
    const tableNumber = Math.floor(index / 8) + 1; // 8 seats per table
    const seatNumber = (index % 8) + 1;
    // Assign first 5 seats to first 5 registrations
    let registrationId = null;
    if (index < 5) {
      registrationId = registrations[index]?.id || null;
    }
    return {
      tableNumber,
      seatNumber,
      registrationId,
    };
  });
  await prisma.seat.createMany({ data: seatData, skipDuplicates: true });
  console.log(`✅ Seeded ${seatCount} seats and assigned 5`);

  // Update assigned registrations with table/seat preference
  for (let i = 0; i < 5; i++) {
    await prisma.registration.update({
      where: { id: registrations[i].id },
      data: {
        tablePreference: seatData[i].tableNumber,
        seatPreference: seatData[i].seatNumber,
      },
    });
  }

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

