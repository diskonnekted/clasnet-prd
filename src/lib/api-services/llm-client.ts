import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, StreamTextResult } from 'ai';

export type LLMProvider = 'anthropic' | 'openai' | 'google';

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

const DEFAULT_CONFIG: LLMConfig = {
  provider: 'anthropic',
  model: 'claude-3-7-sonnet-20250219',
  temperature: 0.3,
  maxTokens: 4096,
};

export class LLMClient {
  private config: LLMConfig;
  
  constructor(config: Partial<LLMConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  async streamText(
    systemPrompt: string,
    userMessage: string
  ): Promise<StreamTextResult<any, any>> {
    const { provider, model, temperature, maxTokens } = this.config;
    
    let hasKey = false;
    if (provider === 'anthropic') hasKey = !!process.env.ANTHROPIC_API_KEY;
    else if (provider === 'openai') hasKey = !!process.env.OPENAI_API_KEY;
    else if (provider === 'google') hasKey = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      
    if (!hasKey) {
      console.warn(`[WARNING] LLM Provider ${provider} API Key is missing. Falling back to simulated response.`);
      throw new Error(`API_KEY_MISSING:${provider}`);
    }
    
    let modelInstance;
    
    if (provider === 'anthropic') {
      const anthropic = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        baseURL: process.env.ANTHROPIC_BASE_URL || 'https://api.deepseek.com/anthropic',
      });
      modelInstance = anthropic(model);
    } else if (provider === 'openai') {
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL || 'https://api.groq.com/openai/v1',
      });
      modelInstance = openai(model);
    } else if (provider === 'google') {
      const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
      modelInstance = google(model);
    } else {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    const result = streamText({
      model: modelInstance,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature,
      maxOutputTokens: maxTokens,
    });
    
    return result;
  }
  
  async generateText(systemPrompt: string, userMessage: string): Promise<string> {
    try {
      const result = await this.streamText(systemPrompt, userMessage);
      let fullText = '';
      
      for await (const chunk of result.textStream) {
        fullText += chunk;
      }
      
      if (!fullText || fullText.trim() === '') {
        throw new Error('LLM_EMPTY_RESPONSE: The AI model returned an empty response. This is usually caused by API rate limits, invalid keys, or provider outages.');
      }
      
      return fullText;
    } catch (err: any) {
      console.error('[LLMClient] Error generating text:', err.message);
      if (err.message && err.message.startsWith('API_KEY_MISSING')) {
        // Fallback simulated response
        return JSON.stringify({
          action: 'ASK_CLARIFICATION',
          status: 'needs_more_info',
          message_to_user: '[SIMULATED AI]: API Key Anda belum diatur di .env.local! Anda melihat respons simulasi ini untuk demo. Silakan masukkan ide produk Anda di bawah.',
          payload: {
            questions: [
              {
                id: 'target_audience',
                question: 'Siapa target pengguna utama untuk aplikasi ini?',
                type: 'short_text',
                options: null
              },
              {
                id: 'primary_goal',
                question: 'Apa tujuan utama dari aplikasi yang ingin Anda bangun ini?',
                type: 'multiple_choice',
                options: ['Meningkatkan efisiensi kerja', 'Menghasilkan pendapatan langsung', 'Membangun portofolio', 'Lainnya']
              }
            ]
          }
        });
      }
      throw err;
    }
  }
}

// Singleton instances
export const orchestratorLLM = new LLMClient({
  provider: (process.env.DEFAULT_LLM_PROVIDER as LLMProvider) || 'anthropic',
  model: process.env.DEFAULT_LLM_MODEL || 'claude-3-7-sonnet-20250219',
  temperature: 0.3,
  maxTokens: 4096,
});

export const sectionLLM = new LLMClient({
  provider: (process.env.DEFAULT_LLM_PROVIDER as LLMProvider) || 'anthropic',
  model: process.env.DEFAULT_LLM_MODEL || 'claude-3-7-sonnet-20250219',
  temperature: 0.2,
  maxTokens: 8192,
});
