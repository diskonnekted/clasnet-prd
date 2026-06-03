'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useMessages(projectId: string) {
  return useQuery({
    queryKey: ['messages', projectId],
    queryFn: () => api.projects.messages(projectId),
    refetchInterval: 5000, // optionally poll every 5s to keep in sync
  });
}
