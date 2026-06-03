'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useSection(projectId: string, sectionNumber: string | null) {
  return useQuery({
    queryKey: ['section', projectId, sectionNumber],
    queryFn: () => {
      if (!sectionNumber) return null;
      return api.sections.get(projectId, sectionNumber);
    },
    enabled: !!sectionNumber,
  });
}
