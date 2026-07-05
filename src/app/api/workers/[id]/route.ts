import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { authorizeAdmin } from "@/lib/auth";
import { toWorkerDTO, toKaamDTO } from "@/lib/types";

/* GET /api/workers/[id]
 * Returns: { worker: WorkerDTO, kaams: KaamDTO[] }
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const worker = await db.worker.findUnique({
      where: { id },
      include: { kaams: { orderBy: { createdAt: "desc" } } },
    });
    if (!worker) {
      return NextResponse.json({ error: "Worker not found." }, { status: 404 });
    }
    return NextResponse.json({
      worker: toWorkerDTO(worker),
      kaams: worker.kaams.map(toKaamDTO),
    });
  } catch (e) {
    console.error("[worker GET] error:", e);
    return NextResponse.json({ error: "Failed to load worker." }, { status: 500 });
  }
}

/* DELETE /api/workers/[id] — admin only.
 * Cascades: deletes the worker's user account, all their kaams.
 */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    const { id } = await ctx.params;

    const worker = await db.worker.findUnique({ where: { id } });
    if (!worker) {
      return NextResponse.json({ error: "Worker not found." }, { status: 404 });
    }

    // Deleting the User cascades to Worker + Kaam (per schema onDelete: Cascade)
    await db.user.delete({ where: { id: worker.userId } });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[worker DELETE] error:", e);
    return NextResponse.json({ error: "Failed to delete worker." }, { status: 500 });
  }
}
