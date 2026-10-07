import { NextRequest, NextResponse } from "next/server";
import { callLLM } from "@/lib/llmProviders";

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
  try {
    const { provider, modelName, customModel, messages, temperature, maxTokens, customBaseUrl } =
      await req.json();

    if (!provider || !messages?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Use server-side env key if available; fall back to user's BYOK key from header
    const serverKey = PROVIDER_KEYS[provider] ?? process.env.OPENROUTER_API_KEY;
    const userKey = req.headers.get("x-llm-api-key");
    const apiKey = serverKey || userKey || "";

    if (!apiKey) {
      return NextResponse.json(
        { error: "No API key configured. Set the key in Settings, or configure server-side keys in .env.local." },
        { status: 401 }
      );
    }

    // Reconstruct ChatContext from the messages array (last message = user query)
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    const userMessage = typeof lastUserMsg?.content === "string" ? lastUserMsg.content : "";

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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
