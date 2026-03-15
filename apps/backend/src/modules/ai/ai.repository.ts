import { prisma } from '../../config/database';
import { ChatMessage } from '../../lib/openai.client';

export class AiRepository {
  async createSession(userId: string, initialMessages: ChatMessage[]) {
    return prisma.aiSession.create({
      data: {
        userId,
        messages: initialMessages as unknown as object[],
        resolved: false,
      },
    });
  }

  async findSession(sessionId: string, userId: string) {
    return prisma.aiSession.findFirst({
      where: { id: sessionId, userId },
    });
  }

  async updateSession(sessionId: string, messages: ChatMessage[], parsedData?: object | null) {
    return prisma.aiSession.update({
      where: { id: sessionId },
      data: {
        messages: messages as unknown as object[],
        ...(parsedData !== undefined ? { parsedData: parsedData as object } : {}),
      },
    });
  }

  async resolveSession(sessionId: string) {
    return prisma.aiSession.update({
      where: { id: sessionId },
      data: { resolved: true },
    });
  }
}
