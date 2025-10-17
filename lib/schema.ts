import { z } from 'zod';

// Zod schema for UK legal guidance responses
export const UKLegalResponseSchema = z.object({
  jurisdiction: z.literal('UK'),
  short_answer: z.string().min(1),
  step_by_step_plan: z.array(z.string()).min(1),
  risks_or_deadlines: z.array(z.string()),
  when_to_seek_a_solicitor: z.string().min(1),
  citations: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    last_updated: z.string(),
  })),
  confidence: z.number().min(0).max(1),
});

// Type inference for TypeScript
export type UKLegalResponse = z.infer<typeof UKLegalResponseSchema>;

// Validation function
export function validateLegalResponse(data: any) {
  try {
    return {
      success: true,
      data: UKLegalResponseSchema.parse(data),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.errors || error.message,
    };
  }
}

export default {
  UKLegalResponseSchema,
  validateLegalResponse,
};