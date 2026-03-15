import OpenAI from 'openai';
import { env } from '../config/env';

export const openaiClient = new OpenAI({
  apiKey: env.AI_API_KEY,
  baseURL: env.AI_BASE_URL,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatComplete(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await openaiClient.chat.completions.create({
      model: env.AI_MODEL,
      messages,
      max_tokens: env.AI_MAX_TOKENS,
      temperature: env.AI_TEMPERATURE,
      response_format: { type: 'json_object' },
    });

    return response.choices[0]?.message?.content ?? '{}';
  } catch (err: any) {
    const status = err?.status ?? err?.response?.status;
    const message = err?.message ?? 'AI service error';

    console.error('[AI] OpenAI API error:', status, message);

    if (status === 401) {
      throw new Error('AI service authentication failed. Check your AI_API_KEY in .env');
    }
    if (status === 429) {
      throw new Error('AI service rate limit reached. Please try again in a moment.');
    }
    if (status === 503 || status === 502) {
      throw new Error('AI service is temporarily unavailable. Please try again.');
    }
    throw new Error(`AI service error: ${message}`);
  }
}
