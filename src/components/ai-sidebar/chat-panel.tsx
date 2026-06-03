'use client';

import { useEditorStore } from '@/lib/stores/editor-store';
import { useOrchestrator } from '@/lib/queries/useOrchestrator';
import { useMessages } from '@/lib/queries/useMessages';
import { QuestionForm } from './question-form';
import { OutlineViewer } from './outline-viewer';
import { SectionPreview } from './section-preview';
import { ChatInput } from './chat-input';
import { MessageBubble } from './message-bubble';
import { Bot, Sparkles } from 'lucide-react';
import { useRef, useEffect } from 'react';

interface ChatPanelProps {
  projectId: string;
}

export function ChatPanel({ projectId }: ChatPanelProps) {
  const { sendMessage, isLoading } = useOrchestrator(projectId);
  const { data: messages = [], isLoading: isLoadingMessages } = useMessages(projectId);
  const { isAiGenerating, streamingContent, streamingPayload, currentAction } = useEditorStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiGenerating, streamingPayload]);

  const handleSend = async (message: string) => {
    await sendMessage({
      projectId,
      userMessage: message,
    });
  };

  const handleApproveOutline = async () => {
    await sendMessage({
      projectId,
      userMessage: 'Outline disetujui. Silakan buat bab pertama (Bab 1).',
      action: 'GENERATE_SECTION',
      sectionNumber: '1',
    });
  };

  const handleAnswerSubmit = async (answers: Record<string, string>) => {
    const formattedMessage = Object.entries(answers)
      .map(([key, val]) => `[JAWABAN ${key}]: ${val}`)
      .join('\n');
      
    await sendMessage({
      projectId,
      userMessage: `Saya telah menjawab pertanyaan klarifikasi:\n${formattedMessage}`,
      answers,
      action: 'GENERATE_OUTLINE',
    });
  };

  const handleGenerateNext = async (currentSection: string) => {
    const nextSec = parseInt(currentSection) + 1;
    await sendMessage({
      projectId,
      userMessage: `Bab ${currentSection} sudah selesai, tolong lanjut kerjakan dan hasilkan bab berikutnya.`,
      action: 'GENERATE_SECTION',
      sectionNumber: nextSec.toString()
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-l border-gray-200">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">PM AI Assistant</h3>
            <p className="text-[10px] text-green-600 flex items-center gap-1 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              orchestrator-active
            </p>
          </div>
        </div>
      </div>
      
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages && messages.length === 0 ? (
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 animate-pulse rounded-lg w-2/3"></div>
            <div className="h-14 bg-gray-200 animate-pulse rounded-lg w-5/6"></div>
          </div>
        ) : (
          messages.map((msg: any) => (
            <div key={msg.id} className="space-y-2">
              <MessageBubble message={msg} />
              
              {/* If message contains custom action payload, display the corresponding Action Card */}
              {msg.role === 'assistant' && msg.action_type && msg.payload && (
                <ActionCard 
                  action={msg.action_type} 
                  payload={msg.payload} 
                  projectId={projectId}
                  onApproveOutline={handleApproveOutline}
                  onSubmitAnswers={handleAnswerSubmit}
                  onGenerateNext={handleGenerateNext}
                />
              )}
            </div>
          ))
        )}
        
        {/* Streaming State */}
        {isAiGenerating && currentAction && (
          <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm animate-pulse">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-purple-600">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              AI sedang {getActionLabel(currentAction)}...
            </div>
            {streamingContent && (
              <div className="text-xs text-gray-600 font-mono bg-gray-50 p-2.5 rounded border border-dashed">
                {streamingContent}
              </div>
            )}
          </div>
        )}
        
        {/* Helper when no messages exist */}
        {messages.length === 0 && !isAiGenerating && (
          <div className="text-center text-gray-500 text-xs py-10 px-4 bg-white/50 border border-dashed rounded-xl">
            <Bot className="w-8 h-8 mx-auto text-purple-400 mb-2.5" />
            <p className="font-semibold text-gray-700">Mulai Kolaborasi Anda</p>
            <p className="mt-1 text-[11px] text-gray-500 leading-normal">
              Masukkan ide produk kasar Anda di input box di bawah (misalnya: "Saya ingin membuat aplikasi monitoring sensor IoT").
            </p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <div className="p-4 bg-white border-t">
        <ChatInput 
          onSend={handleSend} 
          disabled={isLoading || isAiGenerating}
        />
      </div>
    </div>
  );
}

function getActionLabel(action: string) {
  switch (action) {
    case 'ASK_CLARIFICATION': return 'menganalisis ide';
    case 'GENERATE_OUTLINE': return 'menyusun outline PRD';
    case 'GENERATE_SECTION': return 'menulis bab dokumen';
    case 'CRITIQUE_AND_REFINE': return 'mereview kualitas bab';
    default: return 'berpikir';
  }
}

interface ActionCardProps {
  action: string;
  payload: any;
  projectId: string;
  onApproveOutline: () => void;
  onSubmitAnswers: (answers: Record<string, string>) => void;
  onGenerateNext: (currentSec: string) => void;
}

function ActionCard({ action, payload, projectId, onApproveOutline, onSubmitAnswers, onGenerateNext }: ActionCardProps) {
  switch (action) {
    case 'ASK_CLARIFICATION':
      return payload?.questions?.length > 0 ? (
        <QuestionForm 
          questions={payload.questions} 
          projectId={projectId} 
          onSubmitAnswers={onSubmitAnswers} 
        />
      ) : null;
    case 'GENERATE_OUTLINE':
      return payload?.outline?.length > 0 ? (
        <OutlineViewer 
          outline={payload.outline} 
          projectId={projectId} 
          onApprove={onApproveOutline} 
        />
      ) : null;
    case 'GENERATE_SECTION':
      return payload?.content_markdown ? (
        <SectionPreview
          sectionNumber={payload.section_number || '1'}
          title={payload.section_title || 'Bab Baru'}
          content={payload.content_markdown}
          projectId={projectId}
          onGenerateNext={onGenerateNext}
        />
      ) : null;
    default:
      return null;
  }
}
