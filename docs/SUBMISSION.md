# Submission pack — Sectors Hackathon 2026

| | |
|---|---|
| **Team** | cobacobaberhadiah |
| **Member** | Muhamad Septian Pamungkas |
| **Project** | Sectors AI Advisor |
| **Track** | 1 · AI Agents & Assistants |
| **Repo** | https://github.com/seppam/sectors-ai-advisor |
| **Deadline** | 8 Oktober 2026, 23:59 WIB |

**Problem statement (1 kalimat):**
> Investor ritel Indonesia kesulitan memahami data pasar IDX (PER, PBV, ROE, DER); Sectors AI Advisor adalah asisten AI berbahasa Indonesia yang mengambil data live dari Sectors API, menjelaskan istilah keuangan secara in-line, dan menolak permintaan transaksi maupun prediksi harga.

## Yang masih perlu kamu isi / lakukan

| Item | Status | Nilai |
|---|---|---|
| Teaser URL (YouTube) | ⏳ setelah upload | `https://youtu.be/________` |
| Judging video URL (YouTube) | ⏳ setelah upload | `https://youtu.be/________` |
| Social post URL (LinkedIn) | ⏳ setelah posting | `https://www.linkedin.com/posts/________` |
| Deployed demo URL (opsional) | — | Vercel URL jika kamu deploy |

File video: `video/out/teaser.mp4` (±1:00) dan `video/out/judging.mp4` (±2:34), 1920×1080, H.264/AAC.
Thumbnail: `docs/assets/thumbnail-1280x720.png` (YouTube), `docs/assets/thumbnail-1080x1350.png` (LinkedIn).
Setelah URL video ada, isi bagian "Demo Video" di `README.md`.

---

## YouTube — Teaser (±1 menit)

- **Title:** `Sectors AI Advisor — Teaser | Sectors Hackathon 2026 (Track 1)`
- **Visibility:** Public (atau Unlisted — ikuti aturan hackathon; keduanya bisa dibuka lewat link)
- **Thumbnail:** `docs/assets/thumbnail-1280x720.png`
- **Description:**
```
Saham IDX itu rumit. PER, PBV, ROE, DER — apa artinya?
Sectors AI Advisor menjawab pertanyaan saham dalam bahasa Indonesia yang mudah dipahami, dengan data live dari Sectors API. Ketuk istilah apa pun untuk penjelasannya, lihat sumber data di setiap jawaban, tanpa eksekusi transaksi dan tanpa prediksi harga.

Sectors Hackathon 2026 · Track 1: AI Agents & Assistants
Repo: https://github.com/seppam/sectors-ai-advisor
Demo lengkap (3 menit): <JUDGING_VIDEO_URL>

@Sectors #SectorsHackathon2026
Disclaimer: bukan rekomendasi investasi.
```
- **Tags:** `Sectors Hackathon 2026, Sectors AI Advisor, AI agent, asisten saham, saham IDX, investor ritel, Sectors API, belajar saham, fintech Indonesia, Next.js`

## YouTube — Judging video (±2:34)

- **Title:** `Sectors AI Advisor — Demo & Penjelasan Teknis | Sectors Hackathon 2026 (Track 1)`
- **Visibility:** Public (atau Unlisted sesuai aturan)
- **Thumbnail:** `docs/assets/thumbnail-1280x720.png`
- **Description:**
```
Sectors AI Advisor adalah asisten obrolan berbahasa Indonesia yang menjelaskan saham IDX dengan bahasa sederhana, memakai data live dari Sectors API.
Track 1: AI Agents & Assistants — Sectors Hackathon 2026.

Repo: https://github.com/seppam/sectors-ai-advisor
Teaser: <TEASER_URL>

Chapters:
0:00 Masalah: data ada, pemahaman belum
0:10 Solusi: Sectors AI Advisor
0:25 Chat + glossary chip
0:41 Data live & sumber data (BBCA)
1:00 Perbandingan BBCA vs BBRI
1:09 Guardrail: tolak transaksi & prediksi harga
1:23 Ringkasan harian
1:33 Daftar pantau
1:43 Alur teknis (query → guardrail → Sectors API → LLM → jawaban)
2:06 Pengujian dengan data live & privasi
2:22 Penutup

Highlight teknis: Sectors API v2 via proxy stateless, guardrail sebelum panggilan API, cache respons, prompt hemat token, provider LLM bisa diganti (Claude / GPT / DeepSeek / OpenAI-compatible).

@Sectors #SectorsHackathon2026
Disclaimer: bukan rekomendasi investasi.
```
- **Tags:** `Sectors Hackathon 2026, Sectors AI Advisor, AI agent, LLM, guardrails, Sectors API, saham IDX, investor ritel, Next.js, TypeScript, demo`
- *Chapter timestamps dihitung dari komposisi; cek ulang di YouTube Studio setelah upload (selisih ≤1 detik).*

---

## LinkedIn post (Bahasa Indonesia)

Gunakan gambar: `docs/assets/thumbnail-1080x1350.png`. Tag **@Sectors** dengan mengetik `@Sectors` lalu pilih halamannya dari dropdown LinkedIn.

```
Saya sudah submit project untuk Sectors Hackathon 2026! 🚀

Project: Sectors AI Advisor
Track: 1 · AI Agents & Assistants
One-liner: Asisten AI berbahasa Indonesia yang menjelaskan data saham IDX dengan bahasa sederhana — langsung dari data live Sectors API.

Key Technical Highlights:
• Data live Sectors API v2 (company report, top movers, foreign flow, berita) dengan panel sumber di setiap jawaban, jadi semua klaim bisa ditelusuri
• Guardrail yang menolak transaksi & prediksi harga SEBELUM memanggil API apa pun: 0 kredit Sectors, 0 token LLM
• Istilah keuangan (PER, PBV, ROE, DER…) jadi chip interaktif dengan definisi, rumus, dan tanda bagus/perlu perhatian
• Cache respons + prompt hemat token, provider LLM bisa diganti (Claude, GPT, DeepSeek, atau gateway OpenAI-compatible); 10 skenario diuji dengan data live

Project Links:
GitHub: https://github.com/seppam/sectors-ai-advisor
Judging Demo Video: <JUDGING_VIDEO_URL>
Teaser: <TEASER_URL>

Tim: cobacobaberhadiah (Muhamad Septian Pamungkas)

Terima kasih @Sectors atas hackathon-nya! #SectorsHackathon2026 #AIAgents #IDX #FinTechIndonesia
```
