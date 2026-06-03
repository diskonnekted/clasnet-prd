import Link from 'next/link';

export function PublicFooter() {
  return (
    <footer className="border-t border-green-500/20 bg-black py-8 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <div>
          &copy; {new Date().getFullYear()} Clasnet PRD. All rights reserved.
        </div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-green-400 transition-colors">
            [ Privacy Policy ]
          </Link>
          <Link href="/terms" className="hover:text-green-400 transition-colors">
            [ Terms of Service ]
          </Link>
        </div>
      </div>
    </footer>
  );
}
