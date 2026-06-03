import { Bot, Cpu, ShieldAlert, Code2 } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: <Bot className="w-8 h-8" />,
      title: 'Maestro Orchestrator AI',
      desc: 'Lebih dari sekadar chatbot biasa. Maestro Orchestrator adalah sistem AI yang mampu merancang arsitektur dokumen PRD secara utuh, mengajukan pertanyaan klarifikasi jika ide Anda masih mentah, dan membagi tugas penulisan per bab secara asinkron.',
    },
    {
      icon: <Code2 className="w-8 h-8" />,
      title: 'BDD (Behavior-Driven Development) Ready',
      desc: 'Bagi para programmer dan penguji (QA), AI akan otomatis menyusun skenario Given-When-Then di bab Functional Requirements sehingga dokumentasi Anda langsung siap digunakan untuk pengujian otomatis (automated testing).',
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: 'AI/ML Spec Engine Khusus',
      desc: 'Membuat produk berbasis kecerdasan buatan? PRD Anda otomatis akan dilengkapi dengan Bab Spesifikasi AI yang mencakup arsitektur model, parameter akurasi (Precision/Recall), dan fallback strategy jika model gagal.',
    },
    {
      icon: <ShieldAlert className="w-8 h-8" />,
      title: 'Nemesis Critique System',
      desc: 'Aktifkan mode Nemesis untuk membuat AI berperan sebagai "Devil\'s Advocate". Sistem akan mengkritik draf PRD Anda, mencari celah keamanan, logika bisnis yang terlewat, dan potensi masalah skalabilitas di masa depan.',
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-16 text-center border-b border-green-500/20 pb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">&gt; _SYSTEM_FEATURES</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Arsitektur di balik Clasnet PRD yang mengubah ide abstrak Anda menjadi dokumen teknis yang dapat langsung dieksekusi oleh tim developer.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-[#111] border border-green-500/20 p-8 hover:border-green-500/50 transition-colors group">
            <div className="text-green-500 mb-6 bg-green-500/10 w-16 h-16 rounded-sm flex items-center justify-center group-hover:bg-green-500 group-hover:text-black transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-200 mb-4">{feature.title}</h3>
            <p className="text-gray-400 leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 border border-green-500/30 bg-green-950/20 text-center">
        <h2 className="text-xl font-bold text-green-400 mb-4">Under The Hood</h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-mono">
          <span className="px-3 py-1 bg-black border border-green-500/30 text-gray-400">Next.js 15 App Router</span>
          <span className="px-3 py-1 bg-black border border-green-500/30 text-gray-400">TipTap Rich Text Editor</span>
          <span className="px-3 py-1 bg-black border border-green-500/30 text-gray-400">Supabase Realtime DB</span>
          <span className="px-3 py-1 bg-black border border-green-500/30 text-gray-400">Vercel AI SDK</span>
          <span className="px-3 py-1 bg-black border border-green-500/30 text-gray-400">TailwindCSS 4</span>
        </div>
      </div>
    </div>
  );
}
