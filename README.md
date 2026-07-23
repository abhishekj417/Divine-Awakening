# Divine Awakening Leadership Portal

A Next.js + Supabase web application for quarterly leadership development tracking,
non-negotiables logging, milestone tracking, facilitation observation, participant impact,
business/retreat ownership, remediation plans, and Head Coach selection.

## Stack
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (Postgres + Auth + Row Level Security)
- Deploy target: Vercel

---

## Step 1 — Push this code to GitHub

From this folder, run:

```
git init
git add .
git commit -m "Initial commit: Divine Awakening Leadership Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace YOUR_USERNAME/YOUR_REPO_NAME with your actual GitHub repo. Create the empty repo
first on github.com (no README/gitignore needed, this project already has them).

---

## Step 2 — Set up Supabase

1. Go to https://supabase.com and create a new project (free tier is fine).
2. In the Supabase dashboard, go to SQL Editor > New Query.
3. Copy the entire contents of `supabase/schema.sql` and run it. This creates all tables,
   seeds the 10-participant roster, and sets up Row Level Security policies.
4. Go to Authentication > Users > Add User to create your first accounts, e.g.:
   - admin@yourdomain.com (this will be your admin/coach login)
   - one login per participant if you want individual participant access
5. Go to Table Editor > profiles and add a row for each user you created:
   - id: paste the UUID from the Authentication > Users list
   - full_name: their name
   - role: 'admin', 'coach', or 'participant'
   - participant_name: must exactly match a name in the roster table (e.g. 'Rhea') if role is participant
6. Go to Project Settings > API and copy:
   - Project URL
   - anon public key
   You will need both for Vercel in Step 3.

---

## Step 3 — Deploy to Vercel

1. Go to https://vercel.com and log in with your GitHub account.
2. Click "Add New Project" and import the GitHub repo you pushed in Step 1.
3. In the "Environment Variables" section during setup, add:
   - NEXT_PUBLIC_SUPABASE_URL = (your Supabase Project URL from Step 2.6)
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = (your Supabase anon public key from Step 2.6)
4. Click Deploy. Vercel will build and give you a live URL like
   https://divine-awakening-portal.vercel.app
5. Share that URL with your community. Each person logs in with the email/password
   you created for them in Supabase Authentication.

---

## Local development (optional)

```
npm install
cp .env.local.example .env.local
# edit .env.local with your Supabase URL and anon key
npm run dev
```

Visit http://localhost:3000

---

## Notes on roles and access

- `admin` and `coach` roles can see and edit everything, including the confidential
  Head Coach Assessment Panel.
- `participant` role only sees their own records across all tabs (enforced by
  Supabase Row Level Security policies, not just the UI).
- The Head Coach Panel tab is hidden from participants in the sidebar navigation
  in addition to being blocked at the database level.

## Next steps you may want
- Custom domain in Vercel (Project Settings > Domains)
- Email invite flow instead of manually creating Supabase Auth users
- CSV export of assessment records
- Automated quarterly reminder emails (would require a scheduled function, e.g. Supabase Edge Functions + cron)
