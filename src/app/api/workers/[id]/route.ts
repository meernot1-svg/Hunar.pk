import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { authorizeAdmin } from "@/lib/auth";
import { toWorkerDTO, toKaamDTO } from "@/lib/types";

/* GET /api/workers/[id]
 * Returns: { worker: WorkerDTO, kaams: KaamDTO[] }
 */
export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const { data: worker, error: wErr } = await supabase
      .from("Worker")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (wErr) {
      throw new Error(wErr.message);
    }
    if (!worker) {
      return NextResponse.json({ error: "Worker not found." }, { status: 404 });
    }

    const { data: kaamRows, error: kErr } = await supabase
      .from("Kaam")
      .select("*")
      .eq("workerId", id)
      .order("createdAt", { ascending: false });
    if (kErr) {
      throw new Error(kErr.message);
    }

    return NextResponse.json({
      worker: toWorkerDTO(worker),
      kaams: (kaamRows ?? []).map(toKaamDTO),
    });
  } catch (e) {
    console.error("[worker GET] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Failed to load worker.", detail: msg }, { status: 500 });
  }
}

/* DELETE /api/workers/[id] — admin only.
 * Cascades: deletes the worker's user account, all their kaams.
 * (Supabase REST API relies on FK ON DELETE CASCADE at the DB level.
 *  If for any reason the cascade does not fire, we manually delete
 *  Kaams → Worker → User in that order.)
 */
export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json({ error: "Admin access required." }, { status: 403 });
    }
    const { id } = await ctx.params;

    const { data: worker, error: wErr } = await supabase
      .from("Worker")
      .select("id, userId")
      .eq("id", id)
      .maybeSingle();
    if (wErr) {
      throw new Error(wErr.message);
    }
    if (!worker) {
      return NextResponse.json({ error: "Worker not found." }, { status: 404 });
    }

    // Deleting the User should cascade to Worker + Kaam (FK onDelete: Cascade).
    // Try the cascade path first; if the worker still exists afterwards,
    // fall back to manual deletion in order.
    const { error: uDelErr } = await supabase
      .from("User")
      .delete()
      .eq("id", worker.userId);
    if (uDelErr) {
      throw new Error(uDelErr.message);
    }

    // Verify the worker is gone; if not, clean up manually.
    const { data: still } = await supabase
      .from("Worker")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (still) {
      await supabase.from("Kaam").delete().eq("workerId", id);
      await supabase.from("Worker").delete().eq("id", id);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[worker DELETE] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Failed to delete worker.", detail: msg }, { status: 500 });
  }
}
