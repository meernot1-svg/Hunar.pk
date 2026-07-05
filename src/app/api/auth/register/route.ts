import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { toUserDTO, type UserRole } from "@/lib/types";

/* POST /api/auth/register
 * Body: { name, phone, city, password, role }
 * Creates a user (+ worker profile if role=worker), sets session cookie.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const city = String(body.city ?? "Karachi").trim() || "Karachi";
    const password = String(body.password ?? "");
    const role: UserRole = body.role === "worker" ? "worker" : "viewer";

    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
    if (phone.length < 7) return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    if (password.length < 4) return NextResponse.json({ error: "Password must be at least 4 characters." }, { status: 400 });

    const existing = await db.user.findUnique({ where: { phone } });
    if (existing) {
      return NextResponse.json({ error: "An account with this phone already exists. Please login." }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const year = String(new Date().getFullYear());

    const user = await db.user.create({
      data: {
        name,
        phone,
        password: hashed,
        role,
        city,
        joined: year,
        ...(role === "worker"
          ? {
              worker: {
                create: {
                  name,
                  city,
                  level: "New",
                  rating: 0,
                  totalKaam: 0,
                  repeatClients: 0,
                  phone,
                  bio: "New worker on Hunar.pk.",
                  gradient: avatarGradient(name),
                  initials: makeInitials(name),
                  portfolio: JSON.stringify(["g1", "g2", "g3", "g4"]),
                },
              },
            }
          : {}),
      },
      include: { worker: true },
    });

    await setSessionCookie({ uid: user.id, role: user.role, name: user.name });

    const dto = toUserDTO(user);
    return NextResponse.json({
      user: { ...dto, level: user.worker?.level ?? null },
      workerId: user.worker?.id ?? null,
    });
  } catch (e) {
    console.error("[register] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Registration failed. Please try again.", detail: msg }, { status: 500 });
  }
}

/* ---------- helpers (mirrors frontend avatarGradient / makeInitials) ---------- */
function avatarGradient(name: string): string {
  const grads = [
    "from-emerald-500 to-teal-600",
    "from-pink-500 to-rose-600",
    "from-sky-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return grads[h % grads.length];
}
function makeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0)?.toUpperCase() ?? "U";
  const second = parts[1]?.charAt(0)?.toUpperCase() ?? "";
  return first + second;
}
