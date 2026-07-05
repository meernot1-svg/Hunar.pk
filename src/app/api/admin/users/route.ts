import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";
import { toUserDTO } from "@/lib/types";

/* GET /api/admin/users — admin only.
 * Returns: { users: UserAccountDTO[] }
 */
export async function GET() {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    const rows = await db.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    const users = rows.map((u) => ({
      ...toUserDTO(u),
      level: u.role === "worker" ? "New" : null, // workers may override below
    }));

    // Enrich: pull actual worker level where applicable
    const workers = await db.worker.findMany({ select: { userId: true, level: true } });
    const levelByUserId = new Map(workers.map((w) => [w.userId, w.level]));
    const enriched = users.map((u) => ({
      ...u,
      level: levelByUserId.get(u.id) ?? u.level ?? null,
    }));

    return NextResponse.json({ users: enriched });
  } catch (e) {
    console.error("[admin users GET] error:", e);
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
}
