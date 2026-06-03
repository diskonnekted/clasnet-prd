export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12 border-b border-green-500/20 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">&gt; _TERMS_OF_SERVICE</h1>
        <p className="text-gray-400 font-mono">
          Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
        </p>
      </div>

      <div className="prose prose-invert prose-green max-w-none text-gray-400">
        <p className="leading-relaxed">
          Selamat datang di Clasnet PRD Generator. Dengan mengakses dan menggunakan aplikasi ini, Anda setuju untuk terikat oleh Syarat dan Ketentuan (Terms of Service) berikut. Silakan baca dengan saksama.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">1. Layanan dan Lisensi</h3>
        <p className="leading-relaxed mb-4">
          Clasnet PRD adalah platform penyusunan Product Requirements Document berbasis AI. Kami memberikan Anda lisensi terbatas, non-eksklusif, dan tidak dapat dipindahtangankan untuk menggunakan layanan ini sesuai dengan paket harga (Lite, Standard, Corporate) yang Anda pilih.
        </p>
        <p className="leading-relaxed mb-6">
          Kuota pengunaan (jumlah PRD yang dapat digenerasi) dihitung berdasarkan jumlah proyek aktif yang Anda miliki sesuai paket lisensi. Akses layanan tidak boleh disalahgunakan untuk melatih model AI pihak ketiga tanpa izin kami.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">2. Akun dan Keamanan</h3>
        <p className="leading-relaxed mb-6">
          Anda bertanggung jawab atas keamanan akun dan kata sandi Anda (atau akun OAuth dari GitHub). Segala aktivitas yang terjadi di bawah akun Anda sepenuhnya merupakan tanggung jawab Anda. Anda dilarang membagikan kredensial login kepada pihak yang tidak berwenang.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">3. Konten Pengguna</h3>
        <p className="leading-relaxed mb-6">
          Anda memiliki hak penuh atas semua dokumen dan teks yang Anda hasilkan atau simpan di Clasnet PRD. Kami tidak mengklaim kepemilikan atas karya turunan Anda. Anda juga menyetujui bahwa Anda bertanggung jawab penuh untuk tidak mengunggah atau menyimpan konten ilegal, berbahaya, atau melanggar hak kekayaan intelektual pihak lain.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">4. Kebijakan Pembayaran</h3>
        <p className="leading-relaxed mb-6">
          Pembayaran untuk saat ini dilakukan secara manual (melalui transfer bank atau PayPal). Semua pembayaran yang sudah berhasil diverifikasi tidak dapat dikembalikan (non-refundable), kecuali kami gagal menyediakan layanan seperti yang dijanjikan karena kesalahan fatal sistem dalam 7x24 jam.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">5. Penafian Jaminan (Disclaimer)</h3>
        <p className="leading-relaxed mb-6">
          Layanan kami sebagian besar bergantung pada ketersediaan API pihak ketiga (LLM seperti OpenAI, Anthropic, Qwen). Kami tidak menjamin ketersediaan 100% tanpa waktu jeda (downtime). Teks yang dihasilkan oleh AI dapat mengandung halusinasi, bias, atau ketidaktepatan teknis. Anda setuju untuk mengevaluasi secara mandiri keakuratan dan kelayakan dokumen PRD sebelum mengeksekusinya dalam lingkungan bisnis Anda.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">6. Perubahan Syarat</h3>
        <p className="leading-relaxed mb-6">
          Kami berhak untuk mengubah atau mengganti Syarat dan Ketentuan ini kapan saja. Perubahan akan segera berlaku setelah kami memperbaruinya di halaman ini. Jika Anda terus menggunakan layanan kami setelah perubahan, Anda dianggap menyetujui syarat yang baru.
        </p>
      </div>
    </div>
  );
}
