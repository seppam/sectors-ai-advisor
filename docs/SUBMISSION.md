# Submission pack — Sectors Hackathon 2026

**Team:** cobacobaberhadiah · **Member:** Muhamad Septian Pamungkas
**Deadline:** 8 Oktober 2026, 23:59 WIB

## 1. Isi form (copy-paste)

| Field di form | Isi |
|---|---|
| **Public repository URL** | `https://github.com/seppam/sectors-ai-advisor` |
| **Teaser video URL** (1 menit, public) | `https://youtu.be/________` ← isi setelah upload (**Visibility: Public**) |
| **Judging video URL** (≤3 menit, public/unlisted) | `https://youtu.be/________` ← isi setelah upload (Public atau Unlisted) |
| **Problem statement** (satu kalimat) | `Investor ritel Indonesia kesulitan memahami data pasar IDX (PER, PBV, ROE, DER); Sectors AI Advisor adalah asisten AI berbahasa Indonesia yang mengambil data live dari Sectors API, menjelaskan istilah keuangan secara in-line dengan sumber data yang bisa ditelusuri, dan menolak permintaan transaksi maupun prediksi harga.` |
| **Track** | `Track 1 — AI Agents & Assistants` |
| **Social media post URL** | `https://www.linkedin.com/posts/________` ← isi setelah posting LinkedIn |

> Post hanya di **LinkedIn**. Syarat form: tag akun resmi Sectors dan pakai **thumbnail template** dari hackathon (lihat bagian 4).

Versi English problem statement (jika dibutuhkan):
`Indonesian retail investors struggle to understand IDX market data (PER, PBV, ROE, DER); Sectors AI Advisor is an Indonesian-language AI assistant that pulls live Sectors API data, explains financial terms in-line with traceable sources, and refuses trade execution and price-prediction requests.`

## 2. File yang di-upload

| File | Lokasi |
|---|---|
| Teaser (±0:59) | `~/Documents/Sectors-Submission-cobacobaberhadiah/teaser.mp4` |
| Judging (±2:40) | `~/Documents/Sectors-Submission-cobacobaberhadiah/judging.mp4` |
| Thumbnail YouTube 1280×720 | `.../thumbnail-1280x720.png` (nama tim + member sudah tercantum) |
| Gambar LinkedIn 1080×1350 | `.../thumbnail-1080x1350.png` |

## 3. YouTube

### Teaser
- **Title:** `Sectors AI Advisor — Teaser | Sectors Hackathon 2026 (Track 1) | cobacobaberhadiah`
- **Visibility:** **Public** (wajib untuk teaser) · **Thumbnail:** `thumbnail-1280x720.png`
- **Description:**
```
Saham IDX itu rumit. PER, PBV, ROE — apa artinya?
Sectors AI Advisor menjawab pertanyaan saham dalam bahasa Indonesia yang mudah dipahami, dengan data live dari Sectors API. Ketuk istilah apa pun untuk penjelasannya, lihat sumber data di setiap jawaban, tanpa eksekusi transaksi dan tanpa prediksi harga.

Tim: cobacobaberhadiah — Muhamad Septian Pamungkas
Sectors Hackathon 2026 · Track 1: AI Agents & Assistants
Repo: https://github.com/seppam/sectors-ai-advisor
Demo lengkap: <JUDGING_VIDEO_URL>

@Sectors #SectorsHackathon2026
Disclaimer: bukan rekomendasi investasi.
```
- **Tags:** `Sectors Hackathon 2026, Sectors AI Advisor, AI agent, asisten saham, saham IDX, investor ritel, Sectors API, belajar saham, fintech Indonesia, Next.js`

### Judging video
- **Title:** `Sectors AI Advisor — Demo & Penjelasan Teknis | Sectors Hackathon 2026 (Track 1) | cobacobaberhadiah`
- **Visibility:** Public atau Unlisted · **Thumbnail:** `thumbnail-1280x720.png`
- **Description:**
```
Sectors AI Advisor adalah asisten obrolan berbahasa Indonesia yang menjelaskan saham IDX dengan bahasa sederhana, memakai data live dari Sectors API.
Track 1: AI Agents & Assistants — Sectors Hackathon 2026.
Tim: cobacobaberhadiah — Muhamad Septian Pamungkas

Repo: https://github.com/seppam/sectors-ai-advisor
Teaser: <TEASER_URL>

Chapters:
0:00 Pembuka
0:05 Masalah: data ada, pemahaman belum
0:15 Solusi: Sectors AI Advisor
0:30 Chat + glossary chip
0:46 Data live & sumber data (BBCA)
1:05 Perbandingan BBCA vs BBRI
1:14 Guardrail: tolak transaksi & prediksi harga
1:28 Ringkasan harian
1:38 Daftar pantau
1:48 Alur teknis (query → guardrail → Sectors API → LLM → jawaban)
2:12 Pengujian dengan data live & privasi
2:28 Penutup

Highlight teknis: Sectors API v2 via proxy stateless, guardrail sebelum panggilan API, cache respons, prompt hemat token, provider LLM bisa diganti (Claude / GPT / DeepSeek / OpenAI-compatible).

@Sectors #SectorsHackathon2026
Disclaimer: bukan rekomendasi investasi.
```
- **Tags:** `Sectors Hackathon 2026, Sectors AI Advisor, AI agent, LLM, guardrails, Sectors API, saham IDX, investor ritel, Next.js, TypeScript, demo`
- *Chapter dihitung dari komposisi; cek ulang di YouTube Studio setelah upload (selisih ≤1 detik).*

## 4. LinkedIn (satu-satunya social post)

Syarat form: **tag akun resmi Sectors** dan **pakai thumbnail template**. Template Canva hackathon: https://www.canva.com/design/DAHUfZI9dJI/rcFmHic2Nn5Hdqj7DLwfmw/edit — teks yang di-paste ada di [`CANVA-THUMBNAIL-TEXT.md`](CANVA-THUMBNAIL-TEXT.md) (sudah memuat nama tim dan member). Export dari Canva lalu lampirkan ke post. PNG buatan Remotion (`thumbnail-1080x1350.png`) memakai gaya yang sama sebagai cadangan.

Ketik `@Sectors` lalu pilih halaman resmi Sectors dari dropdown LinkedIn supaya benar-benar ter-tag.

```
Saya sudah submit project untuk Sectors Hackathon 2026! 🚀

Tim: cobacobaberhadiah (Muhamad Septian Pamungkas)
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

Terima kasih @Sectors atas hackathon-nya! #SectorsHackathon2026 #AIAgents #IDX #FinTechIndonesia
```

## 5. Urutan kerja
1. Tonton `teaser.mp4` dan `judging.mp4` sampai habis.
2. Upload teaser (Public) lalu judging (Public/Unlisted) ke YouTube → catat kedua URL.
3. Isi template Canva dengan `CANVA-THUMBNAIL-TEXT.md`, export PNG.
4. Posting LinkedIn (tag @Sectors, lampirkan gambar dari Canva) → catat URL post.
5. Isi tabel "Demo Video" di `README.md` dengan kedua URL, lalu `git commit && git push`.
6. Isi form hackathon (bagian 1) dan kirim sebelum 23:59 WIB.
