import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { saveUploadedImage, saveUploadedImageList, isAllowedImage, isUnderSizeLimit } from "@/lib/upload";

/* POST /api/upload
 * Multipart form-data:
 *   - single file under field "file"     → returns { url }
 *   - multiple files under field "files"  → returns { urls: string[] }
 * Requires: logged-in user.
 */
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Please log in to upload images." }, { status: 401 });
    }

    const form = await req.formData();

    // Multiple files (samples)
    const files = form.getAll("files").filter((f): f is File => f instanceof File);
    if (files.length > 0) {
      if (files.length > 5) {
        return NextResponse.json({ error: "You can upload up to 5 files at once." }, { status: 400 });
      }
      for (const f of files) {
        if (!isAllowedImage(f)) return NextResponse.json({ error: "Only PNG, JPG, WEBP, or GIF images are allowed." }, { status: 400 });
        if (!isUnderSizeLimit(f)) return NextResponse.json({ error: `Image "${f.name}" too large (max 2MB).` }, { status: 400 });
      }
      const urls = await saveUploadedImageList(files);
      return NextResponse.json({ urls });
    }

    // Single file (thumbnail)
    const single = form.get("file");
    if (single instanceof File) {
      if (!isAllowedImage(single)) return NextResponse.json({ error: "Only PNG, JPG, WEBP, or GIF images are allowed." }, { status: 400 });
      if (!isUnderSizeLimit(single)) return NextResponse.json({ error: "Image too large (max 2MB)." }, { status: 400 });
      const url = await saveUploadedImage(single);
      return NextResponse.json({ url });
    }

    return NextResponse.json({ error: "No file provided. Use field 'file' or 'files'." }, { status: 400 });
  } catch (e) {
    console.error("[upload] error:", e);
    const msg = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
