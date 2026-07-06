import { createClient } from "@supabase/supabase-js";

/* ============================================================
   Hunar.pk — Supabase server-side client (REST API / PostgREST)
   ------------------------------------------------------------
   We use the Supabase REST API instead of direct Postgres because
   Supabase free-tier projects are IPv6-only (direct connection)
   which Vercel serverless can't reach. The REST API works over
   HTTPS from anywhere.
   ============================================================ */

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    "[supabase] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars"
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/* ---------- Type definitions (mirrors Prisma schema) ---------- */
export interface UserRow {
  id: string;
  name: string;
  phone: string;
  password: string;
  role: string;
  city: string;
  joined: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkerRow {
  id: string;
  userId: string;
  name: string;
  city: string;
  level: string;
  rating: number;
  totalKaam: number;
  repeatClients: number;
  phone: string;
  bio: string;
  gradient: string;
  initials: string;
  portfolio: string;
  createdAt: string;
  updatedAt: string;
}

export interface KaamRow {
  id: string;
  title: string;
  description: string;
  price: number;
  deliveryDays: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  thumbnail: string | null;
  samples: string | null;
  workerId: string;
  createdAt: string;
  updatedAt: string;
}
