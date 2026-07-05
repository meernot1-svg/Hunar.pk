# 🚀 Hunar.pk — Deployment Guide (Free: Vercel + Supabase)

**Total cost: $0/month** • **Time: ~10 minutes** • **No credit card required**

Hunar.pk is a Next.js 16 app that needs:
1. **A database** → Supabase (free PostgreSQL)
2. **Hosting** → Vercel (free Next.js hosting)
3. **Code storage** → GitHub (free, you may already have this)

---

## What you need (3 free accounts)

| Service | Purpose | Sign up at |
|---------|---------|------------|
| **GitHub** | Store your code | github.com |
| **Supabase** | PostgreSQL database | supabase.com |
| **Vercel** | Host the website | vercel.com (sign in with GitHub) |

All three have free tiers that cover Hunar.pk for the first few thousand users.

---

## Step-by-step deployment

### Step 1 — Get your code onto GitHub

Download the project as a ZIP from this sandbox, then:
1. Create a new repository on GitHub (e.g. `hunar-pk`)
2. Unzip the project locally
3. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Hunar.pk — Pakistan's biggest local freelancing network"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/hunar-pk.git
   git push -u origin main
   ```

### Step 2 — Create the Supabase database (2 min)

1. Go to **supabase.com** → Sign in with GitHub
2. Click **"New project"**
3. Name it: `hunar-pk`
4. Set a strong database password (save it somewhere safe!)
5. Choose region: closest to Pakistan (e.g. **Singapore** or **Mumbai**)
6. Click **Create** — wait ~2 min for provisioning

Once ready:
1. Go to **Project Settings** (gear icon, bottom left)
2. Click **Database**
3. Scroll to **Connection string** → select **URI**
4. Copy the connection string. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with the password you set in step 4

**Keep this string — you'll paste it into Vercel next.**

### Step 3 — Switch the database provider (one line)

In your code, open `prisma/schema.prisma` and change line 8:

```prisma
// FROM:
datasource db {
  provider = "sqlite"        // ← local dev
  url      = env("DATABASE_URL")
}

// TO:
datasource db {
  provider = "postgresql"    // ← production
  url      = env("DATABASE_URL")
}
```

Commit and push:
```bash
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push
```

### Step 4 — Deploy to Vercel (3 min)

1. Go to **vercel.com** → **Sign in with GitHub**
2. Click **"Add New"** → **"Project"**
3. Import your `hunar-pk` repository
4. Vercel auto-detects Next.js — **don't change any build settings**
5. Expand **"Environment Variables"** and add these three:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | _(paste your Supabase connection string from Step 2)_ |
   | `AUTH_SECRET` | _(any random 32+ character string — e.g. run `openssl rand -hex 32` in terminal, or mash your keyboard)_ |
   | `ADMIN_PASSWORD` | `BA56CR7VK18` |

6. Click **Deploy** — wait ~2 min for the first build

### Step 5 — Create the database tables (1 min)

After the first deploy, you need to create the tables in Supabase. Easiest way:

1. Open your Vercel project dashboard
2. Go to **Settings** → **Functions** or use the **Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel login
   vercel link          # link to your hunar-pk project
   vercel env pull .env.production.local   # pulls your env vars locally
   npx prisma db push   # creates all tables in Supabase
   ```
3. Seed the initial workers/kaams:
   ```bash
   bun run db:seed      # or: npx tsx scripts/seed.ts
   ```

**Alternative (no CLI):** Go to Supabase → SQL Editor → paste the contents of `prisma/migrations/` (or run `prisma db push` locally with the Supabase URL in your `.env`).

### Step 6 — Open your live site 🎉

Vercel gives you a URL like:
```
https://hunar-pk.vercel.app
```

That's your live, multi-user freelancing marketplace. Anyone in the world can:
- ✅ Register as a worker or viewer
- ✅ Post kaam with thumbnail uploads
- ✅ Browse and filter kaams
- ✅ Contact workers via WhatsApp
- ✅ Admin can delete users/posts (cascade)

### Step 7 (optional) — Custom domain `hunar.pk`

1. Buy `hunar.pk` from a PKNIC registrar (~$15-25/year): hosterpk.com, nazuka.net
2. In Vercel: **Settings** → **Domains** → Add `hunar.pk`
3. Vercel gives you DNS records → add them at your domain registrar
4. Wait 5-30 min for DNS propagation → live on your custom domain

---

## 🆘 Troubleshooting

**"Build failed: Prisma can't reach database"**
→ Your `DATABASE_URL` env var isn't set correctly in Vercel. Re-check Step 4.

**"Admin panel says wrong password"**
→ You forgot to set `ADMIN_PASSWORD` env var, or it's different from `BA56CR7VK18`.

**"I deployed but the page is blank"**
→ Check Vercel → your project → **Logs**. Most common cause: tables not created yet (do Step 5).

**"Uploads don't work"**
→ Shouldn't happen — uploads are stored as base64 in the DB now. But if images >1.5MB are rejected, that's the size limit (compress them first).

**"How do I see my database data?"**
→ Supabase dashboard → **Table Editor** → see all users, workers, kaams.

---

## 📊 What you get for free

| Resource | Free tier limit | Hunar.pk usage |
|----------|----------------|----------------|
| Vercel | 100GB bandwidth/mo | Plenty for thousands of users |
| Supabase DB | 500MB storage | ~50,000 kaams with thumbnails |
| Supabase auth | 50,000 monthly users | Lots of room to grow |

When you outgrow free (congrats! 🎉), paid tiers start around $25/mo each.

---

**That's it.** Once you've done Steps 1-6, paste your Vercel URL here and I'll help you verify everything's working live. 🚀
