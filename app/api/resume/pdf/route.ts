import { NextResponse } from "next/server";
import { resumePublicPdfUrl } from "@/lib/resume-public";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FILENAME = "Anthony-Silvia-Resume.pdf";

/**
 * Same-origin PDF proxy for the NodeDa Resume public PDF.
 *
 * Upstream always sends `Content-Disposition: attachment`, which makes
 * browsers download when `/resume` embeds or opens that URL. This route
 * re-serves the bytes as `inline` by default so navigation to Resume never
 * triggers a download. Pass `?download=1` for an explicit save.
 */
export async function GET(req: Request) {
  const wantDownload = new URL(req.url).searchParams.get("download") === "1";
  const upstream = resumePublicPdfUrl();

  try {
    const res = await fetch(upstream, {
      headers: { Accept: "application/pdf" },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/resume.pdf", req.url), 302);
    }

    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": wantDownload
          ? `attachment; filename="${FILENAME}"`
          : `inline; filename="${FILENAME}"`,
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        "Content-Length": String(buf.byteLength),
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/resume.pdf", req.url), 302);
  }
}
