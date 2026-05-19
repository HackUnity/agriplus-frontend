import { NextResponse } from "next/server";
import { apiBaseUrl } from "@/lib/env";

/** Proxies backend health so the browser never needs a cross-origin call. */
export async function GET() {
  try {
    const res = await fetch(`${apiBaseUrl}/api/health`, {
      cache: "no-store",
    });
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        detail: `Cannot reach the API at ${apiBaseUrl}. Check NEXT_PUBLIC_API_URL.`,
      },
      { status: 503 },
    );
  }
}
