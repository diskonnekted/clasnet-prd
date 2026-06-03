import { create } from 'zustand';

interface EditorState {
  // Active context
  activeSectionNumber: string | null;
  activeProjectId: string | null;
  
  // UI states
  isAiSidebarOpen: boolean;
  isSectionNavOpen: boolean;
  selectedText: string | null;
  
  // Streaming state
  isAiGenerating: boolean;
  streamingContent: string;
  currentAction: 'ASK_CLARIFICATION' | 'GENERATE_OUTLINE' | 'GENERATE_SECTION' | 'CRITIQUE_AND_REFINE' | null;
  streamingPayload: any;
  
  // Actions
  setActiveSection: (num: string | null) => void;
  toggleAiSidebar: () => void;
  setSelectedText: (text: string | null) => void;
  startStreaming: (action: EditorState['currentAction']) => void;
  updateStreamingContent: (chunk: string) => void;
  finishStreaming: (payload: any) => void;
  resetStreaming: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeSectionNumber: null,
  activeProjectId: null,
  isAiSidebarOpen: true,
  isSectionNavOpen: true,
  selectedText: null,
  isAiGenerating: false,
  streamingContent: '',
  currentAction: null,
  streamingPayload: null,
  
  setActiveSection: (num) => set({ activeSectionNumber: num }),
  toggleAiSidebar: () => set((s) => ({ isAiSidebarOpen: !s.isAiSidebarOpen })),
  setSelectedText: (text) => set({ selectedText: text }),
  
  startStreaming: (action) => set({
    isAiGenerating: true,
    streamingContent: '',
    currentAction: action,
    streamingPayload: null,
  }),
  
  updateStreamingContent: (chunk) => set((s) => ({
    streamingContent: s.streamingContent + chunk,
  })),
  
  finishStreaming: (payload) => set({
    isAiGenerating: false,
    streamingPayload: payload,
    streamingContent: '',
  }),
  
  resetStreaming: () => set({
    isAiGenerating: false,
    streamingContent: '',
    currentAction: null,
    streamingPayload: null,
  }),
}));
