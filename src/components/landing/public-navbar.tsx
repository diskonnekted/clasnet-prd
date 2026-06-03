import Link from 'next/link';
import { Terminal } from 'lucide-react';

export function PublicNavbar() {
  return (
    <nav className="border-b border-green-500/20 bg-black/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 w-fit">
          <Terminal className="w-6 h-6 text-green-400" />
          <span className="font-bold text-xl tracking-tight text-green-400 hover:text-green-300 transition-colors">~/clasnet-prd</span>
        </Link>
        <div className="flex flex-wrap gap-4 md:gap-6 items-center text-sm">
          <Link href="/features" className="text-green-500/70 hover:text-green-400 transition-colors">
            [ features ]
          </Link>
          <Link href="/pricing" className="text-green-500/70 hover:text-green-400 transition-colors">
            [ pricing ]
          </Link>
          <Link href="/docs" className="text-green-500/70 hover:text-green-400 transition-colors">
            [ docs ]
          </Link>
          <Link href="/about" className="text-green-500/70 hover:text-green-400 transition-colors">
            [ about ]
          </Link>
          <div className="h-4 w-px bg-green-500/20 hidden md:block"></div>
          <Link href="/login" className="text-green-400 font-bold hover:text-green-300 transition-colors">
            ./login.sh
          </Link>
        </div>
      </div>
    </nav>
  );
}
