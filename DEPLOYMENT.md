# Deployment Guide - Gala 2026 Website

## Prerequisites

- Node.js 18+ installed
- Neon PostgreSQL database (or any PostgreSQL database)
- Vercel account (recommended) or your preferred hosting platform
- Google Cloud account (for Google Sheets integration - optional)

## Step 1: Database Setup

### Using Neon (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string (it will look like: `postgresql://user:password@host/database?sslmode=require`)
4. Add it to your `.env` file as `DATABASE_URL`

### Initialize Database Schema

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma db push

# Initialize seats (creates 12 tables × 10 seats = 120 seats)
npx tsx scripts/init-seats.ts
```

## Step 2: Environment Variables


Create a `.env.local` file in the root directory:

```env
DATABASE_URL="your-neon-connection-string"
GOOGLE_SHEETS_ID="your-sheet-id" # Optional
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}' # Optional
NEXT_PUBLIC_APP_URL="https://your-domain.com"
# For Google Drive image management:
# (see admin portal Images tab)
```

> **Note:** Admin accounts are now created and managed via the admin portal. No need to set admin email or password hash in environment variables.

## Step 3: Google Sheets Setup (Optional)

If you want to sync seating data from Google Sheets:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create a Service Account:
   - Go to "IAM & Admin" > "Service Accounts"
   - Click "Create Service Account"
   - Name it (e.g., "gala-sheets-reader")
   - Grant it "Editor" role (or create custom role)
   - Click "Done"
5. Create a key:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download the JSON file
6. Copy the entire JSON content to `GOOGLE_SERVICE_ACCOUNT_KEY` in `.env.local`
7. Share your Google Sheet with the service account email (found in the JSON file)
8. Your Google Sheet should have columns:
   - name, quote, bio, involvement, image_url, table_number, seat_number

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Go to your project > Settings > Environment Variables
```

### Option B: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. Add all environment variables from `.env.local`
7. Click "Deploy"

### Post-Deployment Steps

1. **Run database migrations on production:**
    ```bash
    npx prisma migrate deploy --schema=./prisma/schema.prisma
    ```

2. **Initialize seats:**
    ```bash
    npx tsx scripts/init-seats.ts
    ```
    (You may need to set `DATABASE_URL` in your local `.env` to point to production DB temporarily)

3. **Upload images:**
    - Preferred: Use the admin portal Images tab to manage images (Google Drive integration, label, alt, type, fallback support)
    - For static assets: Place images in `/public/images/` folder
    - Structure:
       ```
       /public/images/
          /logos/
             favicon.ico
             tfnlogo.png
          auctionitemplaceholder.jpg
          placeholderimg.png
          seatplaceholder.png
          userplaceholder.png
       ```

## Step 5: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project > Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## Troubleshooting

### Database Connection Issues

- Ensure your `DATABASE_URL` includes `?sslmode=require` for Neon
- Check that your database allows connections from Vercel's IP ranges
- Verify credentials are correct

### Admin Login Not Working

- Check that `ADMIN_EMAIL` matches exactly
- Verify password hash is correct (use the hash generation command above)
- Check browser cookies are enabled

### Google Sheets Sync Failing

- Verify service account JSON is correctly formatted (single-line JSON string)
- Ensure sheet is shared with service account email
- Check column names match expected format
- Verify `GOOGLE_SHEETS_ID` is correct (found in sheet URL)

### Images Not Loading

- If using Google Drive images, ensure they are managed via the admin portal and have correct label/fileId
- For static images, ensure they are in `/public/images/` folder
- Check image paths match exactly (case-sensitive)
- Verify images are committed to git or uploaded to hosting platform

## Production Checklist

- [ ] Change default admin password
- [ ] Set secure `ADMIN_PASSWORD_HASH`
- [ ] Configure proper CORS if needed
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure analytics (optional)
- [ ] Test all admin functions
- [ ] Test seating chart on mobile devices
- [ ] Test auction page real-time updates
- [ ] Upload all required images (via admin portal or `/public/images/`)
- [ ] Update RSVP form link in homepage
- [ ] Update event date in homepage
- [ ] Test Google Sheets sync (if using)

## Support

For issues or questions, check:
- Next.js docs: https://nextjs.org/docs
- Prisma docs: https://www.prisma.io/docs
- Vercel docs: https://vercel.com/docs

For API and feature reference, see `PROJECT_SUMMARY.md` and `README.tech.md`.
