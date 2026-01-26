/**
 * Database initialization script
 * Creates all 12 tables with 10 seats each (120 total seats)
 * Run with: npx tsx scripts/init-seats.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Initializing seating chart...");

  const seats = [];

  // Create 12 tables with 10 seats each
  for (let table = 1; table <= 12; table++) {
    for (let seat = 1; seat <= 10; seat++) {
      seats.push({
        tableNumber: table,
        seatNumber: seat,
      });
    }
  }

  // Use createMany with skipDuplicates to avoid errors on re-run
  for (const seat of seats) {
    try {
      await prisma.seat.upsert({
        where: {
          tableNumber_seatNumber: {
            tableNumber: seat.tableNumber,
            seatNumber: seat.seatNumber,
          },
        },
        update: {},
        create: seat,
      });
    } catch (error) {
      // Seat already exists, skip
    }
  }

  console.log(`✅ Created ${seats.length} seats across 12 tables`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
