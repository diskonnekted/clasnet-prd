'use client';

import React from 'react';
import { useEditorStore } from '@/lib/stores/editor-store';
import { SectionNavigator } from '@/components/editor/section-navigator';
import { ChatPanel } from '@/components/ai-sidebar/chat-panel';
import { PrintView } from '@/components/projects/print-view';

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { isAiSidebarOpen, isSectionNavOpen } = useEditorStore();

  return (
    <>
      <PrintView projectId={id} />
      
      <div className="flex h-full w-full overflow-hidden no-print">
        {/* Kolom Kiri: Section Navigator */}
        {isSectionNavOpen && (
          <aside className="w-64 border-r bg-white flex-shrink-0 flex flex-col overflow-hidden">
            <SectionNavigator projectId={id} />
          </aside>
        )}

        {/* Kolom Tengah: Editor (Children) */}
        <div className="flex-1 overflow-y-auto bg-gray-50 relative">
          <div className="max-w-4xl mx-auto py-8 px-4">
            {children}
          </div>
        </div>

        {/* Kolom Kanan: AI Assistant Sidebar */}
        {isAiSidebarOpen && (
          <aside className="w-[400px] border-l bg-white flex-shrink-0 flex flex-col">
            <ChatPanel projectId={id} />
          </aside>
        )}
      </div>
    </>
  );
}
