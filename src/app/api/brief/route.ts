import { NextRequest, NextResponse } from "next/server";
import { fetchDailyBriefData } from "@/lib/sectorsApi";
import { killSwitch, rateLimit, bodyTooLarge } from "@/lib/apiGuard";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const blocked = killSwitch() ?? bodyTooLarge(req, 8_000) ?? rateLimit(req, "brief", 10);
  if (blocked) return blocked;
  try {
    const { sectors } = await req.json();

    const SECTORS_API_KEY = process.env.SECTORS_API_KEY || "";
    const userKey = req.headers.get("x-sectors-api-key");

    const result = await fetchDailyBriefData(userKey || SECTORS_API_KEY, sectors);

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
