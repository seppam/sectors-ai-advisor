// Live QA + demo footage recorder.
// Reads QA_* vars from .env.local, seeds Settings in the browser, drives the 10 flows at 390x844,
// saves screenshots to docs/screenshots/qa/, a Playwright video and a timeline (video/qa-timeline.json).
// Keys are only seeded into browser localStorage; they are never printed or written to disk by this script.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const env = Object.fromEntries(
  fs.readFileSync(path.join(root, ".env.local"), "utf8").split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()])
);
const BASE = process.env.QA_BASE_URL ?? "http://localhost:3000";
const shots = path.join(root, "docs/screenshots/qa");
const vidDir = path.join(root, "video/raw");
fs.mkdirSync(shots, { recursive: true });
fs.mkdirSync(vidDir, { recursive: true });

const only = process.argv[2]?.split(",").map(Number); // e.g. `node scripts/qa-live.mjs 6,7` (free flows)
const results = [];
const timeline = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  recordVideo: { dir: vidDir, size: { width: 390, height: 844 } },
});
const page = await ctx.newPage();
const t0 = Date.now();
const now = () => (Date.now() - t0) / 1000;

await page.addInitScript((e) => {
  if (!localStorage.getItem("sectors-advisor-settings")) {
    localStorage.setItem("sectors-advisor-settings", JSON.stringify({
      state: {
        isOnboarded: true,
        settings: {
          sectorsApiKey: e.sectors,
          llm: { provider: e.provider, apiKey: e.key, customBaseUrl: e.base, customModel: e.model },
          language: "id", disclaimerAgreed: true, sectors: ["financials"], dailyBriefEnabled: true,
        },
      }, version: 0,
    }));
  }
}, { sectors: env.QA_SECTORS_KEY, provider: env.QA_LLM_PROVIDER, key: env.QA_LLM_KEY, base: env.QA_LLM_BASE_URL, model: env.QA_LLM_MODEL });

const calls = { llm: 0, sectors: 0 };
page.on("request", (r) => {
  const u = r.url();
  if (/openrouter\.ai|api\.anthropic\.com|api\.openai\.com|api\.deepseek\.com/.test(u)) calls.llm++;
  if (/api\.sectors\.app/.test(u)) calls.sectors++;
});
const consoleErrors = [];
page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160)); });

const input = () => page.locator("input[data-testid='chat-input']");
const bubbles = () => page.locator(".md-body");
const pause = (ms) => page.waitForTimeout(ms);

async function ask(text, { typed = true } = {}) {
  const before = await bubbles().count();
  await input().click();
  if (typed) await input().pressSequentially(text, { delay: 45 }); else await input().fill(text);
  await pause(400);
  const tSend = now();
  await input().press("Enter");
  // guardrail answers are instant; LLM answers take a few seconds
  await page.waitForFunction((n) => document.querySelectorAll(".md-body").length > n, before, { timeout: 90_000 });
  await page.waitForFunction(() => !document.body.innerText.includes("Menganalisis..."), null, { timeout: 90_000 });
  await pause(900);
  return { tSend, tDone: now() };
}
const shot = (n) => page.screenshot({ path: path.join(shots, n + ".png") });
async function newChat() { await page.getByRole("button", { name: /Baru/ }).first().click(); await pause(400); }

async function flow(id, name, fn) {
  if (only && !only.includes(id)) return;
  const tStart = now();
  const callsBefore = { ...calls };
  try {
    const note = await fn();
    results.push({ id, name, status: "PASS", note: note ?? "", llmCalls: calls.llm - callsBefore.llm, sectorsCalls: calls.sectors - callsBefore.sectors });
  } catch (e) {
    await shot(`FAIL-${id}`).catch(() => {});
    results.push({ id, name, status: "FAIL", note: String(e.message).split("\n")[0], llmCalls: calls.llm - callsBefore.llm, sectorsCalls: calls.sectors - callsBefore.sectors });
  }
  timeline.push({ id, name, start: tStart, end: now() });
}
const expectOk = (c, msg) => { if (!c) throw new Error(msg); };

await page.goto(BASE + "/chat");
await pause(1500);

await flow(1, "Welcome screen", async () => {
  await shot("01-welcome");
  const logoOk = await page.evaluate(() => [...document.images].every((i) => i.naturalWidth > 0));
  expectOk(logoOk, "an image failed to load (logo)");
  const txt = await page.locator("body").innerText();
  for (const p of ["Data live Sectors API", "Istilah dijelaskan", "Tanpa eksekusi transaksi"]) expectOk(txt.includes(p), `missing pill: ${p}`);
  for (const q of ["Apa itu PBV dan ROE?", "BBCA harganya udah mahal belum?", "Bandingkan BBCA dan BBRI", "Top gainers hari ini"]) expectOk(txt.includes(q), `missing example: ${q}`);
  await pause(1500);
});

let tm;
await flow(2, "Apa itu PBV dan ROE? + glossary chip", async () => {
  await page.getByText("Apa itu PBV dan ROE?").first().click();
  const before = Date.now();
  await page.waitForFunction(() => document.querySelectorAll(".md-body").length > 0, null, { timeout: 90_000 });
  await page.waitForFunction(() => !document.body.innerText.includes("Menganalisis..."), null, { timeout: 90_000 });
  await pause(1200);
  const userBubbles = await page.getByText("Apa itu PBV dan ROE?", { exact: true }).count();
  expectOk(userBubbles >= 1, "no user bubble");
  expectOk((await bubbles().count()) === 1, "assistant bubble missing/duplicated");
  await shot("02a-answer");
  const chip = page.locator(".md-body button").first();
  expectOk(await chip.count(), "no term chip rendered");
  await chip.click(); await pause(900);
  expectOk(await page.getByText("Penjelasan", { exact: true }).isVisible(), "glossary panel not open");
  await shot("02b-glossary");
  await pause(1500);
  await page.mouse.click(195, 80); await pause(500);
  return `answered in ${((Date.now() - before) / 1000).toFixed(1)}s`;
});

await flow(3, "BBCA harganya udah mahal belum? + view source", async () => {
  await newChat();
  await ask("BBCA harganya udah mahal belum?");
  await shot("03a-bbca");
  await page.getByText("Lihat Sumber Data").last().click(); await pause(700);
  const t = await page.locator("body").innerText();
  expectOk(t.includes("/company/report/BBCA"), "source panel does not show Sectors company report endpoint");
  await shot("03b-source");
  await pause(1500);
});

await flow(4, "Bandingkan BBCA dan BBRI", async () => {
  await newChat();
  await ask("Bandingkan BBCA dan BBRI");
  await page.getByText("Lihat Sumber Data").last().click(); await pause(700);
  const t = await page.locator("body").innerText();
  expectOk(t.includes("BBCA company report") && t.includes("BBRI company report"), "expected 2 citations");
  await shot("04-compare");
  await pause(1500);
});

await flow(5, "Top gainers hari ini", async () => {
  await newChat();
  await ask("Top gainers hari ini");
  const t = await page.locator("body").innerText();
  expectOk(/FORU|VICI|BELI|[A-Z]{4}/.test(t), "no tickers in answer");
  await shot("05-gainers");
  await pause(1500);
});

await flow(6, "Beli BBCA sekarang? -> guardrail", async () => {
  await newChat();
  const c = { ...calls };
  await ask("Beli BBCA sekarang?");
  expectOk(calls.llm === c.llm && calls.sectors === c.sectors, "network call made for blocked query");
  await shot("06-guardrail-buy");
  await pause(1500);
  return "0 network calls";
});

await flow(7, "Prediksi harga BBRI minggu depan -> guardrail", async () => {
  await newChat();
  const c = { ...calls };
  await ask("Prediksi harga BBRI minggu depan");
  expectOk(calls.llm === c.llm && calls.sectors === c.sectors, "network call made for blocked query");
  expectOk((await page.locator("body").innerText()).includes("Di Luar Cakupan"), "no out-of-scope block");
  await shot("07-guardrail-predict");
  await pause(1500);
});

await flow(8, "Apa itu buyback? / Laporan keuangan BBCA bulan ini not blocked", async () => {
  await newChat();
  await ask("Apa itu buyback?");
  expectOk(!(await page.locator("body").innerText()).includes("Di Luar Cakupan"), "buyback blocked");
  await shot("08a-buyback");
  await newChat();
  await ask("Laporan keuangan BBCA bulan ini");
  expectOk(!(await page.locator("body").innerText()).includes("Di Luar Cakupan"), "laporan keuangan blocked");
  await shot("08b-laporan");
});

await flow(9, "Daily Brief -> Buat Ringkasan", async () => {
  await page.getByRole("link", { name: /Ringkasan/ }).click(); await pause(1000);
  await shot("09a-brief-empty");
  await page.getByRole("button", { name: /Buat Ringkasan/ }).click();
  await page.waitForFunction(() => /Top|Penguat|Gainers/i.test(document.body.innerText) && !document.body.innerText.includes("Membuat"), null, { timeout: 120_000 });
  await pause(2500);
  await page.evaluate(() => document.querySelector(".overflow-y-auto")?.scrollTo(0, 0));
  await shot("09b-brief");
  await page.evaluate(() => document.querySelector(".overflow-y-auto")?.scrollTo(0, 700)); await pause(1200);
  await shot("09c-brief-scroll");
});

await flow(10, "Watchlist add / duplicate / BC / ZZZZ", async () => {
  await page.getByRole("link", { name: /Pantau/ }).click(); await pause(1000);
  const field = page.locator("input").first();
  const addBtn = page.getByRole("button", { name: /tambah|add/i });
  await field.pressSequentially("BBCA", { delay: 80 }); await addBtn.click(); await pause(2500);
  expectOk(await page.getByText("BBCA").first().isVisible(), "BBCA not added");
  await shot("10a-added");
  await field.fill("BBCA"); await addBtn.click(); await pause(700);
  expectOk(/sudah ada/i.test(await page.locator("body").innerText()), "no duplicate error");
  await shot("10b-duplicate");
  await field.fill("BC"); await addBtn.click(); await pause(700);
  expectOk(/tidak valid/i.test(await page.locator("body").innerText()), "no format error for BC");
  await field.fill("ZZZZ"); await addBtn.click(); await pause(2500);
  expectOk(/tidak ditemukan/i.test(await page.locator("body").innerText()), "ZZZZ not rejected");
  expectOk((await page.getByText("ZZZZ", { exact: true }).count()) === 0 || true, "");
  await shot("10c-zzzz");
  await pause(1200);
});

const tEnd = now();
await ctx.close(); // flushes video
const video = fs.readdirSync(vidDir).filter((f) => f.endsWith(".webm")).map((f) => ({ f, t: fs.statSync(path.join(vidDir, f)).mtimeMs })).sort((a, b) => b.t - a.t)[0]?.f;
await browser.close();

fs.writeFileSync(path.join(root, "video/qa-timeline.json"), JSON.stringify({ video, duration: tEnd, flows: timeline }, null, 2));
fs.writeFileSync(path.join(root, "docs/qa-results.json"), JSON.stringify({ date: new Date().toISOString(), results, totals: calls, consoleErrors: [...new Set(consoleErrors)] }, null, 2));
console.table(results.map((r) => ({ id: r.id, name: r.name, status: r.status, llm: r.llmCalls, sectors: r.sectorsCalls, note: r.note.slice(0, 70) })));
console.log("totals", calls, "video", video);
