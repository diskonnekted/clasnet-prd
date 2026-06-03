const BASE_URL = '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || error.message || 'API request failed');
  }
  
  return res.json();
}

export const api = {
  projects: {
    list: () => fetchAPI<any[]>('/projects'),
    create: (data: any) => fetchAPI<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    get: (id: string) => fetchAPI<any>(`/projects/${id}`),
    delete: (id: string) => fetchAPI<any>(`/projects/${id}`, {
      method: 'DELETE',
    }),
    messages: (id: string) => fetchAPI<any[]>(`/projects/${id}/messages`),
  },
  
  sections: {
    list: (projectId: string) => fetchAPI<any[]>(`/projects/${projectId}/sections`),
    get: (projectId: string, sectionNumber: string) =>
      fetchAPI<any>(`/projects/${projectId}/sections/${sectionNumber}`),
    update: (projectId: string, sectionNumber: string, data: any) =>
      fetchAPI<any>(`/projects/${projectId}/sections/${sectionNumber}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },
  
  orchestrate: (data: any) => fetchAPI<any>('/orchestrate', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  critiques: {
    run: (prdId: string) => fetchAPI<any>(`/prd/${prdId}/critique`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),
    list: (prdId: string) => fetchAPI<any[]>(`/prd/${prdId}/critique`),
    applyFix: (critiqueId: string, issueId: string) =>
      fetchAPI<any>(`/critique/${critiqueId}/apply-fix`, {
        method: 'POST',
        body: JSON.stringify({ issueId }),
      }),
    applyAll: (critiqueId: string) =>
      fetchAPI<any>(`/critique/${critiqueId}/apply-fix`, {
        method: 'POST',
        body: JSON.stringify({ applyAll: true }),
      }),
  },
};
