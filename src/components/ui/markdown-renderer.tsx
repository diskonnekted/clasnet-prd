'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // If the content is already HTML (e.g., auto-saved from TipTap editor)
  const isHtml = content && content.trim().startsWith('<') && content.includes('</');

  if (isHtml) {
    return (
      <div 
        className="prose prose-purple prose-sm max-w-none text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Otherwise, it's raw markdown from the AI
  return (
    <div className="prose prose-purple prose-sm max-w-none text-gray-800 leading-relaxed">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
