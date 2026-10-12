// Lightweight abuse guards for the server API routes (edge-safe, no deps).
// Rate limiting is best-effort: state is per runtime instance, so it slows abuse
// but is not a hard cap. Use provider-side spend limits as the real backstop.
import { NextRequest, NextResponse } from "next/server";

/** Kill switch: set DEMO_DISABLED=1 in Vercel env and redeploy to turn all API routes off. */
export function killSwitch(): NextResponse | null {
  if (process.env.DEMO_DISABLED === "1" || process.env.DEMO_DISABLED === "true") {
    return NextResponse.json({ error: "Demo temporarily disabled." }, { status: 503 });
  }
  return null;
}

const buckets = new Map<string, { count: number; reset: number }>();

/** Fixed-window limiter keyed by client IP. Returns a 429 response when exceeded. */
export function rateLimit(req: NextRequest, scope: string, limit = 20, windowMs = 60_000): NextResponse | null {
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const key = `${scope}:${ip}`;
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return null;
  }
  b.count += 1;
  if (b.count > limit) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((b.reset - now) / 1000)) } }
    );
  }
  return null;
}

/** Reject request bodies larger than maxBytes (by Content-Length header). */
export function bodyTooLarge(req: NextRequest, maxBytes = 32_000): NextResponse | null {
  const len = Number(req.headers.get("content-length") ?? "0");
  if (len > maxBytes) return NextResponse.json({ error: "Request too large." }, { status: 413 });
  return null;
}
