export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12 border-b border-green-500/20 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">&gt; _PRIVACY_POLICY</h1>
        <p className="text-gray-400 font-mono">
          Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
        </p>
      </div>

      <div className="prose prose-invert prose-green max-w-none text-gray-400">
        <p className="leading-relaxed">
          Di Clasnet PRD, kami sangat menghargai privasi dan keamanan data ide produk Anda. Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">1. Data yang Kami Kumpulkan</h3>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li><strong>Informasi Akun:</strong> Alamat email dan nama yang Anda berikan saat mendaftar atau *login* melalui pihak ketiga (seperti GitHub).</li>
          <li><strong>Data Proyek (PRD):</strong> Semua teks, ide, dan modifikasi dokumen PRD yang Anda ketikkan di dalam editor kami.</li>
          <li><strong>Log Interaksi AI:</strong> Pesan dan *prompt* yang Anda kirimkan ke asisten AI (Maestro/Nemesis) untuk keperluan *debugging* dan penyempurnaan generasi teks.</li>
        </ul>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">2. Penggunaan Data</h3>
        <p className="leading-relaxed mb-6">
          Semua data proyek (termasuk draf dan dokumen PRD Anda) disimpan secara eksklusif di dalam *database* kami yang terenkripsi (Supabase). Kami hanya menggunakan data ini untuk menampilkan kembali dokumen Anda ke dalam editor Anda sendiri. 
        </p>
        <p className="leading-relaxed mb-6">
          <strong>PENTING:</strong> Kami mengirimkan masukan (*prompt*) yang Anda berikan ke API pihak ketiga (seperti Qwen, OpenAI, atau Anthropic) secara otomatis saat Anda meminta AI menyusun bab PRD. Oleh karena itu, hindari memasukkan kata sandi asli, kunci API rahasia (API Keys), atau data sensitif pelanggan dunia nyata ke dalam dokumen draf PRD Anda.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">3. Keamanan Data</h3>
        <p className="leading-relaxed mb-6">
          Kami menerapkan *Row Level Security* (RLS) secara ketat pada sistem *database* kami. Ini memastikan secara arsitektur bahwa data proyek Anda hanya dapat dibaca, diubah, atau dihapus oleh akun Anda sendiri yang terautentikasi. Pengguna lain tidak memiliki akses apa pun ke ruang kerja proyek Anda.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">4. Penghapusan Data</h3>
        <p className="leading-relaxed mb-6">
          Saat Anda menghapus proyek menggunakan tombol "Hapus Proyek" (*Trash icon*) di Dasbor Anda, data tidak akan ditampilkan lagi kepada Anda. Jika Anda ingin menghapus seluruh jejak akun dan dokumen Anda secara permanen dari server (*hard delete*), silakan hubungi pengelola sistem secara langsung.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">5. Kontak</h3>
        <p className="leading-relaxed mb-6">
          Jika Anda memiliki pertanyaan lebih lanjut terkait privasi ini, silakan hubungi kami melalui email: <strong>arif.susilo@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
}
