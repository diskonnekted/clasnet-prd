import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col overflow-hidden print:h-auto print:overflow-visible print:block">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-gray-800">AI PRD Generator</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email}</span>
          <form action="/auth/signout" method="post">
            <button className="text-sm text-red-600 hover:text-red-800 font-medium">
              Keluar
            </button>
          </form>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex print:overflow-visible print:block">
        {children}
      </main>
    </div>
  );
}
