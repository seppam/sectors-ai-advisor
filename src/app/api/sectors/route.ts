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

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Sectors API error", status: response.status },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
