
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding GalaConfig...");
  // Optionally clear existing config (for dev/testing)
  await prisma.galaConfig.deleteMany();
  await prisma.galaConfig.create({
    data: {
      galaYear: 2026,
      targetAmount: 10000,
      preAuctionTotal: 6000, // Example: sum of bank, registrations, donations
    },
  });
  console.log("✅ GalaConfig row created");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
