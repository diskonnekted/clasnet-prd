'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEditorStore } from '@/lib/stores/editor-store';
import { useProject } from '@/lib/queries/useProject';
import { useSection } from '@/lib/queries/useSection';
import { PrdEditor } from './prd-editor';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectEditorContainerProps {
  projectId: string;
}

export function ProjectEditorContainer({ projectId }: ProjectEditorContainerProps) {
  const { activeSectionNumber, setActiveSection } = useEditorStore();
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  
  // Default active section to '1' if not set
  useEffect(() => {
    if (!activeSectionNumber) {
      setActiveSection('1');
    }
  }, [activeSectionNumber, setActiveSection]);

  const { data: sectionData, isLoading: sectionLoading } = useSection(
    projectId, 
    activeSectionNumber
  );

  if (projectLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-[500px] w-full mt-8" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center bg-white border rounded-xl">
        <h3 className="font-bold text-red-500">Proyek tidak ditemukan</h3>
        <p className="text-sm text-gray-500 mt-2">Mohon periksa kembali ID proyek Anda.</p>
      </div>
    );
  }

  // Fallback initial content if section hasn't been generated/saved yet
  const defaultContent = `
# ${activeSectionNumber}. ${getSectionTitle(activeSectionNumber || '1')}

*Belum ada konten untuk bagian ini.*
*Tanyakan pada asisten AI di sidebar sebelah kanan untuk mulai meng-generate draf bab ini.*
  `;

  const initialContent = sectionData?.content_markdown || defaultContent;

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors mb-4 no-print">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dasbor
        </Link>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{project.name}</h2>
        <p className="text-xs text-gray-400 font-mono mt-1">Project ID: {projectId}</p>
      </div>
      
      {sectionLoading ? (
        <div className="space-y-4 mt-6">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : (
        <PrdEditor 
          projectId={projectId} 
          sectionNumber={activeSectionNumber || '1'} 
          initialContent={initialContent} 
        />
      )}
    </div>
  );
}

function getSectionTitle(sectionNumber: string): string {
  const titles: Record<string, string> = {
    '1': 'Executive Summary',
    '2': 'Goals & Scope',
    '3': 'Target Users',
    '4': 'Functional Requirements',
    '5': 'UX & User Flows',
    '6': 'AI/ML Requirements',
    '7': 'Non-Functional Requirements',
    '8': 'Technical Architecture',
    '9': 'Release Strategy',
    '10': 'Risks & Open Questions',
    '11': 'Appendix',
  };
  return titles[sectionNumber] || `Section ${sectionNumber}`;
}
