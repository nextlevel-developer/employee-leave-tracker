import { z } from 'zod';
import { isDateInPast } from '../../lib/date.utils';

export const AiResponseSchema = z.object({
  status: z.enum(['structured', 'clarify']),
  leaveTypeCode: z.string().nullable(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  reason: z.string().nullable(),
  message: z.string().min(1),
});

export type RawAiResponse = z.infer<typeof AiResponseSchema>;

export const FALLBACK_RESPONSE: RawAiResponse = {
  status: 'clarify',
  leaveTypeCode: null,
  startDate: null,
  endDate: null,
  reason: null,
  message: "I didn't quite catch that — could you describe when you'd like to take leave and what type of leave you need?",
};

export function validateAndEnrichAiResponse(
  raw: RawAiResponse,
  validLeaveCodes: string[]
): RawAiResponse {
  if (raw.status !== 'structured') return raw;

  // Check required fields
  if (!raw.startDate || !raw.endDate) {
    return {
      ...raw,
      status: 'clarify',
      message: "Could you let me know the exact dates you'd like to take off?",
    };
  }

  // Check past dates
  if (isDateInPast(new Date(raw.startDate))) {
    return {
      ...raw,
      status: 'clarify',
      message: `It looks like that date is in the past. Could you confirm which dates you meant?`,
    };
  }

  // Check end before start
  if (raw.endDate < raw.startDate) {
    return {
      ...raw,
      status: 'clarify',
      message: 'The end date appears to be before the start date. Could you clarify the dates?',
    };
  }

  // Check leave type code valid
  if (!raw.leaveTypeCode || !validLeaveCodes.includes(raw.leaveTypeCode)) {
    return {
      ...raw,
      status: 'clarify',
      leaveTypeCode: null,
      message: `I couldn't determine the leave type. Available types are: ${validLeaveCodes.join(', ')}. Which would you like?`,
    };
  }

  return raw;
}
