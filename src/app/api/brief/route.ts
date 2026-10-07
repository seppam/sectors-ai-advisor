import { NextRequest, NextResponse } from "next/server";
import { fetchDailyBriefData } from "@/lib/sectorsApi";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { sectors } = await req.json();

    const SECTORS_API_KEY = process.env.SECTORS_API_KEY || "";
    const userKey = req.headers.get("x-sectors-api-key");

    const result = await fetchDailyBriefData(userKey || SECTORS_API_KEY, sectors);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
