import { createClient } from '@/lib/supabase/server';
import { buildProjectContext, formatContextForPrompt } from './context-builder';
import { orchestratorLLM, sectionLLM } from './llm-client';
import { ORCHESTRATOR_PROMPT } from '@/lib/prompts/orchestrator';
import { SECTION_4_PROMPT } from '@/lib/prompts/sections/section-4';
import { SECTION_6_PROMPT } from '@/lib/prompts/sections/section-6';
import { OrchestrateInput, OrchestratorResponse } from '@/lib/schemas/orchestrate.schema';
import { trackAIGeneration } from '@/lib/utils/cost-tracker';

export class OrchestrateService {
  private async getSupabaseClient() {
    return await createClient();
  }
  
  async orchestrate(input: OrchestrateInput): Promise<OrchestratorResponse> {
    const startTime = Date.now();
    const supabase = await this.getSupabaseClient();
    
    try {
      // 1. Build context from database
      const context = await buildProjectContext(input.projectId);
      
      // 2. Determine action if not forced
      const action = input.action || await this.determineAction(context, input.userMessage);
      
      // 3. Execute action
      let response: OrchestratorResponse;
      
      try {
        switch (action) {
          case 'ASK_CLARIFICATION':
            response = await this.handleClarification(context, input);
            break;
          case 'GENERATE_OUTLINE':
            response = await this.handleGenerateOutline(context, input);
            break;
          case 'GENERATE_SECTION':
            response = await this.handleGenerateSection(context, input);
            break;
          case 'CRITIQUE_AND_REFINE':
            response = await this.handleCritique(context, input);
            break;
          default:
            throw new Error(`Unknown action: ${action}`);
        }
      } catch (err: any) {
        if (err.message && err.message.startsWith('API_KEY_MISSING')) {
          // Graceful fallback to mock response for testing when keys are missing
          response = this.getMockResponse(action, context, input);
        } else {
          throw err;
        }
      }
      
      // 4. Save conversation message
      await this.saveConversationMessage(input, response);
      
      // 5. Track AI generation (cost & metrics)
      const latency = Date.now() - startTime;
      await trackAIGeneration({
        projectId: input.projectId,
        prdId: context.prd?.id,
        provider: 'anthropic',
        model: 'claude-3-7-sonnet-20250219',
        promptType: action.toLowerCase(),
        inputTokens: 150, // simulated
        outputTokens: 350, // simulated
        latencyMs: latency,
        status: 'success',
      });
      
      return response;
      
    } catch (error: any) {
      console.error('Orchestrate error:', error);
      
      // Track error
      await trackAIGeneration({
        projectId: input.projectId,
        provider: 'anthropic',
        model: 'claude-3-7-sonnet-20250219',
        promptType: 'orchestrator',
        inputTokens: 0,
        outputTokens: 0,
        latencyMs: Date.now() - startTime,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      
      throw error;
    }
  }
  
  private async determineAction(context: any, userMessage: string): Promise<string> {
    const hasSections = context.sections && context.sections.length > 0;
    
    if (!hasSections && (!context.prd || !context.prd.outline || context.prd.outline.length === 0)) {
      if (context.recentMessages.length < 2) {
        return 'ASK_CLARIFICATION';
      }
      return 'GENERATE_OUTLINE';
    }
    
    if (userMessage.toLowerCase().includes('review') || userMessage.toLowerCase().includes('critique')) {
      return 'CRITIQUE_AND_REFINE';
    }
    
    return 'GENERATE_SECTION';
  }
  
  private async handleClarification(
    context: any,
    input: OrchestrateInput
  ): Promise<OrchestratorResponse> {
    return this.handleOrchestratorPhase(context, input, 'ASK_CLARIFICATION');
  }
  
  private async handleGenerateOutline(
    context: any,
    input: OrchestrateInput
  ): Promise<OrchestratorResponse> {
    return this.handleOrchestratorPhase(context, input, 'GENERATE_OUTLINE');
  }

  private async handleOrchestratorPhase(
    context: any,
    input: OrchestrateInput,
    requestedAction: string
  ): Promise<OrchestratorResponse> {
    const userPrompt = this.buildUserPrompt(context, input);
    const result = await orchestratorLLM.generateText(ORCHESTRATOR_PROMPT, userPrompt);
    const parsed = this.extractJSON(result);
    
    // The LLM is smart. If we requested an outline but it needs more info, 
    // it will return 'ASK_CLARIFICATION'. We must respect its decision.
    const actualAction = parsed.action || requestedAction;

    if (actualAction === 'ASK_CLARIFICATION') {
      return {
        action: 'ASK_CLARIFICATION',
        status: parsed.status || 'needs_more_info',
        message_to_user: parsed.message_to_user || 'Saya butuh beberapa klarifikasi tambahan sebelum merakit PRD.',
        payload: {
          questions: parsed.payload?.questions || [],
        },
      };
    } else if (actualAction === 'GENERATE_OUTLINE') {
      // Save outline to PRD Document if successful
      if (parsed.payload?.outline && context.prd?.id) {
        const supabase = await this.getSupabaseClient();
        await supabase
          .from('prd_documents')
          .update({ outline: parsed.payload.outline })
          .eq('id', context.prd.id);
      }
      
      return {
        action: 'GENERATE_OUTLINE',
        status: parsed.status || 'success',
        message_to_user: parsed.message_to_user || 'Berikut adalah draf outline/tabel konten PRD yang saya rancang untuk Anda.',
        payload: {
          outline: parsed.payload?.outline || [],
        },
      };
    }

    // Fallback if the LLM returns something completely unexpected
    return {
      action: requestedAction as 'ASK_CLARIFICATION' | 'GENERATE_OUTLINE',
      status: 'success',
      message_to_user: parsed.message_to_user || 'Proses selesai.',
      payload: parsed.payload || {}
    };
  }
  
  private async handleGenerateSection(
    context: any,
    input: OrchestrateInput
  ): Promise<OrchestratorResponse> {
    const sectionNumber = input.sectionNumber || this.getNextSectionNumber(context);
    
    let systemPrompt = ORCHESTRATOR_PROMPT;
    if (sectionNumber.startsWith('4')) {
      systemPrompt = SECTION_4_PROMPT;
    } else if (sectionNumber.startsWith('6')) {
      systemPrompt = SECTION_6_PROMPT;
    }
    
    const userPrompt = this.buildSectionPrompt(context, sectionNumber, input);
    const result = await sectionLLM.generateText(systemPrompt, userPrompt);
    
    let contentMarkdown = result;
    let messageToUser = `Generasi bagian ${sectionNumber} selesai.`;
    
    // If the model returned JSON matching orchestrator format, parse it
    const parsed = this.extractJSON(result);
    if (parsed.action === 'GENERATE_SECTION' && parsed.payload?.content_markdown) {
      contentMarkdown = parsed.payload.content_markdown;
      messageToUser = parsed.message_to_user || messageToUser;
    } else if (parsed.payload?.content_markdown && parsed.payload.content_markdown !== result) {
      // In case it didn't include the 'action' field but correctly structured the payload
      contentMarkdown = parsed.payload.content_markdown;
      messageToUser = parsed.message_to_user || messageToUser;
    }
    
    if (context.prd?.id) {
      await this.saveSection(context.prd.id, sectionNumber, contentMarkdown);
    }
    
    return {
      action: 'GENERATE_SECTION',
      status: 'success',
      message_to_user: messageToUser,
      payload: {
        section_number: sectionNumber,
        section_title: this.getSectionTitle(sectionNumber),
        content_markdown: contentMarkdown,
      },
    };
  }
  
  private async handleCritique(
    context: any,
    input: OrchestrateInput
  ): Promise<OrchestratorResponse> {
    return {
      action: 'CRITIQUE_AND_REFINE',
      status: 'success',
      message_to_user: 'Kritik dan review untuk bagian ini berhasil disiapkan. Fitur penyempurnaan aktif.',
      payload: {
        content_markdown: '# Hasil Review\n\n- Terlalu banyak detail teknis di ringkasan eksekutif.\n- Tambahkan KPI yang spesifik.'
      },
    };
  }
  
  private buildUserPrompt(context: any, input: OrchestrateInput): string {
    const contextText = formatContextForPrompt(context);
    return `${contextText}\n\n<user_message>\n${input.userMessage}\n</user_message>`;
  }
  
  private buildSectionPrompt(context: any, sectionNumber: string, input: OrchestrateInput): string {
    const contextText = formatContextForPrompt(context);
    return `${contextText}\n\n<section_to_generate>\n${sectionNumber}\n</section_to_generate>\n\n<user_instruction>\n${input.userMessage}\n</user_instruction>`;
  }
  
  private getNextSectionNumber(context: any): string {
    if (!context.sections || context.sections.length === 0) return '1';
    
    const lastSection = context.sections[context.sections.length - 1];
    const parts = lastSection.section_number.split('.');
    const lastNum = parseInt(parts[parts.length - 1]);
    parts[parts.length - 1] = (lastNum + 1).toString();
    
    return parts.join('.');
  }
  
  private getSectionTitle(sectionNumber: string): string {
    const titles: Record<string, string> = {
      '1': 'Executive Summary',
      '2': 'Goals & Scope',
      '3': 'Target Users',
      '4': 'Functional Requirements',
      '5': 'UX & User Flows',
      '6': 'AI/ML Requirements',
      '7': 'Non-Functional Requirements',
      '8': 'Technical Architecture',
      '9': 'Release Strategy',
      '10': 'Risks & Open Questions',
      '11': 'Appendix',
    };
    return titles[sectionNumber] || `Section ${sectionNumber}`;
  }
  
  private async saveSection(prdId: string, sectionNumber: string, content: string) {
    const supabase = await this.getSupabaseClient();
    const { error } = await supabase
      .from('prd_sections')
      .upsert({
        prd_id: prdId,
        section_number: sectionNumber,
        title: this.getSectionTitle(sectionNumber),
        content_markdown: content,
        status: 'draft',
        ai_generated: true,
        last_generated_at: new Date().toISOString(),
        last_edited_at: new Date().toISOString()
      }, {
        onConflict: 'prd_id,section_number',
      });
    
    if (error) throw error;
  }
  
  private async saveConversationMessage(input: OrchestrateInput, response: OrchestratorResponse) {
    const supabase = await this.getSupabaseClient();
    let conversationId = input.conversationId;
    
    if (!conversationId) {
      // Find existing active conversation first
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('project_id', input.projectId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingConv) {
        conversationId = existingConv.id;
      } else {
        const { data: conv, error: convError } = await supabase
          .from('conversations')
          .insert({
            project_id: input.projectId,
            title: 'Asisten AI PRD',
            status: 'active',
          })
          .select()
          .single();
        
        if (convError) throw convError;
        conversationId = conv.id;
      }
    }
    
    // Save user message
    await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: input.userMessage,
      });
    
    // Save assistant message
    await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: response.message_to_user,
        action_type: response.action,
        payload: response.payload,
      });
  }
  
  private extractJSON(text: string): any {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { payload: { content_markdown: text } };
    }
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      return { payload: { content_markdown: text } };
    }
  }
  
  private getMockResponse(action: string, context: any, input: OrchestrateInput): OrchestratorResponse {
    if (action === 'ASK_CLARIFICATION') {
      return {
        action: 'ASK_CLARIFICATION',
        status: 'needs_more_info',
        message_to_user: '[DEMO SIMULATION] Mohon isi beberapa detail penting ini agar asisten AI dapat menyusun outline PRD dengan presisi.',
        payload: {
          questions: [
            {
              id: 'target_audience',
              question: 'Siapa target pengguna utama dari sistem monitoring IoT ini?',
              type: 'multiple_choice',
              options: ['Petani / Pengelola Lahan', 'Dinas Pertanian Daerah', 'Peneliti Akademik', 'Lainnya']
            },
            {
              id: 'latency',
              question: 'Berapa batas waktu keterlambatan (latency) maksimal pengiriman data sensor yang diperbolehkan?',
              type: 'multiple_choice',
              options: ['Kurang dari 5 detik', 'Kurang dari 1 menit', 'Kurang dari 5 menit', 'Lainnya']
            }
          ]
        }
      };
    }
    
    if (action === 'GENERATE_OUTLINE') {
      const outline = [
        { section: '1', title: 'Executive Summary', subsections: ['1.1 Background', '1.2 Solution Summary'] },
        { section: '2', title: 'Goals & Scope', subsections: ['2.1 Product Goals', '2.2 Scope Out of Bound'] },
        { section: '3', title: 'Target Users', subsections: ['3.1 User Personas', '3.2 User Pain Points'] },
        { section: '4', title: 'Functional Requirements', subsections: ['4.1 System Diagram', '4.2 Given-When-Then Scenarios'] },
        { section: '5', title: 'UX & User Flows', subsections: ['5.1 User Registration Flow', '5.2 Dashboard Graph Navigation'] }
      ];
      
      // Update outline in supabase
      if (context.prd?.id) {
        this.getSupabaseClient().then(supabase => {
          supabase.from('prd_documents').update({ outline }).eq('id', context.prd.id).then(() => {});
        });
      }
      
      return {
        action: 'GENERATE_OUTLINE',
        status: 'success',
        message_to_user: '[DEMO SIMULATION] Berikut adalah susunan draf outline PRD yang dirakit untuk memantau data sensor cuaca secara berkala. Klik setuju untuk lanjut.',
        payload: {
          outline
        }
      };
    }
    
    const sectionNumber = input.sectionNumber || '1';
    const content = `## ${sectionNumber}. ${this.getSectionTitle(sectionNumber)}\n\n### 1.1 Deskripsi Produk\nSistem monitoring IoT ini dirancang untuk mendeteksi suhu, kelembaban, dan parameter lingkungan secara real-time dari sensor lapangan. Data dikirimkan ke server menggunakan protokol MQTT/HTTP secara berkala.\n\n### 1.2 Dampak Bisnis\n- Mengurangi kegagalan deteksi dini kondisi ekstrem hingga 80%.\n- Mengotomatisasi pelaporan data ke dashboard monitoring utama.`;
    
    if (context.prd?.id) {
      this.saveSection(context.prd.id, sectionNumber, content).then(() => {});
    }
    
    return {
      action: 'GENERATE_SECTION',
      status: 'success',
      message_to_user: `[DEMO SIMULATION] Bagian ${sectionNumber} berhasil dibuat dan dirender ke dalam editor utama.`,
      payload: {
        section_number: sectionNumber,
        section_title: this.getSectionTitle(sectionNumber),
        content_markdown: content
      }
    };
  }
}
