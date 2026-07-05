import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, setSessionCookie } from "@/lib/auth";
import { toUserDTO } from "@/lib/types";

/* POST /api/auth/login
 * Body: { phone, password }
 * Validates credentials, sets session cookie.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const phone = String(body.phone ?? "").trim();
    const password = String(body.password ?? "");

    if (!phone || !password) {
      return NextResponse.json({ error: "Phone and password are required." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { phone }, include: { worker: true } });
    if (!user) {
      return NextResponse.json({ error: "No account found with this phone. Please register first." }, { status: 404 });
    }
    const ok = await verifyPassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }

    await setSessionCookie({ uid: user.id, role: user.role, name: user.name });

    const dto = toUserDTO(user);
    return NextResponse.json({
      user: { ...dto, level: user.worker?.level ?? null },
      workerId: user.worker?.id ?? null,
    });
  } catch (e) {
    console.error("[login] error:", e);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
