'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEditorStore } from '@/lib/stores/editor-store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionFormProps {
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple_choice' | 'short_text';
    options: string[] | null;
  }>;
  projectId: string;
  onSubmitAnswers: (answers: Record<string, string>) => void;
}

export function QuestionForm({ questions, projectId, onSubmitAnswers }: QuestionFormProps) {
  // Build Zod validation schema dynamically based on questions
  const schemaFields: Record<string, any> = {};
  questions.forEach((q) => {
    schemaFields[q.id] = z.string().min(1, 'Jawaban wajib diisi');
  });
  
  const schema = z.object(schemaFields);
  
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<any>({
    resolver: zodResolver(schema),
  });
  
  const onSubmit = (data: any) => {
    onSubmitAnswers(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 border rounded-xl shadow-sm mt-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
        <p className="text-xs text-purple-900 font-semibold flex items-center gap-2">
          <span>💡</span> AI membutuhkan detail tambahan berikut:
        </p>
      </div>
      
      {questions.map((q) => {
        const value = watch(q.id);
        
        return (
          <div key={q.id} className="space-y-2 border-b pb-4 last:border-0 last:pb-0">
            <label className="block text-sm font-semibold text-gray-800">
              {q.question}
            </label>
            
            {q.type === 'multiple_choice' ? (
              <RadioGroup 
                value={value || ''}
                onValueChange={(val) => setValue(q.id, val, { shouldValidate: true })}
                className="space-y-2 mt-2"
              >
                {q.options?.map((opt) => (
                  <div key={opt} className="flex items-center space-x-2">
                    <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                    <Label htmlFor={`${q.id}-${opt}`} className="text-sm font-normal cursor-pointer select-none">
                      {opt}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Textarea
                {...register(q.id)}
                rows={2}
                className="w-full border rounded-lg p-2 text-sm focus:ring-purple-500 focus:border-purple-500 bg-gray-50/50"
                placeholder="Tulis detail jawaban Anda di sini..."
              />
            )}
            
            {errors[q.id] && (
              <p className="text-xs text-red-600 font-medium">{(errors[q.id] as any).message}</p>
            )}
          </div>
        );
      })}
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition shadow-sm mt-2"
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Jawaban →'}
      </Button>
    </form>
  );
}
