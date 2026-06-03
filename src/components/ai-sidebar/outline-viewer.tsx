'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListTodo, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface OutlineItem {
  section: string;
  title: string;
  subsections: string[];
}

interface OutlineViewerProps {
  outline: OutlineItem[];
  projectId: string;
  onApprove: () => void;
}

export function OutlineViewer({ outline, projectId, onApprove }: OutlineViewerProps) {
  const [approved, setApproved] = useState(false);

  const handleApprove = () => {
    setApproved(true);
    onApprove();
  };

  return (
    <div className="space-y-4 bg-white p-4 border rounded-xl shadow-sm mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2.5">
        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-green-900">Rancangan Outline PRD Selesai</h4>
          <p className="text-xs text-green-700 mt-0.5">Asisten AI telah menyusun struktur dokumen 11 bab berdasarkan ide Anda.</p>
        </div>
      </div>

      <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
        {outline.map((item) => (
          <Card key={item.section} className="p-3 border border-gray-100 hover:border-purple-200 transition-colors shadow-none bg-gray-50/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                Bab {item.section}
              </span>
              <h5 className="font-semibold text-sm text-gray-800">{item.title}</h5>
            </div>
            
            {item.subsections && item.subsections.length > 0 && (
              <ul className="mt-2 pl-4 border-l border-purple-200 space-y-1.5">
                {item.subsections.map((sub, i) => (
                  <li key={i} className="text-xs text-gray-600 list-disc list-inside">
                    {sub}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ))}
      </div>

      <Button
        onClick={handleApprove}
        disabled={approved}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition shadow-sm mt-2 flex items-center justify-center gap-2"
      >
        <ListTodo className="w-4 h-4" />
        {approved ? 'Menyiapkan Generasi Bab...' : 'Setujui & Mulai Tulis Bab →'}
      </Button>
    </div>
  );
}
