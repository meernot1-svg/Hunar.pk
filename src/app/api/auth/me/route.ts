import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toUserDTO } from "@/lib/types";

/* GET /api/auth/me — returns the currently logged-in user (or null). */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ user: null });

    const user = await db.user.findUnique({
      where: { id: session.uid },
      include: { worker: true },
    });
    if (!user) return NextResponse.json({ user: null });

    const dto = toUserDTO(user);
    return NextResponse.json({
      user: { ...dto, level: user.worker?.level ?? null },
      workerId: user.worker?.id ?? null,
    });
  } catch (e) {
    console.error("[me] error:", e);
    return NextResponse.json({ user: null });
  }
}
