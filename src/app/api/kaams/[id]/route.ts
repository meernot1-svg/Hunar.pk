import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

    const { data: kaam, error: kErr } = await supabase
      .from("Kaam")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (kErr) {
      throw new Error(kErr.message);
    }
    if (!kaam) {
      return NextResponse.json({ error: "Kaam not found." }, { status: 404 });
    }

    // Fetch the worker row to get userId (for owner check)
    const { data: worker, error: wErr } = await supabase
      .from("Worker")
      .select("id, userId")
      .eq("id", kaam.workerId)
      .maybeSingle();
    if (wErr) {
      throw new Error(wErr.message);
    }

    // Allow: admin OR the worker who owns this kaam
    const isOwner = worker ? session.uid === worker.userId : false;
    const isAdmin = session.role === "admin";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "You can only delete your own kaam." }, { status: 403 });
    }

    const { error: delErr } = await supabase.from("Kaam").delete().eq("id", id);
    if (delErr) {
      throw new Error(delErr.message);
    }

    // Decrement worker totalKaam (read-then-write; guard against going negative)
    if (kaam.workerId) {
      try {
        const { data: w, error: fErr } = await supabase
          .from("Worker")
          .select("totalKaam")
          .eq("id", kaam.workerId)
          .maybeSingle();
        if (!fErr && w) {
          const newTotal = Math.max(0, (w.totalKaam ?? 0) - 1);
          await supabase.from("Worker").update({ totalKaam: newTotal }).eq("id", kaam.workerId);
        }
      } catch {
        /* worker may have been deleted already */
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[kaams DELETE] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Failed to delete kaam.", detail: msg }, { status: 500 });
  }
}
