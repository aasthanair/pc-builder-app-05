
# PC Builder App

A full‑stack PC builder web app built with **Next.js (App Router)**, **Supabase**, and **Tailwind**.  
Users can sign up, log in, browse components (CPU, GPU, RAM, Storage, Motherboard), build a custom PC, and place orders.

---

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, SWR
- **Backend**: Next.js API routes, Supabase (Postgres + Auth + RLS)
- **Styling/UI**: Tailwind CSS 4, Radix UI, shadcn‑style components
- **Auth**: Supabase email/password

---

## Getting Started (Local)

### 1. Clone & install

```bash
git clone https://github.com/aasthanair/v0-pc-builder-app-05.git
cd v0-pc-builder-app-05

pnpm install
# or: npm install
```

### 2. Supabase setup

1. Create a **new project** in Supabase.
2. In your Supabase dashboard, go to **Settings → API** and copy:
   - `Project URL`
   - `anon` public key
3. In the SQL editor, run these scripts **in order**:

   - `scripts/001_create_tables.sql`
   - `scripts/002_profile_trigger.sql`
   - `scripts/003_seed_components.sql`

   This will:
   - Create `profiles`, `components`, `pc_builds`, and `pc_build_items` tables
   - Configure RLS policies
   - Seed initial component data

### 3. Environment variables

Create a `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/builder
```

> For **local dev**, these values are also “hard‑fixed” in code via `lib/env.ts`, but you should still set real values so auth + DB work against your Supabase project.

---

## Running the App

### Development

```bash
pnpm dev
# or: npm run dev
```

By default Next.js will start on `http://localhost:3000` (it may fall back to `3001+` if ports are taken; check the terminal output).

### Build & production

```bash
pnpm build
pnpm start
```

---

## Project Structure

- `app/`
  - `page.tsx` – landing page
  - `builder/page.tsx` – main PC builder UI
  - `cart/page.tsx` – cart/review (if implemented)
  - `orders/page.tsx` – order history
  - `auth/login/page.tsx` – login
  - `auth/sign-up/page.tsx` – sign up
  - `api/components/route.ts` – list components from Supabase
  - `api/builds/route.ts` – manage builds & build items
- `components/`
  - `component-card.tsx`, `build-summary.tsx`, `navbar.tsx`, `ui/*` – reusable UI
- `lib/`
  - `supabase/client.ts` – browser Supabase client
  - `supabase/server.ts` – server Supabase client
  - `supabase/middleware.ts` – auth middleware (protects `/builder`, `/cart`, `/orders`)
  - `env.ts` – public env validation + default values
  - `types.ts` – TypeScript models (components, builds, etc.)
- `scripts/`
  - `001_create_tables.sql`
  - `002_profile_trigger.sql`
  - `003_seed_components.sql`

---

## Usage Flow

1. **Sign up** on `/auth/sign-up` and confirm your email (depending on Supabase settings).
2. **Log in** on `/auth/login` – you’ll be redirected to `/builder`.
3. On `/builder`:
   - Choose a category tab (CPU, GPU, etc.).
   - Click **“Add to build”** for a component.
   - Only one component per category is kept; adding a new one replaces the old.
4. Use the **summary sidebar** to:
   - Review selected components and total price
   - Remove items
   - Place an order (status changes from `draft` → `ordered`).

---

## Deployment

- Designed to run on **Vercel** with:
  - Build command: `pnpm build`
  - Install command: `pnpm install`
  - Output: Next.js App Router default
- Configure the same Supabase env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`) in your Vercel project.

---

## Notes / Troubleshooting

- If you see **“Your project's URL and Key are required to create a Supabase client!”**:
  - Confirm `.env.local` is set and dev server was restarted.
- If `/api/builds` returns 500 about missing `public.pc_builds`:
  - Re‑run `scripts/001_create_tables.sql` in Supabase.
- Ports:
  - If `3000` is busy, Next will auto‑pick `3001+`; use the port printed in the dev terminal.

---

## License

This project follows the license of the original upstream repo (`https://github.com/aasthanair/v0-pc-builder-app-05`). Check that repository for licensing details.
