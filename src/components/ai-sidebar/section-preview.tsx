'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditorStore } from '@/lib/stores/editor-store';
import { api } from '@/lib/api';
import { MarkdownRenderer } from '../ui/markdown-renderer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Check, Edit2, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface SectionPreviewProps {
  sectionNumber: string;
  title: string;
  content: string;
  projectId: string;
  onGenerateNext?: (currentSec: string) => void;
}

export function SectionPreview({ 
  sectionNumber, 
  title, 
  content, 
  projectId,
  onGenerateNext
}: SectionPreviewProps) {
  const queryClient = useQueryClient();
  
  const { setActiveSection } = useEditorStore();
  
  const insertToEditor = useMutation({
    mutationFn: () => api.sections.update(projectId, sectionNumber, {
      content_markdown: content,
      title: title,
      status: 'draft'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections', projectId] });
      queryClient.invalidateQueries({ queryKey: ['section', projectId, sectionNumber] });
      
      // Set this section as active so the editor switches to it
      setActiveSection(sectionNumber);
      
      // Dispatch scroll-to-section event so TipTap can update if it was already active
      window.dispatchEvent(
        new CustomEvent('scroll-to-section', { detail: { sectionNumber, content } })
      );
      
      toast.success(`Bab ${sectionNumber} (${title}) berhasil dimasukkan ke editor!`);
    },
    onError: (err: any) => {
      toast.error(`Gagal memasukkan bab ke editor: ${err.message}`);
    }
  });
  
  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-3 border-b flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-600">
            Bab {sectionNumber}
          </span>
          <h4 className="font-bold text-sm text-gray-900">{title}</h4>
        </div>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Ready
        </span>
      </div>
      
      <div className="max-h-64 overflow-y-auto p-4 border-b bg-gray-50/20">
        <MarkdownRenderer content={content} />
      </div>
      
      <div className="p-3 flex gap-2 bg-gray-50/50 flex-col sm:flex-row">
        <Button
          onClick={() => insertToEditor.mutate()}
          disabled={insertToEditor.isPending}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 transition-all"
        >
          {insertToEditor.isPending ? (
            <>⏳ Memasukkan...</>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" /> Masukkan ke Dokumen
            </>
          )}
        </Button>
        {onGenerateNext && (
          <Button
            variant="outline"
            onClick={() => onGenerateNext(sectionNumber)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5"
          >
            Lanjut Bab Berikutnya
          </Button>
        )}
      </div>
    </div>
  );
}
