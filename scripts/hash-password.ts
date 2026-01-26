/**
 * Utility script to hash admin password
 * Usage: npx tsx scripts/hash-password.ts "your-password"
 */

import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npx tsx scripts/hash-password.ts <password>");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  console.log("\n✅ Password hash generated:");
  console.log(hash);
  console.log("\nAdd this to your .env.local as:");
  console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
});
