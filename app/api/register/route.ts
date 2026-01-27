import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import path from 'path';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, table, seat, testimonial } = body;

  // Use credentials from GOOGLE_APPLICATION_CREDENTIALS
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS || ''),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  const sheets = google.sheets('v4');
  // @ts-ignore
  sheets.context._options.auth = authClient;
  const spreadsheetId = '1BuIbCxt5PZyI6vsd_18-b6PhdlWIXNzG6U8Scd7C2QE';

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Sheet1!A:E', // Adjust if your sheet/tab name is different
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[name, email, table, seat, testimonial]],
    },
  });

  return NextResponse.json({ success: true });
}
