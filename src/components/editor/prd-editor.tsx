'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditorStore } from '@/lib/stores/editor-store';
import { api } from '@/lib/api';
import { debounce } from 'lodash';
import { useEffect, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { marked } from 'marked';

interface PrdEditorProps {
  projectId: string;
  sectionNumber: string;
  initialContent: string;
}

const parseContent = (content: string) => {
  if (!content) return '';
  // If it's already HTML (e.g., from TipTap auto-save), return as is
  if (content.trim().startsWith('<') && content.includes('</')) {
    return content;
  }
  // Otherwise, it's raw markdown from the AI, so parse it to HTML
  return marked.parse(content, { async: false }) as string;
};

export function PrdEditor({ projectId, sectionNumber, initialContent }: PrdEditorProps) {
  const { setActiveSection } = useEditorStore();
  
  // Use refs to make sure the debounced function always accesses the latest props
  const stateRef = useRef({ projectId, sectionNumber });
  useEffect(() => {
    stateRef.current = { projectId, sectionNumber };
  }, [projectId, sectionNumber]);

  const saveContent = useRef(
    debounce(async (content: string, currentProjId: string, currentSecNum: string) => {
      try {
        await api.sections.update(currentProjId, currentSecNum, {
          content_markdown: content, // We save HTML back to the database so it renders perfectly next time
        });
        console.log(`Saved section ${currentSecNum} successfully.`);
      } catch (err: any) {
        console.error('Failed to auto-save section:', err);
        toast.error('Gagal menyimpan otomatis dokumen. Silakan periksa jaringan.');
      }
    }, 1000)
  ).current;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder: 'Mulai tulis di sini, atau gunakan asisten AI untuk mengisi bab ini...',
      }),
    ],
    content: parseContent(initialContent),
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[600px] p-8',
      },
    },
    onUpdate: ({ editor }) => {
      if (editor.isDestroyed) return;
      const content = editor.getHTML();
      const { projectId: currentProjId, sectionNumber: currentSecNum } = stateRef.current;
      saveContent(content, currentProjId, currentSecNum);
    },
  });
  
  // Sync editor content when initialContent changes from the server
  useEffect(() => {
    if (editor && initialContent) {
      const parsed = parseContent(initialContent);
      if (parsed !== editor.getHTML()) {
        editor.commands.setContent(parsed);
      }
    }
  }, [initialContent, editor]);
  
  // Sync editor content when a section is approved from the sidebar
  useEffect(() => {
    const handleScrollToSection = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { sectionNumber: approvedSecNum, content: approvedContent } = customEvent.detail;
      
      if (approvedSecNum === sectionNumber && editor) {
        editor.commands.setContent(parseContent(approvedContent));
      }
    };

    window.addEventListener('scroll-to-section', handleScrollToSection);
    return () => {
      window.removeEventListener('scroll-to-section', handleScrollToSection);
    };
  }, [sectionNumber, editor]);
  
  useEffect(() => {
    setActiveSection(sectionNumber);
  }, [sectionNumber, setActiveSection]);
  
  if (!editor) return null;
  
  return (
    <div className="relative border rounded-xl shadow-sm bg-white overflow-hidden">
      <div className="bg-gray-50 border-b px-4 py-2 text-xs font-semibold text-gray-500 flex items-center justify-between">
        <span>KOLABORASI EDITING - BAB {sectionNumber}</span>
        <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">Auto-Save Aktif</span>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
