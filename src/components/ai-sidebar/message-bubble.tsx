'use client';

interface MessageBubbleProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[85%] rounded-lg px-4 py-2 text-sm ${
          isUser 
            ? 'bg-purple-600 text-white rounded-br-none' 
            : 'bg-white border text-gray-800 rounded-bl-none shadow-sm'
        }`}
      >
        {!isUser && (
          <div className="font-semibold text-xs mb-1 text-gray-500">AI Assistant</div>
        )}
        <div className="whitespace-pre-wrap">{message.content}</div>
      </div>
    </div>
  );
}
