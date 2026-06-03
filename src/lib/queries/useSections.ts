'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useSections(projectId: string) {
  return useQuery({
    queryKey: ['sections', projectId],
    queryFn: () => api.sections.list(projectId),
  });
}
