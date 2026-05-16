import { NextResponse } from "next/server";

const backendBase =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:5000";

/** Proxies backend health so the browser never needs a cross-origin call. */
export async function GET() {
  try {
    const res = await fetch(`${backendBase}/api/health`, {
      cache: "no-store",
    });
    const body = await res.json().catch(() => ({}));
    return NextResponse.json(body, { status: res.status });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        detail: `Cannot reach the API at ${backendBase}. Start the backend (port 5000).`,
      },
      { status: 503 },
    );
  }
}
