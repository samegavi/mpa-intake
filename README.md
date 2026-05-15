# MP&A Partner Intake

A Next.js form app that saves partner intake responses to PostgreSQL.

## Setup

### 1. Create the database

```bash
createdb mpa_intake
psql mpa_intake < db/schema.sql
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Edit .env.local and set DATABASE_URL
```

### 3. Run

```bash
npm install
npm run dev        # http://localhost:3000
```

## File uploads

Uploaded files are saved to `uploads/` at the project root (outside `public/`).  
The `documents` table records metadata; the stored filename is a UUID-based name to avoid collisions.

## Deploy

Any Node.js host works (Render, Railway, Fly.io, etc.). Make sure:
- `DATABASE_URL` and `DATABASE_SSL` are set in the environment
- The `uploads/` directory is persistent (use a volume or swap for S3)
