<div align="center">
  <img src="public/favicon.ico" alt="Logo" width="80" height="80">
  <h3 align="center">Clasnet PRD - AI Product Requirements Generator</h3>

  <p align="center">
    Aplikasi cerdas untuk menyusun Product Requirements Document (PRD) secara otomatis dan kolaboratif menggunakan kecerdasan buatan (AI).
    <br />
    <br />
    <a href="#fitur-utama">Fitur Utama</a>
    ·
    <a href="#teknologi">Teknologi</a>
    ·
    <a href="#instalasi">Instalasi</a>
  </p>
</div>

---

## 🚀 Tentang Proyek Ini

**Clasnet PRD** (sebelumnya AI PRD Generator) adalah *tools* manajemen produk tingkat lanjut yang dirancang untuk membantu Product Manager (PM) merumuskan ide menjadi sebuah dokumen *Product Requirements* (PRD) yang terstruktur, rapi, dan komprehensif.

Aplikasi ini menggunakan model bahasa besar (LLM) seperti **Qwen / Gemini** melalui Vercel AI SDK untuk menguraikan ide mentah menjadi kerangka 10+ bab (Mulai dari *Executive Summary* hingga *Technical Architecture*).

## ✨ Fitur Utama

- 🤖 **AI-Powered Generation:** Tulis ide mentah, dan biarkan AI menyusun kerangka dan konten dari setiap bab secara otomatis.
- 📝 **Rich Text Editor:** Terintegrasi dengan TipTap Editor untuk pengeditan *rich-text* secara langsung pada dokumen hasil AI. Termasuk fitur tabel, *lists*, dan format *markdown*.
- 💾 **Real-time Auto-save:** Sinkronisasi langsung ke *database* (Supabase) setiap kali Anda melakukan perubahan di editor.
- 💬 **Interactive Chat & Critique:** Anda bisa meminta AI merevisi, mengkritik (*critique*), atau memperpanjang kalimat tertentu.
- 🖨️ **Print & Export:** Menyediakan format antarmuka khusus untuk dicetak (Export to PDF) yang elegan tanpa elemen *layout* (seperti *navbar* / *sidebar*).

## 🛠 Teknologi

Proyek ini dibangun menggunakan *stack* teknologi modern:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database & Auth:** [Supabase](https://supabase.com/)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/) & Qwen/OpenAI Compatible Models
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) & [TanStack React Query](https://tanstack.com/query)
- **Editor:** [TipTap](https://tiptap.dev/)

## 💻 Instalasi

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek secara lokal:

1. **Clone repository ini**
   ```bash
   git clone https://github.com/diskonnekted/clasnet-prd.git
   cd clasnet-prd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables**
   Salin `.env.example` ke `.env.local` dan isi kredensial Supabase serta API Keys (Qwen/OpenAI/Gemini).
   ```bash
   cp .env.example .env.local
   ```

4. **Jalankan Server**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di *browser* Anda.

---

<div align="center">
  Dibuat dengan ❤️ oleh <a href="https://github.com/diskonnekted">diskonnekted</a> (Arif Susilo).
</div>
