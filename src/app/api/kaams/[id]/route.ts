import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

/* DELETE /api/kaams/[id]
 * - Worker who owns the kaam can delete it.
 * - Admin can delete any kaam.
 */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please log in." }, { status: 401 });
    }
    const { id } = await ctx.params;

    const kaam = await db.kaam.findUnique({
      where: { id },
      include: { worker: true },
    });
    if (!kaam) {
      return NextResponse.json({ error: "Kaam not found." }, { status: 404 });
    }

    // Allow: admin OR the worker who owns this kaam
    const isOwner = session.uid === kaam.worker.userId;
    const isAdmin = session.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "You can only delete your own kaam." }, { status: 403 });
    }

    await db.kaam.delete({ where: { id } });

    // Decrement worker totalKaam (guard against going negative)
    if (kaam.workerId) {
      try {
        await db.worker.update({
          where: { id: kaam.workerId },
          data: { totalKaam: { decrement: 1 } },
        });
      } catch {
        /* worker may have been deleted already */
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[kaams DELETE] error:", e);
    return NextResponse.json({ error: "Failed to delete kaam." }, { status: 500 });
  }
}
