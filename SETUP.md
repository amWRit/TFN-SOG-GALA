# Quick Setup Guide

## 1. Install Dependencies

```bash
cd tfn-sog-gala
npm install
```

## 2. Set Up Database

### Option A: Using Neon (Recommended)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (looks like: `postgresql://user:pass@host/db?sslmode=require`)

### Option B: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a database: `createdb gala2026`
3. Connection string: `postgresql://localhost:5432/gala2026`

## 3. Configure Environment Variables

Create `.env.local` file:

```env
DATABASE_URL="your-postgresql-connection-string"
ADMIN_EMAIL="gala@teachfornepal.org"
ADMIN_PASSWORD_HASH=""  # Leave empty for default password "admin123"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generate Secure Password Hash

```bash
npx tsx scripts/hash-password.ts "your-secure-password"
```

Copy the output to `ADMIN_PASSWORD_HASH` in `.env.local`.

## 4. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Create all 120 seats (12 tables × 10 seats)
npx tsx scripts/init-seats.ts
```

## 5. Add Images

Create these folders in `/public/images/`:
- `people/` - Guest profile photos
- `auction/` - Auction item images  
- `highlights/` - Event highlight photos

Add placeholder images or your actual photos.

## 6. Add Hero Video (Optional)

Place a video file at `/public/videos/gala-hero.mp4` for the homepage hero background. If missing, a gradient will be shown.

## 7. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 8. Access Admin Portal

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Login with:
   - Email: `gala@teachfornepal.org`
   - Password: `admin123` (or your custom password)

## 9. Google Sheets Setup (Optional)

If you want to sync seating from Google Sheets:

1. Follow the Google Sheets setup in [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Add to `.env.local`:
   ```env
   GOOGLE_SHEETS_ID="your-sheet-id"
   GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
   ```
3. Use "Sheets Sync" tab in admin dashboard

## Troubleshooting

### Database Connection Error
- Verify `DATABASE_URL` is correct
- Check database is running (if local)
- Ensure SSL mode is set for Neon: `?sslmode=require`

### Prisma Errors
- Run `npx prisma generate` again
- Check `DATABASE_URL` is set correctly
- Try `npx prisma db push --force-reset` (⚠️ deletes all data)

### Images Not Loading
- Ensure images are in `/public/images/` folder
- Check file paths match exactly (case-sensitive)
- Verify images are committed to git

### Admin Login Not Working
- Check `ADMIN_EMAIL` matches exactly
- Verify password hash is correct
- Clear browser cookies and try again

## Next Steps

- Add your event content (highlights, auction items)
- Upload guest photos
- Configure RSVP form link in homepage
- Update event date in `app/page.tsx`
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
