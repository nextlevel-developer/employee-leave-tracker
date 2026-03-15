import { api } from '../../../lib/axios';
import { AiSessionResponse } from '@leave-tracker/shared-types';

export const aiApi = {
  startSession: async (message: string): Promise<AiSessionResponse> => {
    const res = await api.post('/ai/sessions', { message });
    return res.data.data;
  },

  sendMessage: async (sessionId: string, message: string): Promise<AiSessionResponse> => {
    const res = await api.post(`/ai/sessions/${sessionId}/messages`, { message });
    return res.data.data;
  },

  confirmSession: async (sessionId: string): Promise<{ leaveRequest: unknown }> => {
    const res = await api.post(`/ai/sessions/${sessionId}/confirm`);
    return res.data.data;
  },
};
