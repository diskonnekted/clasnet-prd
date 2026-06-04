'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Monitor, Smartphone, Globe, Code, Cpu, Landmark, HeartPulse, HardDrive, LayoutGrid, Trash2, MoreVertical, Copy, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Project {
  id: string;
  name: string;
  description: string | null;
  domain: string;
  has_ai_features: boolean;
  status: string;
  updated_at: string;
  prd_documents?: { prd_sections: [{ count: number }] }[];
}

interface ProjectsDashboardProps {
  initialProjects: Project[];
}

const DOMAIN_LABELS: Record<string, string> = {
  mobile_app: 'Aplikasi Mobile',
  web_saas: 'Web SaaS',
  ai_ml_product: 'Produk AI / ML',
  iot_device: 'Perangkat IoT',
  internal_tool: 'Internal Tool',
  marketplace: 'Marketplace / E-Commerce',
  fintech: 'Teknologi Keuangan',
  healthcare: 'Layanan Kesehatan',
  other: 'Lainnya',
};

function getDomainIcon(domain: string) {
  switch (domain) {
    case 'mobile_app': return <Smartphone className="w-5 h-5" />;
    case 'web_saas': return <Globe className="w-5 h-5" />;
    case 'ai_ml_product': return <Cpu className="w-5 h-5" />;
    case 'iot_device': return <HardDrive className="w-5 h-5" />;
    case 'internal_tool': return <Code className="w-5 h-5" />;
    case 'marketplace': return <LayoutGrid className="w-5 h-5" />;
    case 'fintech': return <Landmark className="w-5 h-5" />;
    case 'healthcare': return <HeartPulse className="w-5 h-5" />;
    default: return <Monitor className="w-5 h-5" />;
  }
}

export function ProjectsDashboard({ initialProjects }: ProjectsDashboardProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('web_saas');
  const [hasAiFeatures, setHasAiFeatures] = useState('false');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Nama proyek wajib diisi');
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          domain,
          has_ai_features: hasAiFeatures === 'true',
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Gagal membuat proyek');
      }
      
      const newProject = await res.json();
      toast.success('Proyek baru berhasil dibuat!');
      
      // Close dialog & reset form
      setIsDialogOpen(false);
      setName('');
      setDescription('');
      setDomain('web_saas');
      setHasAiFeatures('false');
      
      // Redirect to the newly created project editor
      router.push(`/projects/${newProject.id}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string, projectName: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm(`Apakah Anda yakin ingin menghapus proyek "${projectName}"?`)) {
      return;
    }
    
    try {
      await api.projects.delete(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Proyek berhasil dihapus');
    } catch (err: any) {
      toast.error('Gagal menghapus proyek: ' + err.message);
    }
  };

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Daftar Proyek</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola dan buat PRD cerdas untuk produk Anda</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger render={
            <Button className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 text-sm font-semibold rounded-lg transition shadow-sm cursor-pointer">
              <Plus className="w-4 h-4" /> Proyek Baru
            </Button>
          } />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Buat Proyek Baru</DialogTitle>
              <DialogDescription className="text-gray-500 text-xs">
                Mulai kerangka PRD dengan mendefinisikan informasi dasar produk.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Nama Proyek</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Aplikasi Monitoring IoT Mandiri"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">Deskripsi Singkat</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ringkasan singkat mengenai produk atau ide dasar Anda..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Domain Produk</Label>
                <Select value={domain} onValueChange={(val) => setDomain(val || 'web_saas')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih domain produk" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(DOMAIN_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Apakah aplikasi ini memiliki fitur AI/ML?</Label>
                <RadioGroup value={hasAiFeatures} onValueChange={setHasAiFeatures} className="flex gap-4 mt-1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="ai-yes" />
                    <Label htmlFor="ai-yes" className="font-normal cursor-pointer select-none">Ya (Membutuhkan Bab 6)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="ai-no" />
                    <Label htmlFor="ai-no" className="font-normal cursor-pointer select-none">Tidak</Label>
                  </div>
                </RadioGroup>
              </div>

              <DialogFooter className="pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={submitting}
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
                >
                  {submitting ? 'Memproses...' : 'Buat Proyek'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {projects.length === 0 ? (
        <div className="bg-white border border-dashed rounded-2xl p-12 text-center max-w-xl mx-auto mt-10 shadow-sm">
          <LayoutGrid className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800">Belum ada proyek</h3>
          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Anda belum membuat proyek PRD apapun. Klik tombol di bawah atau tombol di kanan atas untuk memulai.
          </p>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white mt-6 font-semibold shadow-sm"
          >
            Buat Proyek Pertama Anda
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((project) => {
            const totalSections = project.has_ai_features ? 11 : 10;
            let generatedSections = 0;
            if (project.prd_documents?.[0]?.prd_sections?.[0]?.count) {
              generatedSections = project.prd_documents[0].prd_sections[0].count;
            }
            const progressPercent = Math.min(100, Math.round((generatedSections / totalSections) * 100));

            return (
              <div 
                key={project.id}
                className="block bg-white p-6 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group relative overflow-hidden"
              >
                {/* Full card clickable link */}
                <Link href={`/projects/${project.id}`} className="absolute inset-0 z-0" aria-label={`Buka proyek ${project.name}`}></Link>
                
                <div className="flex justify-between items-start mb-4 relative z-10 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-100 transition-colors">
                      {getDomainIcon(project.domain)}
                    </div>
                    <span className="text-[10px] font-bold tracking-wider uppercase bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                      {DOMAIN_LABELS[project.domain] || project.domain}
                    </span>
                  </div>
                  <div className="pointer-events-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer outline-none flex items-center justify-center"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={(e) => { e.preventDefault(); router.push(`/projects/${project.id}?print=true`); }}
                          className="cursor-pointer gap-2"
                        >
                          <Download className="w-4 h-4" /> Export to PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => { e.preventDefault(); toast.info('Fitur Duplikat sedang dalam pengembangan.'); }}
                          className="cursor-pointer gap-2"
                        >
                          <Copy className="w-4 h-4" /> Duplikat Proyek
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={(e) => handleDeleteProject(e, project.id, project.name)}
                          className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <div className="relative pointer-events-none">
                  <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {project.description || 'Tidak ada deskripsi proyek.'}
                  </p>

                  {/* Progress Tracking */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1.5 font-medium">
                      <span>Progress Dokumen</span>
                      <span>{generatedSections}/{totalSections} Bab</span>
                    </div>
                    <Progress value={progressPercent} className="h-1.5 bg-gray-100" />
                  </div>

                  <div className="text-[10px] text-gray-400 font-medium pt-3 border-t flex justify-between items-center">
                    <span>Terakhir diedit: {new Date(project.updated_at).toLocaleDateString('id-ID')}</span>
                    {project.has_ai_features && (
                      <span className="text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded text-[9px] uppercase tracking-wide">
                        AI Enabled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Quick Create Card */}
          <div 
            onClick={() => setIsDialogOpen(true)}
            className="block bg-white p-6 rounded-2xl border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/20 transition-all cursor-pointer flex flex-col items-center justify-center text-center min-h-[220px]"
          >
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-800">Buat Proyek Baru</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-[200px] leading-relaxed">
              Mulai draft PRD dari ide mentah Anda sekarang.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
