import { createClient } from '@/lib/supabase/server';

interface GenerationInput {
  projectId: string;
  prdId?: string;
  sectionId?: string;
  provider: string;
  model: string;
  promptType: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  status: 'success' | 'error' | 'timeout';
  errorMessage?: string;
}

const COST_PER_1K_TOKENS: Record<string, { input: number; output: number }> = {
  'claude-3-7-sonnet-20250219': { input: 0.003, output: 0.015 },
  'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
  'gpt-4o': { input: 0.0025, output: 0.01 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
};

export async function trackAIGeneration(input: GenerationInput) {
  try {
    const supabase = await createClient();
    
    const { input: inputCost, output: outputCost } = 
      COST_PER_1K_TOKENS[input.model] || { input: 0, output: 0 };
    
    const costUsd = 
      (input.inputTokens / 1000) * inputCost +
      (input.outputTokens / 1000) * outputCost;
    
    const { error } = await supabase
      .from('ai_generations')
      .insert({
        project_id: input.projectId,
        prd_id: input.prdId,
        provider: input.provider,
        model: input.model,
        prompt_type: input.promptType,
        input_tokens: input.inputTokens,
        output_tokens: input.outputTokens,
        cost_usd: costUsd,
        latency_ms: input.latencyMs,
        status: input.status,
        error_message: input.errorMessage,
      });
    
    if (error) {
      console.error('Failed to track AI generation:', error);
    }
  } catch (err) {
    console.error('Failed to track AI generation:', err);
  }
}

export async function getProjectCost(projectId: string): Promise<number> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('ai_generations')
      .select('cost_usd')
      .eq('project_id', projectId)
      .eq('status', 'success');
    
    if (error) {
      console.error('Failed to get project cost:', error);
      return 0;
    }
    
    return data.reduce((sum, gen) => sum + (parseFloat(gen.cost_usd) || 0), 0);
  } catch (err) {
    console.error('Failed to get project cost:', err);
    return 0;
  }
}
