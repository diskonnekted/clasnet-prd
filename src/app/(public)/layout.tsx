import { PublicNavbar } from '@/components/landing/public-navbar';
import { PublicFooter } from '@/components/landing/public-footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-green-500 font-mono selection:bg-green-500/30 flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
