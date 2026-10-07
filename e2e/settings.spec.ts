import { test, expect } from "@playwright/test";

/**
 * Settings E2E Tests
 * Covers API key save, provider switching, language toggle, and reset.
 */
test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.goto("/settings");
  });

  test("security warning banner is visible", async ({ page }) => {
    await expect(
      page.getByText(/Security Notice|Peringatan Keamanan/i)
    ).toBeVisible();
  });

  test("Sectors API key can be entered and saved", async ({ page }) => {
    const apiKeyInput = page.locator("input[type='password']").first();
    await apiKeyInput.fill("test-api-key-12345");
    await page.getByRole("button", { name: /simpan|save/i }).click();
    await expect(page.getByText(/saved|tersimpan/i)).toBeVisible();
  });

  test("LLM provider can be switched to OpenAI", async ({ page }) => {
    // Click the OpenAI provider option
    await page.getByText("OpenAI GPT-4o").first().click();

    // The API Key label for the selected provider should be visible
    await expect(
      page.locator("label").filter({ hasText: /api key/i }).first()
    ).toBeVisible();
  });

  test("language can be toggled between ID and EN", async ({ page }) => {
    // Page title in ID
    await expect(
      page.getByRole("heading", { name: "Pengaturan" })
    ).toBeVisible();

    // Switch to English — find and click the English language button
    const enBtn = page.getByText("🇬🇧 English");
    await enBtn.click();

    // Page should now show English title
    await expect(
      page.getByRole("heading", { name: "Settings" })
    ).toBeVisible();
  });

  test("reset button requires confirmation", async ({ page }) => {
    // Scroll to the danger zone first
    const dangerZone = page.getByText(/danger zone|zona berbah/i);
    await dangerZone.scrollIntoViewIfNeeded();

    // Click reset — should show confirmation
    await page.getByRole("button", { name: /reset all|reset semua/i }).click();

    // Confirmation buttons should appear
    await expect(
      page.getByRole("button", { name: /ya|yes/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /cancel|batal/i })
    ).toBeVisible();
  });

  test("cancel reset keeps settings intact", async ({ page }) => {
    // Enter an API key and save
    const apiKeyInput = page.locator("input[type='password']").first();
    await apiKeyInput.fill("test-key-xyz");
    await page.getByRole("button", { name: /simpan|save/i }).click();
    await expect(page.getByText(/saved|tersimpan/i)).toBeVisible();

    // Trigger reset confirmation
    await page.getByRole("button", { name: /reset all|reset semua/i }).click();

    // Cancel it
    await page.getByRole("button", { name: /cancel|batal/i }).click();

    // Input should still have the value
    await expect(apiKeyInput).toHaveValue("test-key-xyz");
  });
});
