'use client';

import { useEditorStore } from '@/lib/stores/editor-store';
import { useSections } from '@/lib/queries/useSections';
import { useProject } from '@/lib/queries/useProject';
import { FileText, CheckCircle2, Lock, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionNavigatorProps {
  projectId: string;
}

const SECTIONS = [
  { number: '1', title: 'Executive Summary' },
  { number: '2', title: 'Goals & Scope' },
  { number: '3', title: 'Target Users' },
  { number: '4', title: 'Functional Requirements' },
  { number: '5', title: 'UX & User Flows' },
  { number: '6', title: 'AI/ML Requirements' },
  { number: '7', title: 'Non-Functional Requirements' },
  { number: '8', title: 'Technical Architecture' },
  { number: '9', title: 'Release Strategy' },
  { number: '10', title: 'Risks & Open Questions' },
  { number: '11', title: 'Appendix' },
];

export function SectionNavigator({ projectId }: SectionNavigatorProps) {
  const { activeSectionNumber, setActiveSection } = useEditorStore();
  const { data: project } = useProject(projectId);
  const { data: sections = [] } = useSections(projectId);

  // Helper to check if section has content
  const hasContent = (num: string) => {
    const sec = sections.find((s: any) => s.section_number === num);
    return sec && sec.content_markdown && sec.content_markdown.length > 50;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-4 border-b font-bold text-sm text-gray-900 tracking-tight flex items-center justify-between bg-gray-50/50">
        <span>Daftar Isi PRD</span>
        <span className="text-[10px] bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
          {sections.filter((s: any) => s.content_markdown && s.content_markdown.length > 50).length} / {project?.has_ai_features ? '11' : '10'} Selesai
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {SECTIONS.map((sec) => {
          // If project has AI features false, customize or lock section 6
          const isAiSection = sec.number === '6';
          const isLocked = isAiSection && project && !project.has_ai_features;
          const isActive = activeSectionNumber === sec.number;
          const drafted = hasContent(sec.number);

          return (
            <button
              key={sec.number}
              disabled={isLocked}
              onClick={() => !isLocked && setActiveSection(sec.number)}
              className={cn(
                "w-full text-left flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                isActive 
                  ? "bg-purple-600 text-white shadow-sm font-semibold hover:bg-purple-700" 
                  : isLocked
                    ? "text-gray-400 bg-gray-50/50 cursor-not-allowed opacity-60"
                    : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-2 overflow-hidden mr-1">
                {isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                ) : isActive ? (
                  <Edit3 className="w-3.5 h-3.5 text-white shrink-0" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                )}
                <span className="truncate">
                  {sec.number}. {sec.title} {isLocked && '(Locked)'}
                </span>
              </div>
              
              {!isLocked && drafted && (
                <CheckCircle2 className={cn(
                  "w-3.5 h-3.5 shrink-0 ml-1",
                  isActive ? "text-white" : "text-green-500"
                )} />
              )}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t bg-gray-50/80">
        <button
          onClick={() => {
            // Small delay to ensure any pending UI updates are flushed before printing
            setTimeout(() => {
              window.print();
            }, 100);
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
          Export to PDF
        </button>
      </div>
    </div>
  );
}
