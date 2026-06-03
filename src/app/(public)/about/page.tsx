export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12 border-b border-green-500/20 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">&gt; _ABOUT_US</h1>
        <p className="text-gray-400 font-mono">
          Visi di balik penciptaan Clasnet PRD Generator.
        </p>
      </div>

      <div className="prose prose-invert prose-green max-w-none">
        <p className="text-lg leading-relaxed text-gray-300">
          Proses pembuatan produk (Product Development) seringkali terhambat di tahap paling awal: <strong>mendefinisikan apa yang sebenarnya ingin dibangun</strong>.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">Masalah Klasik Product Manager</h3>
        <p className="text-gray-400 leading-relaxed mb-6">
          Product Requirements Document (PRD) adalah artefak krusial yang menjembatani ide bisnis dengan eksekusi teknis para *engineer*. Namun, menulis PRD yang baik secara manual memakan waktu berhari-hari. Banyak PRD yang akhirnya menjadi terlalu abstrak, kehilangan detail teknis (*edge cases*), atau tidak memiliki metrik kesuksesan yang jelas.
        </p>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">Solusi Clasnet PRD</h3>
        <p className="text-gray-400 leading-relaxed mb-6">
          <strong>Clasnet PRD</strong> diciptakan untuk menyelesaikan *bottleneck* ini. Dengan mengombinasikan model bahasa besar (LLM) tingkat lanjut dan antarmuka editor dokumen yang presisi, kami memberdayakan Product Manager, Founder, dan Developer untuk memformulasikan ide mentah menjadi kerangka kerja teknis yang siap produksi dalam hitungan menit, bukan minggu.
        </p>

        <div className="bg-[#111] border-l-4 border-green-500 p-6 my-10">
          <p className="italic text-gray-300 m-0">
            "Kami percaya AI tidak akan menggantikan peran Product Manager, melainkan AI akan menyingkirkan pekerjaan repetitif dalam dokumentasi agar PM dapat fokus pada strategi bisnis dan empati pengguna."
          </p>
        </div>

        <h3 className="text-xl font-bold text-green-400 mt-10 mb-4">Dibuat Oleh</h3>
        <p className="text-gray-400 leading-relaxed mb-6">
          Proyek ini dirancang dan dikembangkan secara independen oleh <strong>Arif Susilo</strong> (<a href="https://github.com/diskonnekted" className="text-green-500 hover:underline">@diskonnekted</a>) dengan fokus pada integrasi AI *open-weights* dan performa aplikasi web modern yang mulus.
        </p>
      </div>
    </div>
  );
}
