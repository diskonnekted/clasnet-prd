import Link from 'next/link';
import { Terminal, Check, Zap, MessageSquare } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">&gt; _UPGRADE_SYSTEM</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Pilih lisensi untuk meningkatkan kapasitas kompilasi AI PRD Anda.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LITE */}
        <div className="border border-green-500/30 bg-[#111] p-8 rounded-sm hover:border-green-500/60 transition-colors relative">
          <h2 className="text-xl font-bold text-white mb-2">LITE_NODE</h2>
          <div className="flex items-end gap-1 mb-6">
            <span className="text-4xl font-bold text-green-400">$2</span>
            <span className="text-gray-500 mb-1">/ one-time</span>
          </div>
          <ul className="space-y-4 mb-8 text-sm text-gray-300">
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Kuota 3 PRD</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> AI Co-Pilot & Maestro</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Export to PDF</li>
          </ul>
        </div>

        {/* STANDAR */}
        <div className="border-2 border-green-500 bg-[#111] p-8 rounded-sm relative transform md:-translate-y-4 shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-black text-xs font-bold px-3 py-1 uppercase tracking-wider">
            RECOMMENDED
          </div>
          <h2 className="text-xl font-bold text-white mb-2">STANDARD_NODE</h2>
          <div className="flex items-end gap-1 mb-6">
            <span className="text-4xl font-bold text-green-400">$10</span>
            <span className="text-gray-500 mb-1">/ one-time</span>
          </div>
          <ul className="space-y-4 mb-8 text-sm text-gray-300">
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Kuota 12 PRD</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> AI Co-Pilot & Maestro</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Export to PDF</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Nemesis Critique Agent</li>
          </ul>
        </div>

        {/* CORPORATE */}
        <div className="border border-green-500/30 bg-[#111] p-8 rounded-sm hover:border-green-500/60 transition-colors relative">
          <h2 className="text-xl font-bold text-white mb-2">CORPORATE_NODE</h2>
          <div className="flex items-end gap-1 mb-6">
            <span className="text-4xl font-bold text-green-400">$50</span>
            <span className="text-gray-500 mb-1">/ one-time</span>
          </div>
          <ul className="space-y-4 mb-8 text-sm text-gray-300">
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Kuota 100 PRD</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Semua Fitur Standard</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> BDD Compilation & Diagram</li>
            <li className="flex gap-3"><Check className="w-5 h-5 text-green-500 shrink-0" /> Priority Support</li>
          </ul>
        </div>
      </div>

      <div className="mt-20 border border-green-500/20 bg-[#111] p-8 text-center max-w-2xl mx-auto">
        <Terminal className="w-8 h-8 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-4">Cara Pembayaran</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Sistem pembayaran saat ini dilakukan secara manual. Silakan transfer biaya paket yang Anda pilih menggunakan salah satu metode di bawah ini, lalu hubungi admin untuk aktivasi lisensi.
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <div className="border border-green-500/30 p-6 bg-black flex flex-col items-start justify-center group">
            <h4 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" /> PayPal
            </h4>
            <a 
              href="mailto:arif.susilo@gmail.com" 
              className="bg-[#003087] hover:bg-[#001c52] text-white px-6 py-2.5 rounded-sm font-bold text-sm transition-colors inline-block w-full text-center"
            >
              Bayar via PayPal
            </a>
          </div>
          
          <div className="border border-green-500/30 p-6 bg-black flex flex-col items-start justify-center group">
            <h4 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-400" /> Transfer Bank / E-Wallet
            </h4>
            <a 
              href="https://wa.me/6281328128315" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-[#25D366] hover:bg-[#1b9a4a] text-white px-6 py-2.5 rounded-sm font-bold text-sm transition-colors inline-block w-full text-center"
            >
              Chat via WhatsApp
            </a>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-8">
          Lisensi akan diaktifkan maksimal 1x24 jam setelah pembayaran dikonfirmasi.
        </p>
      </div>
    </div>
  );
}
