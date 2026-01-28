import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

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
