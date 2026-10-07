import { test, expect } from "@playwright/test";

/**
 * Guardrail E2E Tests — Two-Layer Strategy
 *
 * Layer 1 (unit): Import and call checkGuardrail() directly via a /debug route
 *                 that the test server injects. This tests the guardrail logic
 *                 itself with zero React/Zustand dependencies.
 *
 * Layer 2 (integration): Verify that a blocked keyword prevents any LLM
 *                       API call from being made. This proves the guardrail
 *                       is wired correctly in the request pipeline.
 *
 * Both layers run together; failures are rare and give clear signal.
 */

/* -----------------------------------------------------------------------
   Debug API route — inject guardrail test helper into the Next.js server
   ----------------------------------------------------------------------- */
test.describe("Guardrail Logic (debug API)", () => {
  test("checkGuardrail() returns triggered=true for trade keywords", async ({ request }) => {
    const res = await request.get("/api/debug/guardrail?msg=beli+saham+BBCA&lang=id");
    const body = await res.json();
    expect(body.triggered).toBe(true);
    expect(body.response).toMatch(/di luar cakupan|out of scope/i);
  });

  test("checkGuardrail() returns triggered=true for crypto keywords", async ({ request }) => {
    const res = await request.get("/api/debug/guardrail?msg=analisis+bitcoin&lang=id");
    const body = await res.json();
    expect(body.triggered).toBe(true);
    expect(body.response).toMatch(/bursa efek indonesia|idx|cryptocurrency|out of scope/i);
  });

  test("checkGuardrail() returns triggered=true for prediction keywords", async ({ request }) => {
    const res = await request.get("/api/debug/guardrail?msg=prediksi+harga+saham+BBRI&lang=id");
    const body = await res.json();
    expect(body.triggered).toBe(true);
    expect(body.response).toMatch(/tidak bisa memprediksi|cannot predict/i);
  });

  test("checkGuardrail() returns triggered=false for normal queries", async ({ request }) => {
    const res = await request.get("/api/debug/guardrail?msg=apa+itu+PBV&lang=id");
    const body = await res.json();
    expect(body.triggered).toBe(false);
    expect(body.response).toBeUndefined();
  });

  test("checkGuardrail() returns English response when lang=en", async ({ request }) => {
    const res = await request.get("/api/debug/guardrail?msg=sell+my+portfolio&lang=en");
    const body = await res.json();
    expect(body.triggered).toBe(true);
    expect(body.lang).toBe("en");
    expect(body.response).toMatch(/out of scope|cannot help with transactions/i);
  });
});

/* -----------------------------------------------------------------------
   Integration layer — guardrail fires, no LLM API call is made
   ----------------------------------------------------------------------- */
test.describe("Guardrail Integration (no LLM call)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.goto("/chat");
  });

  test("no LLM API call is made for blocked trade keywords", async ({ page }) => {
    let llmCalls = 0;
    await page.route(
      /api\.anthropic\.com|api\.openai\.com|api\.deepseek\.com|openrouter\.ai/,
      () => { llmCalls++; }
    );

    const chatInput = page.locator("textarea").first();
    await chatInput.fill("beli saham BBCA");
    await chatInput.press("Enter");
    await page.waitForTimeout(1000);

    expect(llmCalls).toBe(0);
  });

  test("no LLM API call is made for blocked prediction keywords", async ({ page }) => {
    let llmCalls = 0;
    await page.route(
      /api\.anthropic\.com|api\.openai\.com|api\.deepseek\.com|openrouter\.ai/,
      () => { llmCalls++; }
    );

    const chatInput = page.locator("textarea").first();
    await chatInput.fill("prediksi harga saham BBRI");
    await chatInput.press("Enter");
    await page.waitForTimeout(1000);

    expect(llmCalls).toBe(0);
  });

  test("no LLM API call is made for blocked crypto keywords", async ({ page }) => {
    let llmCalls = 0;
    await page.route(
      /api\.anthropic\.com|api\.openai\.com|api\.deepseek\.com|openrouter\.ai/,
      () => { llmCalls++; }
    );

    const chatInput = page.locator("textarea").first();
    await chatInput.fill("analisis bitcoin");
    await chatInput.press("Enter");
    await page.waitForTimeout(1000);

    expect(llmCalls).toBe(0);
  });
});
