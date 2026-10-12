import { NextRequest, NextResponse } from "next/server";
import { callLLM } from "@/lib/llmProviders";
import { killSwitch, rateLimit, bodyTooLarge } from "@/lib/apiGuard";

// Read keys from environment — never exposed to client
const PROVIDER_KEYS: Record<string, string | undefined> = {
  anthropic: process.env.ANTHROPIC_API_KEY,
  openai: process.env.OPENAI_API_KEY,
  deepseek: process.env.DEEPSEEK_API_KEY,
  openrouter: process.env.OPENROUTER_API_KEY,
  custom: process.env.OPENROUTER_API_KEY, // custom shares the same env key pool
};

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const blocked = killSwitch() ?? bodyTooLarge(req) ?? rateLimit(req, "chat", 10);
  if (blocked) return blocked;
  try {
    const { provider, modelName, customModel, messages, customBaseUrl } =
      await req.json();

    if (!provider || !messages?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use server-side env key if available; fall back to user's BYOK key from header
    const serverKey = PROVIDER_KEYS[provider] ?? process.env.OPENROUTER_API_KEY;
    const userKey = req.headers.get("x-llm-api-key");
    const apiKey = serverKey || userKey || "";

    // Never send a server-side key to a caller-chosen host (key exfiltration).
    if (serverKey && customBaseUrl) {
      return NextResponse.json(
        { error: "customBaseUrl is not allowed when a server-side key is used." },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key configured. Set the key in Settings, or configure server-side keys in .env.local." },
        { status: 401 }
      );
    }

    // Reconstruct ChatContext from the messages array (last message = user query)
    const lastUserMsg = [...messages].reverse().find((m: { role?: string }) => m.role === "user");
    const userMessage = typeof lastUserMsg?.content === "string" ? lastUserMsg.content : "";
    if (userMessage.length > 4000) {
      return NextResponse.json({ error: "Message too long (max 4000 characters)." }, { status: 413 });
    }

    const result = await callLLM({
      provider,
      apiKey,
      ctx: {
        userMessage,
        language: "id",
      },
      customBaseUrl,
      customModel,
      modelName,
    });

    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
