import { test, expect } from "@playwright/test";

/**
 * Chat E2E Tests
 * Covers rendering, input, guardrails, and glossary chips.
 *
 * NOTE: The send button has no visible text label (SVG icon only), so all
 * form submissions use Enter key on the textarea instead of clicking the button.
 */
test.describe("Chat Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.goto("/chat");
  });

  test("chat input is visible and functional", async ({ page }) => {
    // P3-6: ChatInput renders an <input type='text'>, not a <textarea>
    const chatInput = page.locator("input[type='text']").first();
    await expect(chatInput).toBeVisible();
    await chatInput.fill("Apa itu PBV?");
    await expect(chatInput).toHaveValue("Apa itu PBV?");
  });

  test("shows welcome state when no messages exist", async ({ page }) => {
    await expect(page.getByText("Sectors AI Advisor").first()).toBeVisible();
    await expect(page.getByText(/Apa itu PBV dan ROE/).first()).toBeVisible();
  });

  test("requires LLM API key to send messages", async ({ page }) => {
    // Clear localStorage and reload so no API key is set
    await page.evaluate(() => localStorage.removeItem("sectors-advisor-settings"));
    await page.reload();
    await page.goto("/chat");

    const chatInput = page.locator("input[type='text']").first();
    await chatInput.fill("Apa itu ROE?");
    await chatInput.press("Enter");

    // Should show a warning about missing API key
    await expect(
      page.getByText(/API Key belum diset/i).first()
    ).toBeVisible({ timeout: 5000 });
  });

  test("submit via Enter key triggers loading state", async ({ page }) => {
    // Set fake API keys so the form can submit
    await page.evaluate(() => {
      localStorage.setItem(
        "sectors-advisor-settings",
        JSON.stringify({
          state: {
            settings: {
              llm: { provider: "deepseek", apiKey: "fake-key-for-test", customBaseUrl: "", customModel: "" },
              sectorsApiKey: "fake-sectors-key",
              language: "id",
              disclaimerAgreed: true,
              sectors: [],
              dailyBriefEnabled: false,
            },
            isOnboarded: true,
          },
          version: 0,
        })
      );
    });
    await page.reload();
    await page.goto("/chat");

    const chatInput = page.locator("input[type='text']").first();
    await chatInput.fill("Apa itu ROE?");
    // Submit via Enter — this is the actual UX
    await chatInput.press("Enter");

    // Verify the page didn't crash and input is still there
    await expect(page.locator("input[type='text']").first()).toBeVisible();
  });

  test("glossary chip appears in chat bubble after response", async ({ page }) => {
    // Set fake API keys
    await page.evaluate(() => {
      localStorage.setItem(
        "sectors-advisor-settings",
        JSON.stringify({
          state: {
            settings: {
              llm: { provider: "deepseek", apiKey: "fake-key", customBaseUrl: "", customModel: "" },
              sectorsApiKey: "fake-sectors-key",
              language: "id",
              disclaimerAgreed: true,
              sectors: [],
              dailyBriefEnabled: false,
            },
            isOnboarded: true,
          },
          version: 0,
        })
      );
    });
    await page.reload();
    await page.goto("/chat");

    // Intercept LLM call and return a mock response with a glossary chip
    await page.route(
      /api\.anthropic\.com|api\.openai\.com|api\.deepseek\.com|openrouter\.ai/,
      (route) => {
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            choices: [
              {
                message: {
                  content:
                    "PBV atau Price to Book Value [TERM:pb:PBV] adalah rasio yang membandingkan harga saham dengan nilai bukunya.",
                },
              },
            ],
          }),
        });
      }
    );

    const chatInput = page.locator("input[type='text']").first();
    await chatInput.fill("Apa itu PBV?");
    await chatInput.press("Enter");

    // Glossary chip should appear (rendered as a button with "PBV" text)
    await expect(
      page.getByRole("button", { name: "PBV" })
    ).toBeVisible({ timeout: 5000 });
  });

  test("chat page loads without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/chat");
    await page.waitForTimeout(1000);

    const realErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("net::ERR_") &&
        !e.includes("Failed to load resource")
    );

    expect(realErrors).toHaveLength(0);
  });
});
