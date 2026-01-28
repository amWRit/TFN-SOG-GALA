import { google } from "googleapis";
import { prisma } from "@/lib/prisma";
import fs from "fs";

// Helper to get Google Sheets client
function getSheetsClient() {
  let credentials;
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    // Remove possible single quotes from env var (Vercel UI sometimes adds them)
    let key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (key.startsWith("'") && key.endsWith("'")) {
      key = key.slice(1, -1);
    }
    credentials = JSON.parse(key);
    console.log("Using GOOGLE_SERVICE_ACCOUNT_KEY from env");
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    credentials = JSON.parse(fs.readFileSync(credPath, "utf8"));
    console.log("Using GOOGLE_APPLICATION_CREDENTIALS from file:", credPath);
  } else {
    throw new Error("Google Sheets credentials missing");
  }
  console.log("Loaded credentials fields:", Object.keys(credentials));
  if (!credentials.client_email) {
    throw new Error("Loaded Google credentials do not contain client_email field");
  }
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

// Overwrite all rows in a sheet (except header)
async function overwriteSheet(sheetId: string, range: string, values: any[][]) {
  const sheets = getSheetsClient();
  // Clear all data except header
  await sheets.spreadsheets.values.clear({
    spreadsheetId: sheetId,
    range,
  });
  // Write new data
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values },
  });
}

// Export all registrations to Google Sheet
export async function exportRegistrationsToSheet() {
  const sheetId = process.env.REGISTRATION_GOOGLE_SHEETS_ID;
  if (!sheetId) throw new Error("REGISTRATION_GOOGLE_SHEETS_ID missing");
  const registrations = await prisma.registration.findMany();
  const header = [
    "id", "name", "email", "phone", "payment", "paymentStatus", "tablePreference", "seatPreference", "quote", "bio", "involvement", "imageUrl"
  ];
  const values = [header, ...registrations.map(r => [
    r.id, r.name, r.email, r.phone, r.payment, r.paymentStatus ? "Paid" : "Unpaid", r.tablePreference, r.seatPreference, r.quote, r.bio, r.involvement, r.imageUrl
  ])];
  await overwriteSheet(sheetId, "Sheet1", values);
  return values.length - 1;
}

// Export all seats to Google Sheet
export async function exportSeatsToSheet() {
  const sheetId = process.env.SEATING_GOOGLE_SHEETS_ID;
  if (!sheetId) throw new Error("SEATING_GOOGLE_SHEETS_ID missing");
  const seats = await prisma.seat.findMany({ include: { registration: true } });
  const header = [
    "seatId", "tableNumber", "seatNumber", "registrationId", "name", "email", "phone", "payment", "paymentStatus", "tablePreference", "seatPreference", "involvement", "bio", "quote", "imageUrl"
  ];
  const values = [header, ...seats.map(seat => [
    seat.id,
    seat.tableNumber,
    seat.seatNumber,
    seat.registrationId || "",
    seat.registration?.name || "",
    seat.registration?.email || "",
    seat.registration?.phone || "",
    seat.registration?.payment ?? "",
    seat.registration ? (seat.registration.paymentStatus ? "Paid" : "Unpaid") : "",
    seat.registration?.tablePreference ?? "",
    seat.registration?.seatPreference ?? "",
    seat.registration?.involvement || "",
    seat.registration?.bio || "",
    seat.registration?.quote || "",
    seat.registration?.imageUrl || ""
  ])];
  await overwriteSheet(sheetId, "Sheet1", values);
  return values.length - 1;
}

/**
 * Google Sheets integration for syncing seating data
 * Requires: GOOGLE_SHEETS_ID and GOOGLE_SERVICE_ACCOUNT_KEY in .env
 */
export async function syncGoogleSheets(): Promise<number> {
  const sheetsId = process.env.GOOGLE_SHEETS_ID;
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!sheetsId || !serviceAccountKey) {
    throw new Error("Google Sheets configuration missing");
  }

  try {
    // Parse service account credentials
    const credentials = JSON.parse(serviceAccountKey);

    // Authenticate
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Read data from sheet (assuming data starts at row 2, row 1 is headers)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetsId,
      range: "Sheet1!A2:H", // Adjust range based on your sheet structure
    });

    const rows = response.data.values || [];
    let count = 0;


    // Process each row
    for (const row of rows) {
      const [
        name,
        quote,
        bio,
        involvement,
        imageUrl,
        tableNumber,
        seatNumber,
      ] = row;

      if (!tableNumber || !seatNumber || !name) continue;

      try {
        // Upsert registration (using name and tableNumber-seatNumber as a pseudo-unique key if email/id not available)
        // Ideally, use a real unique field like 'email' or 'id' from your sheet
        const uniqueKey = `${name}-${tableNumber}-${seatNumber}`;
        const registration = await prisma.registration.upsert({
          where: { id: uniqueKey },
          update: {
            quote: quote || null,
            bio: bio || null,
            involvement: involvement || null,
            imageUrl: imageUrl || null,
          },
          create: {
            id: uniqueKey,
            name,
            quote: quote || null,
            bio: bio || null,
            involvement: involvement || null,
            imageUrl: imageUrl || null,
            email: "",
            payment: 0,
            paymentStatus: false,
          },
        });

        // Upsert seat and assign registrationId
        await prisma.seat.upsert({
          where: {
            tableNumber_seatNumber: {
              tableNumber: parseInt(tableNumber),
              seatNumber: parseInt(seatNumber),
            },
          },
          update: {
            registrationId: registration.id,
          },
          create: {
            tableNumber: parseInt(tableNumber),
            seatNumber: parseInt(seatNumber),
            registrationId: registration.id,
          },
        });
        count++;
      } catch (error) {
        console.error(`Error syncing seat T${tableNumber}-${seatNumber}:`, error);
      }
    }

    return count;
  } catch (error) {
    console.error("Google Sheets sync error:", error);
    throw error;
  }
}
