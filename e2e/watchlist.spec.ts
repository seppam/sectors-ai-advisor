import { test, expect } from "@playwright/test";

/**
 * Watchlist E2E Tests
 * Covers adding symbols, removing them, validation, and empty state.
 */
test.describe("Watchlist Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.goto("/watchlist");
  });

  test("shows empty state initially", async ({ page }) => {
    // Empty state heading: "Daftar pantau kosong" or "Watchlist is empty"
    await expect(
      page.getByRole("heading", { name: /kosong|empty/i })
    ).toBeVisible();
  });

  test("adds a valid stock symbol", async ({ page }) => {
    const input = page.locator("input[placeholder*='BBCA'], input[placeholder*='symbol']").first();
    await input.fill("BBCA");
    await page.getByRole("button", { name: /tambah|add/i }).click();

    // Symbol should appear in the list
    await expect(page.getByText("BBCA").first()).toBeVisible();
  });

  test("rejects invalid symbol format", async ({ page }) => {
    const input = page.locator("input[placeholder*='BBCA'], input[placeholder*='symbol']").first();
    await input.fill("INVALIDTOOLONG");
    await page.getByRole("button", { name: /tambah|add/i }).click();

    // Error message should appear
    await expect(
      page.getByText(/invalid|format|tidak valid/i)
    ).toBeVisible();
  });

  test("prevents duplicate symbols", async ({ page }) => {
    const input = page.locator("input[placeholder*='BBCA'], input[placeholder*='symbol']").first();

    // Add BBCA
    await input.fill("BBCA");
    await page.getByRole("button", { name: /tambah|add/i }).click();
    await expect(page.getByText("BBCA").first()).toBeVisible();

    // Try to add BBCA again
    await input.fill("BBCA");
    await page.getByRole("button", { name: /tambah|add/i }).click();

    // Duplicate error should appear
    await expect(
      page.getByText(/already|sudah|doubli/i)
    ).toBeVisible();
  });

  test("removes a symbol from watchlist", async ({ page }) => {
    const input = page.locator("input[placeholder*='BBCA'], input[placeholder*='symbol']").first();

    // Add BBRI
    await input.fill("BBRI");
    await page.getByRole("button", { name: /tambah|add/i }).click();
    await expect(page.getByText("BBRI").first()).toBeVisible();

    // The remove button has title="Hapus" or "Remove" (localized)
    const removeBtn = page.getByRole("button", { name: /hapus|remove/i }).first();
    await removeBtn.click();

    // Symbol should be gone
    await expect(page.getByText("BBRI").first()).not.toBeVisible();
  });

  test("normalizes input to uppercase", async ({ page }) => {
    const input = page.locator("input[placeholder*='BBCA'], input[placeholder*='symbol']").first();
    await input.fill("bbca");
    await page.getByRole("button", { name: /tambah|add/i }).click();

    // Should be stored as uppercase BBCA
    await expect(page.getByText("BBCA").first()).toBeVisible();
  });

  test("strips .JK suffix", async ({ page }) => {
    const input = page.locator("input[placeholder*='BBCA'], input[placeholder*='symbol']").first();
    await input.fill("BBCA.JK");
    await page.getByRole("button", { name: /tambah|add/i }).click();

    // Should be stored without .JK suffix
    await expect(page.getByText("BBCA").first()).toBeVisible();
    await expect(page.getByText("BBCA.JK").first()).not.toBeVisible();
  });

  test("multiple symbols can be added and tracked", async ({ page }) => {
    const input = page.locator("input[placeholder*='BBCA'], input[placeholder*='symbol']").first();

    for (const symbol of ["BBCA", "BBRI", "TLKM"]) {
      await input.fill(symbol);
      await page.getByRole("button", { name: /tambah|add/i }).click();
      await page.waitForTimeout(200);
    }

    // All 3 should be visible
    for (const symbol of ["BBCA", "BBRI", "TLKM"]) {
      await expect(page.getByText(symbol).first()).toBeVisible();
    }
  });
});
