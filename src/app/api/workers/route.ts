import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toWorkerDTO } from "@/lib/types";

/* GET /api/workers
 * Returns: { workers: WorkerDTO[] }
 */
export async function GET() {
  try {
    const rows = await db.worker.findMany({
      orderBy: [{ totalKaam: "desc" }, { rating: "desc" }],
    });
    const workers = rows.map(toWorkerDTO);
    return NextResponse.json({ workers });
  } catch (e) {
    console.error("[workers GET] error:", e);
    return NextResponse.json({ error: "Failed to load workers." }, { status: 500 });
  }
}
