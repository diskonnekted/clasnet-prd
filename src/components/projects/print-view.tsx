'use client';

import { useSections } from '@/lib/queries/useSections';
import { useProject } from '@/lib/queries/useProject';
import { MarkdownRenderer } from '../ui/markdown-renderer';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface PrintViewProps {
  projectId: string;
}

export function PrintView({ projectId }: PrintViewProps) {
  const { data: project } = useProject(projectId);
  const { data: sections = [] } = useSections(projectId);

  // Filter sections that have actual content and sort them
  const validSections = sections
    .filter((s: any) => s.content_markdown && s.content_markdown.length > 5)
    .sort((a: any, b: any) => {
      // Sort by section number (e.g. "1" < "2" < "10")
      const numA = parseInt(a.section_number.split('.')[0]) || 0;
      const numB = parseInt(b.section_number.split('.')[0]) || 0;
      return numA - numB;
    });

  if (!project) return null;

  const printedAt = format(new Date(), 'dd MMMM yyyy HH:mm', { locale: id });

  return (
    <div className="hidden print:block print-container bg-white text-black min-h-screen">
      {/* Repeating Footer for all printed pages */}
      <div 
        className="fixed bottom-0 w-full text-center pb-4 text-[10px] text-gray-400 border-t pt-2"
        style={{ position: 'fixed', bottom: 0 }}
      >
        <p className="font-semibold uppercase tracking-widest text-gray-500">
          Dokumen Resmi - Dihasilkan oleh AI PRD Generator
        </p>
        <p>Dicetak pada: {printedAt} | ID Proyek: {project.id}</p>
      </div>

      {/* Cover Page */}
      <div className="h-[90vh] flex flex-col justify-center items-center text-center px-10">
        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4 font-serif">
          Product Requirements Document
        </h1>
        <h2 className="text-2xl text-purple-700 font-semibold mb-8">
          {project.name}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full mb-8 mx-auto"></div>
        <p className="text-gray-500 max-w-md mx-auto mb-16 text-sm">
          {project.description}
        </p>
        <div className="text-left bg-gray-50 p-6 rounded-xl border border-gray-100 max-w-sm w-full">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Informasi Dokumen</p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Status</span>
              <span className="font-bold text-green-600">DRAFT</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span className="font-medium">Dibuat Tanggal</span>
              <span>{format(new Date(project.created_at), 'dd MMM yyyy', { locale: id })}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="font-medium">Total Bab</span>
              <span>{validSections.length} Bab</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-break-before"></div>

      {/* Document Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {validSections.map((sec: any, index: number) => (
          <div 
            key={sec.id} 
            className={`mb-16 ${index > 0 ? 'page-break-before pt-10' : ''}`}
          >
            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:pb-2">
              <MarkdownRenderer content={sec.content_markdown} />
            </div>
          </div>
        ))}
        
        {validSections.length === 0 && (
          <div className="text-center text-gray-500 italic mt-20">
            Belum ada bab yang disetujui untuk dicetak.
          </div>
        )}
      </div>
      
      {/* Make space for the fixed footer on the last page */}
      <div className="h-20"></div>
    </div>
  );
}
