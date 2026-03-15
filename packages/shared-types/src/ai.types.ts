export type AiSessionStatus = 'STRUCTURED' | 'CLARIFICATION_NEEDED';

export interface AiParsedLeave {
  leaveTypeCode: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
}

export interface AiSessionResponse {
  sessionId: string;
  status: AiSessionStatus;
  parsed: AiParsedLeave | null;
  message: string;
}

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}
