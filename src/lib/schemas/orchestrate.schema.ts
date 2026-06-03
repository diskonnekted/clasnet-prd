import { z } from 'zod';

export const OrchestrateActionSchema = z.enum([
  'ASK_CLARIFICATION',
  'GENERATE_OUTLINE',
  'GENERATE_SECTION',
  'CRITIQUE_AND_REFINE',
]);

export const OrchestrateInputSchema = z.object({
  projectId: z.string().uuid(),
  userMessage: z.string().min(1).max(5000),
  action: OrchestrateActionSchema.optional(),
  sectionNumber: z.string().optional(),
  answers: z.record(z.string(), z.string()).optional(),
  conversationId: z.string().uuid().optional(),
});

export type OrchestrateInput = z.infer<typeof OrchestrateInputSchema>;

export const ClarificationQuestionSchema = z.object({
  id: z.string(),
  question: z.string(),
  type: z.enum(['multiple_choice', 'short_text']),
  options: z.array(z.string()).nullable(),
});

export const OutlineItemSchema = z.object({
  section: z.string(),
  title: z.string(),
  subsections: z.array(z.string()),
});

export const OrchestratorResponseSchema = z.object({
  action: OrchestrateActionSchema,
  status: z.enum(['success', 'needs_more_info']),
  message_to_user: z.string(),
  payload: z.object({
    questions: z.array(ClarificationQuestionSchema).optional(),
    outline: z.array(OutlineItemSchema).optional(),
    section_number: z.string().optional(),
    section_title: z.string().optional(),
    content_markdown: z.string().optional(),
  }),
});

export type OrchestratorResponse = z.infer<typeof OrchestratorResponseSchema>;
