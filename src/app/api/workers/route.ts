import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { toWorkerDTO } from "@/lib/types";

/* GET /api/workers
 * Returns: { workers: WorkerDTO[] }
 */
export async function GET() {
  try {
    const { data: rows, error } = await supabase
      .from("Worker")
      .select("*")
      .order("totalKaam", { ascending: false })
      .order("rating", { ascending: false });
    if (error) {
      throw new Error(error.message);
    }
    const workers = (rows ?? []).map(toWorkerDTO);
    return NextResponse.json({ workers });
  } catch (e) {
    console.error("[workers GET] error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: "Failed to load workers.", detail: msg }, { status: 500 });
  }
}
