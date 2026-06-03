'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/projects');
      router.refresh();
    }
  };
  
  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/projects` },
    });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-green-500 font-mono px-4 selection:bg-green-500/30">
      
      {/* Tombol kembali ke home */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-green-500/70 hover:text-green-400 transition-colors">
        <Terminal className="w-5 h-5" />
        <span className="text-sm">cd /home</span>
      </Link>

      <div className="max-w-md w-full bg-[#111] border border-green-500/20 rounded-sm shadow-[0_0_30px_rgba(34,197,94,0.05)] p-8">
        <div className="text-center mb-8 border-b border-green-500/20 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">&gt; ACCESS_GRANTED?</h1>
          <p className="text-gray-400 text-sm">Enter credentials to authenticate session</p>
        </div>
        
        <button
          onClick={handleGithubLogin}
          className="w-full flex items-center justify-center gap-3 border border-green-500/30 bg-[#0a0a0a] text-gray-300 rounded-sm py-3 hover:bg-green-950/20 hover:text-green-400 hover:border-green-500/50 transition-all mb-6 group"
        >
          <svg className="w-5 h-5 group-hover:text-green-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
          </svg>
          Authenticate with GitHub
        </button>
        
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-green-500/20"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-[#111] text-gray-500">OR_USE_EMAIL</span>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-500/80">Email_Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-green-500/30 text-green-400 rounded-sm px-4 py-2.5 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50 transition-all placeholder:text-gray-700"
              placeholder="user@domain.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-green-500/80">Secure_Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-green-500/30 text-green-400 rounded-sm px-4 py-2.5 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400/50 transition-all placeholder:text-gray-700"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-950/30 border border-red-500/30 text-red-400 text-sm px-3 py-2 rounded-sm flex items-start gap-2">
              <span className="mt-0.5">!</span>
              <span>{error}</span>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-black font-bold rounded-sm py-3 mt-4 hover:bg-green-400 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '[ EXECUTING... ]' : './LOGIN.sh'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-green-500/20">
          New system user?{' '}
          <Link href="/register" className="text-green-500 hover:text-green-400 hover:underline underline-offset-4 transition-colors">
            [ Create_Account ]
          </Link>
        </p>
      </div>
    </div>
  );
}
