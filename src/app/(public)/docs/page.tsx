import { Terminal, FileText, Bot, Printer } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-16 border-b border-green-500/20 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">&gt; _DOCUMENTATION</h1>
        <p className="text-gray-400">
          Panduan ringkas penggunaan sistem Clasnet PRD.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
            <span className="bg-green-500/10 p-2 rounded-sm"><Terminal className="w-6 h-6" /></span>
            1. Inisialisasi Proyek
          </h2>
          <div className="bg-[#111] p-6 border border-green-500/20 rounded-sm text-gray-300 leading-relaxed">
            <p className="mb-4">
              Langkah pertama adalah membuat "Ruang Proyek" (Project Workspace) untuk aplikasi atau ide Anda.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Masuk ke Dasbor menggunakan akun Anda (atau daftar terlebih dahulu).</li>
              <li>Klik tombol <strong>Proyek Baru</strong>.</li>
              <li>Isi nama proyek, deskripsi singkat ide produk Anda, dan tentukan apakah aplikasi memiliki fitur AI/ML.</li>
              <li>Sistem akan membuat ruang kerja khusus untuk PRD Anda.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
            <span className="bg-green-500/10 p-2 rounded-sm"><Bot className="w-6 h-6" /></span>
            2. Interaksi dengan AI Co-Pilot
          </h2>
          <div className="bg-[#111] p-6 border border-green-500/20 rounded-sm text-gray-300 leading-relaxed">
            <p className="mb-4">
              Di dalam editor proyek, Anda akan melihat panel percakapan (chat) di sisi kanan. Ini adalah otak dari aplikasi ini.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Mulai dengan mendeskripsikan secara kasar apa yang ingin Anda buat, misalnya: <em>"Saya ingin membuat aplikasi kasir untuk kedai kopi kecil."</em></li>
              <li>AI akan merespons dan mungkin menanyakan detail spesifik (Clarification).</li>
              <li>Setelah AI memahami, ia akan menawarkan pembuatan <strong>Outline PRD</strong>. Setujui untuk mulai menghasilkan bab-bab awal.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
            <span className="bg-green-500/10 p-2 rounded-sm"><FileText className="w-6 h-6" /></span>
            3. Pengeditan Rich-Text & Auto-Save
          </h2>
          <div className="bg-[#111] p-6 border border-green-500/20 rounded-sm text-gray-300 leading-relaxed">
            <p className="mb-4">
              Setiap hasil dari AI akan dikonversi ke dalam format dokumen yang bisa diedit di tengah layar.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Anda dapat mengetik langsung, menebalkan teks, menambahkan poin (bullet), atau membuat tabel layaknya Microsoft Word.</li>
              <li>Sistem akan melakukan <strong>Auto-Save</strong> ke database Supabase secara otomatis saat Anda berhenti mengetik.</li>
              <li>Gunakan tab "Navigasi Bab" di atas judul untuk berpindah antara Bab 1 (Executive Summary) hingga Bab 11.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-3">
            <span className="bg-green-500/10 p-2 rounded-sm"><Printer className="w-6 h-6" /></span>
            4. Export ke PDF
          </h2>
          <div className="bg-[#111] p-6 border border-green-500/20 rounded-sm text-gray-300 leading-relaxed">
            <p className="mb-4">
              Ketika seluruh bab PRD telah selesai ditulis dan direvisi, Anda bisa mengekspornya.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Klik tombol <strong>Export to PDF</strong> di pojok kanan atas halaman editor.</li>
              <li>Sistem akan memuat halaman khusus cetak (Print Mode) yang menghilangkan tombol-tombol antarmuka, menyisakan hanya teks dokumen Anda.</li>
              <li>Pilih "Save as PDF" dari kotak dialog cetak (Print) di browser Anda.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
