'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useEditorStore } from '@/lib/stores/editor-store';
import { toast } from 'sonner';

export function useOrchestrator(projectId: string) {
  const queryClient = useQueryClient();
  const { startStreaming, finishStreaming, resetStreaming } = useEditorStore();

  const mutation = useMutation({
    mutationFn: async (data: {
      projectId: string;
      userMessage: string;
      action?: 'ASK_CLARIFICATION' | 'GENERATE_OUTLINE' | 'GENERATE_SECTION' | 'CRITIQUE_AND_REFINE';
      sectionNumber?: string;
      answers?: Record<string, string>;
      conversationId?: string;
    }) => {
      // Set Zustand state to show loading/thinking animation
      const actionType = data.action || 'ASK_CLARIFICATION';
      startStreaming(actionType as any);
      
      const response = await api.orchestrate(data);
      return response;
    },
    onSuccess: (data) => {
      // Update the streaming payload in state
      finishStreaming(data.payload);
      
      // We can set current action in state so the panel renders the correct component
      useEditorStore.setState({ currentAction: data.action });
      
      // Invalidate messages so the new conversation turns are fetched
      queryClient.invalidateQueries({ queryKey: ['messages', projectId] });
      
      toast.success(data.message_to_user || 'Respon AI diterima.');
    },
    onError: (error: any) => {
      resetStreaming();
      toast.error(`Error dari Asisten AI: ${error.message || 'Terjadi kesalahan sistem'}`);
    },
  });

  return {
    sendMessage: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
