import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../api/ai.api';
import { AiSessionResponse, AiMessage } from '@leave-tracker/shared-types';
import { QUERY_KEYS } from '../../../lib/constants';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  parsed?: AiSessionResponse['parsed'];
  status?: AiSessionResponse['status'];
}

export function useAiSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();

  const sendMessage = async (content: string) => {
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsLoading(true);

    try {
      let response: AiSessionResponse;
      if (!sessionId) {
        response = await aiApi.startSession(content);
        setSessionId(response.sessionId);
      } else {
        response = await aiApi.sendMessage(sessionId, content);
      }

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response.message,
          parsed: response.parsed ?? undefined,
          status: response.status,
        },
      ]);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Something went wrong. Please try again.';
      setError(msg);
      setMessages(prev => [...prev, { role: 'assistant', content: msg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmLeave = async () => {
    if (!sessionId) return;
    setIsConfirming(true);
    setError(null);
    try {
      await aiApi.confirmSession(sessionId);
      setConfirmed(true);
      qc.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.leaveHistory });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.balances });
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || 'Failed to submit leave request.';
      setError(msg);
    } finally {
      setIsConfirming(false);
    }
  };

  const reset = () => {
    setSessionId(null);
    setMessages([]);
    setIsLoading(false);
    setIsConfirming(false);
    setConfirmed(false);
    setError(null);
  };

  const lastMessage = messages[messages.length - 1];
  const canConfirm =
    !confirmed &&
    lastMessage?.role === 'assistant' &&
    lastMessage?.status === 'STRUCTURED' &&
    !!lastMessage?.parsed;

  return { messages, isLoading, isConfirming, confirmed, error, canConfirm, sendMessage, confirmLeave, reset };
}
