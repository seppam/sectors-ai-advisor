import { test, expect } from "@playwright/test";

/** API abuse-guard tests. No upstream calls are made (all rejected before fetch). */
test.describe("API guards", () => {
  test("/api/sectors rejects invalid endpoint", async ({ request }) => {
    const r = await request.post("/api/sectors", {
      headers: { "x-sectors-api-key": "dummy" },
      data: { endpoint: "../evil", params: {} },
    });
    expect(r.status()).toBe(400);
  });

  test("/api/sectors rejects oversized body", async ({ request }) => {
    const r = await request.post("/api/sectors", {
      headers: { "x-sectors-api-key": "dummy" },
      data: { endpoint: "/x", params: { q: "a".repeat(20000) } },
    });
    expect(r.status()).toBe(413);
  });

  test("/api/chat rejects over-long message before any upstream call", async ({ request }) => {
    const r = await request.post("/api/chat", {
      headers: { "x-llm-api-key": "dummy" },
      data: { provider: "openai", messages: [{ role: "user", content: "a".repeat(5000) }] },
    });
    expect(r.status()).toBe(413);
  });

  test("security headers are set", async ({ request }) => {
    const r = await request.get("/landing");
    expect(r.headers()["x-content-type-options"]).toBe("nosniff");
    expect(r.headers()["x-frame-options"]).toBe("DENY");
  });
});
