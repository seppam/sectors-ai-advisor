// ============================================================
// Internationalization — Bahasa Indonesia & English
// ============================================================

export type Locale = "id" | "en";

export const UI_STRINGS = {
  id: {
    // App
    appName: "Sectors AI Advisor",
    tagline: " Asisten investasi berbasis AI untuk pasar Indonesia",

    // Onboarding
    onboardingTitle: "Selamat Datang!",
    onboardingSubtitle: "Mari kita atur Sectors AI Advisor untukmu dalam 3 langkah.",
    step1Title: "Bahasa",
    step1Subtitle: "Pilih bahasa yang kamu inginkan.",
    step2Title: "Minat Pasar",
    step2Subtitle: "Pilih sektor yang kamu minati.",
    step3Title: "Preferensi Update",
    step3Subtitle: "Pilih jenis update yang ingin kamu terima.",
    step4Title: "Persetujuan",
    step4Subtitle: "Baca dan setujui sebelum melanjutkan.",
    allSectors: "Semua Sektor",
    continue: "Lanjutkan",
    startUsing: "Mulai Menggunakan",
    back: "Kembali",

    // Disclaimer
    disclaimerTitle: "Bukan Rekomendasi Investasi",
    disclaimerBody:
      "Sectors AI Advisor adalah alat informasi dan analisis. Konten yang dihasilkan bukan rekomendasi membeli, menjual, atau memegang saham. Selalu lakukan riset mandiri dan konsultasikan dengan penasihat keuangan sebelum mengambil keputusan.",
    disclaimerAgree: "Saya memahami dan setuju",
    disclaimerRequired: "Anda harus menyetujui disclaimer untuk melanjutkan",

    // Navigation
    chat: "Obrolan",
    dailyBrief: "Ringkasan Harian",
    watchlist: "Daftar Pantau",
    settings: "Pengaturan",

    // Chat
    chatPlaceholder: "Tanyakan tentang saham, sektor, atau rasio keuangan...",
    chatPlaceholderEn: "Ask about stocks, sectors, or financial ratios...",
    chatSend: "Kirim",
    chatThinking: "Menganalisis...",
    chatDisclaimer:
      "_Ini bukan rekomendasi investasi. Selalu lakukan riset mandiri dan konsultasikan dengan penasihat keuangan sebelum mengambil keputusan._",
    viewSource: "Lihat Sumber Data",
    hideSource: "Sembunyikan",
    glossary: "Glossary",
    tapToLearn: "Klik untuk belajar lebih lanjut",

    // Guardrail messages
    guardrailTitle: "⚠️ Di Luar Cakupan",
    guardrailCrypto:
      "Sectors AI Advisor fokus pada saham perusahaan yang tercatat di Bursa Efek Indonesia (IDX). Untuk cryptocurrency atau pasar lain, saya tidak dapat memberikan analisis.",
    guardrailTrade:
      "Saya tidak dapat membantu transaksi. Saya hanya membantu analisis dan penjelasan data. Untuk berinvestasi, silakan gunakan platform broker yang terdaftar di OJK.",
    guardrailPrediction:
      "Saya tidak dapat memprediksi harga di masa depan. Namun saya bisa membantu menganalisis data historis dan fundamental perusahaan.",

    // Daily Brief
    dailyBriefTitle: "Ringkasan Pasar Hari Ini",
    generateBrief: "Buat Ringkasan",
    generating: "Membuat ringkasan...",
    topGainers: "Top Penguat",
    topLosers: "Top Pelemahan",
    foreignFlow: "Arus Asing",
    netForeignBuy: "Net Beli Asing",
    netForeignSell: "Net Jual Asing",
    recentNews: "Berita Terkini",
    sectorOverview: "Sektor Hari Ini",
    watchlistHighlights: "Pantau Saham Anda",
    noWatchlist: "Belum ada saham di daftar pantau.",
    addToWatchlist: "Tambah ke Daftar Pantau",
    addedToWatchlist: "Ditambahkan ke daftar pantau",
    briefDisclaimer:
      "_This summary is for informational purposes only. Not investment advice._",

    // Watchlist
    watchlistTitle: "Daftar Pantau",
    watchlistEmpty: "Daftar pantau kosong",
    watchlistEmptyHint: "Tambahkan saham dari chat untuk mulai memantau.",
    addSymbol: "Tambah Simbol",
    remove: "Hapus",
    alertOn: "Alert saat perubahan >",
    symbolPlaceholder: "Masukkan simbol (contoh: BBCA)",

    // Settings
    settingsTitle: "Pengaturan",
    sectorsApiSection: "Sectors API",
    sectorsApiKey: "API Key Sectors",
    sectorsApiKeyPlaceholder: "Masukkan API key Sectors",
    sectorsApiLink: "Dapatkan API key di sectors.app/api",
    sectorsApiBalance: "Cek API key",
    llmSection: "AI / LLM",
    llmProvider: "Provider",
    llmApiKey: "API Key",
    llmApiKeyPlaceholder: "Masukkan API key",
    llmLinkAnthropic: "Dapatkan di console.anthropic.com",
    llmLinkOpenAI: "Dapatkan di platform.openai.com",
    llmLinkDeepSeek: "Dapatkan di platform.deepseek.com",
    languageSection: "Bahasa / Language",
    preferencesSection: "Preferensi",
    editPreferences: "Ubah Preferensi",
    disclaimer: "Disclaimer",
    dangerZone: "Zona Berbahaya",
    resetAll: "Reset Semua Data",
    saved: "Pengaturan tersimpan!",
    creditsNeeded: "Butuh kredit Sectors. Upgrade ke Insider.",

    // Errors
    errorSectorsApi: "Gagal mengambil data dari Sectors API",
    errorLlm: "Gagal mendapatkan respons dari AI. Coba lagi.",
    errorNoApiKey: "API key belum diisi. Buka Pengaturan.",
    errorNetwork: "Koneksi internet bermasalah. Coba lagi.",
  },

  en: {
    appName: "Sectors AI Advisor",
    tagline: " AI-powered investment assistant for the Indonesian market",

    onboardingTitle: "Welcome!",
    onboardingSubtitle: "Let's set up Sectors AI Advisor in 3 quick steps.",
    step1Title: "Language",
    step1Subtitle: "Choose your preferred language.",
    step2Title: "Market Interest",
    step2Subtitle: "Select the sectors you want to follow.",
    step3Title: "Update Preferences",
    step3Subtitle: "Choose what updates you'd like to receive.",
    step4Title: "Agreement",
    step4Subtitle: "Read and agree before continuing.",
    allSectors: "All Sectors",
    continue: "Continue",
    startUsing: "Start Using",
    back: "Back",

    disclaimerTitle: "Not Investment Advice",
    disclaimerBody:
      "Sectors AI Advisor is an information and analysis tool. Content generated is not a recommendation to buy, sell, or hold stocks. Always do your own research and consult a financial advisor before making decisions.",
    disclaimerAgree: "I understand and agree",
    disclaimerRequired: "You must agree to the disclaimer to continue",

    chat: "Chat",
    dailyBrief: "Daily Brief",
    watchlist: "Watchlist",
    settings: "Settings",

    chatPlaceholder: "Ask about stocks, sectors, or financial ratios...",
    chatPlaceholderEn: "Ask about stocks, sectors, or financial ratios...",
    chatSend: "Send",
    chatThinking: "Analyzing...",
    chatDisclaimer:
      "_This is not investment advice. Always do your own research and consult a financial advisor before making decisions._",
    viewSource: "View Data Source",
    hideSource: "Hide",
    glossary: "Glossary",
    tapToLearn: "Tap to learn more",

    guardrailTitle: "⚠️ Out of Scope",
    guardrailCrypto:
      "Sectors AI Advisor focuses on stocks listed on the Indonesia Stock Exchange (IDX). I cannot provide analysis for cryptocurrency or other markets.",
    guardrailTrade:
      "I cannot help with transactions. I only assist with analysis and data explanations. To invest, please use a broker platform registered with OJK.",
    guardrailPrediction:
      "I cannot predict future prices. However, I can help analyze historical data and company fundamentals.",

    dailyBriefTitle: "Today's Market Summary",
    generateBrief: "Generate Brief",
    generating: "Generating brief...",
    topGainers: "Top Gainers",
    topLosers: "Top Losers",
    foreignFlow: "Foreign Flow",
    netForeignBuy: "Net Foreign Buy",
    netForeignSell: "Net Foreign Sell",
    recentNews: "Latest News",
    sectorOverview: "Sector Overview",
    watchlistHighlights: "Your Watchlist Highlights",
    noWatchlist: "Your watchlist is empty.",
    addToWatchlist: "Add to Watchlist",
    addedToWatchlist: "Added to watchlist",
    briefDisclaimer: "_This summary is for informational purposes only. Not investment advice._",

    watchlistTitle: "Watchlist",
    watchlistEmpty: "Watchlist is empty",
    watchlistEmptyHint: "Add stocks from chat to start tracking.",
    addSymbol: "Add Symbol",
    remove: "Remove",
    alertOn: "Alert when change >",
    symbolPlaceholder: "Enter symbol (e.g. BBCA)",

    settingsTitle: "Settings",
    sectorsApiSection: "Sectors API",
    sectorsApiKey: "Sectors API Key",
    sectorsApiKeyPlaceholder: "Enter your Sectors API key",
    sectorsApiLink: "Get your key at sectors.app/api",
    sectorsApiBalance: "Check API key",
    llmSection: "AI / LLM",
    llmProvider: "Provider",
    llmApiKey: "API Key",
    llmApiKeyPlaceholder: "Enter your API key",
    llmLinkAnthropic: "Get it at console.anthropic.com",
    llmLinkOpenAI: "Get it at platform.openai.com",
    llmLinkDeepSeek: "Get it at platform.deepseek.com",
    languageSection: "Language",
    preferencesSection: "Preferences",
    editPreferences: "Edit Preferences",
    disclaimer: "Disclaimer",
    dangerZone: "Danger Zone",
    resetAll: "Reset All Data",
    saved: "Settings saved!",
    creditsNeeded: "Sectors credits needed. Upgrade to Insider.",
  },
} as const;

export type UIStrings = typeof UI_STRINGS.en;
export type OnboardingStrings = typeof UI_STRINGS.id.onboardingTitle;

export function t(locale: Locale) {
  return UI_STRINGS[locale];
}

export function fmt(locale: Locale, key: keyof UIStrings): string {
  return UI_STRINGS[locale][key] ?? UI_STRINGS.en[key] ?? key;
}
