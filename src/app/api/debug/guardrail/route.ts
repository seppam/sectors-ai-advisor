import { NextRequest, NextResponse } from "next/server";
import { checkGuardrail } from "@/lib/llmProviders";
import type { Language } from "@/lib/types";

// GET /api/debug/guardrail?msg=...&lang=...
export async function GET(req: NextRequest) {
  // P2-2: Block in production — this is a dev/test-only endpoint
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const msg = searchParams.get("msg") ?? "";
  const lang = (searchParams.get("lang") ?? "id") as Language;

  const result = checkGuardrail(msg, lang);
  return NextResponse.json(result);
}
