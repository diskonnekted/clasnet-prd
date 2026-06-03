import { createClient } from '@/lib/supabase/server';
import { cache } from 'react';

export interface ProjectContext {
  project: {
    id: string;
    name: string;
    domain: string;
    has_ai_features: boolean;
    metadata: any;
  };
  prd: {
    id: string;
    title: string;
    outline: any[];
    status: string;
    settings: any;
  } | null;
  sections: Array<{
    section_number: string;
    title: string;
    summary: string | null;
    status: string;
    content_preview: string;
  }>;
  recentMessages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export const buildProjectContext = cache(async (projectId: string): Promise<ProjectContext> => {
  const supabase = await createClient();
  
  // Single efficient query
  const { data: contextData, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      domain,
      has_ai_features,
      metadata,
      prd_documents (
        id,
        title,
        outline,
        status,
        settings,
        prd_sections (
          section_number,
          title,
          summary,
          status,
          content_markdown
        )
      ),
      conversations (
        id,
        conversation_messages (
          role,
          content,
          created_at
        )
      )
    `)
    .eq('id', projectId)
    .is('deleted_at', null)
    .maybeSingle();
  
  if (error || !contextData) {
    throw new Error(`Project ${projectId} not found`);
  }
  
  const prdArray = Array.isArray(contextData.prd_documents) 
    ? contextData.prd_documents 
    : contextData.prd_documents ? [contextData.prd_documents] : [];
    
  const prd = prdArray[0] || null;
  
  // Flatten sections
  const prdSectionsArray = Array.isArray(prd?.prd_sections)
    ? prd.prd_sections
    : prd?.prd_sections ? [prd.prd_sections] : [];
    
  const sections = prdSectionsArray.map((s: any) => ({
    section_number: s.section_number,
    title: s.title,
    summary: s.summary,
    status: s.status,
    content_preview: s.content_markdown?.substring(0, 500) || '',
  }));
  
  // Get active conversation & recent messages
  const convArray = Array.isArray(contextData.conversations)
    ? contextData.conversations
    : contextData.conversations ? [contextData.conversations] : [];
    
  const conversation = convArray.find((c: any) => 
    c.conversation_messages && (
      Array.isArray(c.conversation_messages) 
        ? c.conversation_messages.length > 0 
        : true
    )
  );
  
  const msgArray = Array.isArray(conversation?.conversation_messages)
    ? conversation.conversation_messages
    : conversation?.conversation_messages ? [conversation.conversation_messages] : [];
  
  const recentMessages = msgArray
    .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(0, 10)
    .map((m: any) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));
  
  return {
    project: {
      id: contextData.id,
      name: contextData.name,
      domain: contextData.domain,
      has_ai_features: contextData.has_ai_features,
      metadata: contextData.metadata,
    },
    prd: prd ? {
      id: prd.id,
      title: prd.title,
      outline: prd.outline || [],
      status: prd.status,
      settings: prd.settings,
    } : null,
    sections,
    recentMessages,
  };
});

// Format context untuk prompt
export function formatContextForPrompt(context: ProjectContext): string {
  const parts: string[] = [];
  
  // Project info
  parts.push(`<project_info>
Name: ${context.project.name}
Domain: ${context.project.domain}
Has AI Features: ${context.project.has_ai_features}
Metadata: ${JSON.stringify(context.project.metadata)}
</project_info>`);
  
  // PRD outline
  if (context.prd?.outline?.length) {
    parts.push(`<prd_outline>
${JSON.stringify(context.prd.outline, null, 2)}
</prd_outline>`);
  }
  
  // Sections summary
  if (context.sections.length > 0) {
    const sectionsText = context.sections
      .map(s => `- Section ${s.section_number} (${s.status}): ${s.title}\n  ${s.summary || '[No summary]'}`)
      .join('\n');
    parts.push(`<sections_summary>
${sectionsText}
</sections_summary>`);
  }
  
  // Recent conversation
  if (context.recentMessages.length > 0) {
    const messagesText = context.recentMessages
      .map(m => `[${m.role.toUpperCase()}]: ${m.content}`)
      .join('\n');
    parts.push(`<conversation_history>
${messagesText}
</conversation_history>`);
  }
  
  return parts.join('\n\n');
}
