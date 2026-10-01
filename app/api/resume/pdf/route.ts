import { NextResponse } from "next/server";

/**
 * Public resume PDF is intentionally unavailable.
 * Visitors should use /resume to request a private copy.
 */
export async function GET() {
  return NextResponse.json(
    {
      error: "Resume is not publicly downloadable. Request a copy at /resume.",
    },
    { status: 410 },
  );
}
