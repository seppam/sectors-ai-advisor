import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { endpoint, params } = await req.json();

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    const SECTORS_API_KEY = process.env.SECTORS_API_KEY || "";
    const userKey = req.headers.get("x-sectors-api-key");
    const apiKey = userKey || SECTORS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "No Sectors API key configured" }, { status: 401 });
    }

    if (typeof endpoint !== "string" || !endpoint.startsWith("/") || endpoint.includes("..")) {
      return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 });
    }

    // Build URL
    const baseUrl = "https://api.sectors.app/v2";
    const url = new URL(`${baseUrl}${endpoint}`);
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(30000),
    });

    const text = await response.text();
    // Pass the upstream body through untouched (error bodies included) so the client can read the real message.
    return new NextResponse(text, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
