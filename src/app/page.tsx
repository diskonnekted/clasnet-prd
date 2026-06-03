import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Terminal, Bot, FileCode2, Cpu, ShieldAlert, Zap, Activity } from 'lucide-react';
import { PublicNavbar } from '@/components/landing/public-navbar';
import { PublicFooter } from '@/components/landing/public-footer';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) redirect('/projects');
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-green-500 font-mono selection:bg-green-500/30">
      {/* Top Navigation */}
      <PublicNavbar />
      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-green-950/30 border border-green-500/30 text-green-400 text-sm px-4 py-1.5 rounded-sm mb-8">
          <Zap className="w-4 h-4" /> root@claude-3.7-gpt4o: system online
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
          COMPILE IDEAS INTO <br />
          <span className="text-green-500">PRODUCTION-READY PRD</span>
        </h1>
        
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          // The ultimate AI Product Manager. It extracts your raw thoughts, 
          engineers BDD user stories, and outputs strict AI/ML specifications. 
          Ready for immediate deployment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/register"
            className="group relative bg-green-500 text-black px-8 py-3 font-bold hover:bg-green-400 transition-colors"
          >
            <span className="absolute -inset-0.5 bg-green-500/50 blur opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative">./execute_start.sh →</span>
          </Link>
          <a
            href="#modules"
            className="border border-green-500/30 px-8 py-3 text-green-400 hover:bg-green-950/20 transition-colors"
          >
            view_modules()
          </a>
        </div>
        
        {/* Terminal Window Mockup */}
        <div className="mt-20 border border-green-500/20 bg-black rounded-lg text-left overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.1)]">
          <div className="bg-[#111] px-4 py-2 border-b border-green-500/20 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="p-6 text-sm text-gray-300">
            <span className="text-green-500">user@admin:~$</span> init prd-generator<br/>
            <span className="text-blue-400">[INFO]</span> Loading Maestro Orchestrator... OK<br/>
            <span className="text-blue-400">[INFO]</span> Initializing Nemesis Critique Agent... OK<br/>
            <span className="text-blue-400">[INFO]</span> Connecting to Supabase Matrix... ESTABLISHED<br/>
            <span className="text-green-500">user@admin:~$</span> _
            <span className="animate-pulse inline-block w-2 h-4 bg-green-500 align-middle ml-1"></span>
          </div>
        </div>
        
        {/* Features Grid */}
        <div id="modules" className="grid md:grid-cols-3 gap-6 mt-24 text-left">
          {[
            { icon: <Bot className="w-7 h-7" />, title: 'AI Co-Pilot', desc: 'Context-aware autonomous agent attached to your project environment.' },
            { icon: <FileCode2 className="w-7 h-7" />, title: 'BDD Compilation', desc: 'Strict Given/When/Then acceptance criteria ready for automated testing.' },
            { icon: <Cpu className="w-7 h-7" />, title: 'AI/ML Spec Engine', desc: 'Generates model parameters, fallback vectors, and cost estimations.' },
            { icon: <ShieldAlert className="w-7 h-7" />, title: 'Devil\'s Advocate', desc: 'Nemesis agent runs vulnerability scans on your PRD logic.' },
            { icon: <Zap className="w-7 h-7" />, title: 'One-Click Patch', desc: 'Deploy AI-suggested fixes instantly with inline diff previews.' },
            { icon: <Activity className="w-7 h-7" />, title: 'Heuristic Scoring', desc: '7-dimensional quality metrics to gauge deployment readiness.' },
          ].map((f, i) => (
            <div key={i} className="bg-[#111]/50 border border-green-500/20 p-6 hover:border-green-500/50 transition-colors group">
              <div className="mb-4 text-green-500/70 group-hover:text-green-400">{f.icon}</div>
              <h3 className="font-bold mb-2 text-gray-200 tracking-tight">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
