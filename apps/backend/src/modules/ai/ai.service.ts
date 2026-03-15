import { AiRepository } from './ai.repository';
import { PromptBuilder } from './prompt.builder';
import { AiResponseSchema, validateAndEnrichAiResponse, FALLBACK_RESPONSE } from './ai.validator';
import { chatComplete, ChatMessage } from '../../lib/openai.client';
import { prisma } from '../../config/database';
import { EmployeeService } from '../employee/employee.service';
import { AppError } from '../../types/errors';
import { calcBusinessDays, getCurrentYear } from '../../lib/date.utils';

export class AiService {
  private repo = new AiRepository();
  private promptBuilder = new PromptBuilder();
  private employeeService = new EmployeeService();

  private async buildContext(userId: string, orgId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw AppError.notFound('User not found');

    const year = getCurrentYear();
    const balances = await prisma.leaveBalance.findMany({
      where: { userId, year },
      include: { leaveType: true },
    });

    const leaveTypes = balances.map(b => ({
      code: b.leaveType.code,
      name: b.leaveType.name,
      remainingDays: Math.max(0, b.totalDays - b.usedDays - b.pendingDays),
    }));

    return {
      employeeName: `${user.firstName} ${user.lastName}`,
      leaveTypes,
      validCodes: leaveTypes.map(lt => lt.code),
    };
  }

  private parseAiOutput(raw: string) {
    try {
      const parsed = JSON.parse(raw);
      const validated = AiResponseSchema.parse(parsed);
      return validated;
    } catch {
      return FALLBACK_RESPONSE;
    }
  }

  async startSession(userId: string, orgId: string, message: string) {
    const context = await this.buildContext(userId, orgId);
    const systemPrompt = this.promptBuilder.build({
      employeeName: context.employeeName,
      leaveTypes: context.leaveTypes,
    });

    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ];

    const rawOutput = await chatComplete(messages);
    const parsed = this.parseAiOutput(rawOutput);
    const enriched = validateAndEnrichAiResponse(parsed, context.validCodes);

    messages.push({ role: 'assistant', content: rawOutput });

    const parsedData = enriched.status === 'structured' ? enriched : null;
    const session = await this.repo.createSession(userId, messages);
    await this.repo.updateSession(session.id, messages, parsedData);

    return this._buildResponse(session.id, enriched, context.validCodes);
  }

  async continueSession(sessionId: string, userId: string, orgId: string, message: string) {
    const session = await this.repo.findSession(sessionId, userId);
    if (!session) throw AppError.notFound('AI session not found');
    if (session.resolved) throw AppError.sessionResolved();

    const context = await this.buildContext(userId, orgId);

    // Rebuild system prompt with fresh context
    const systemPrompt = this.promptBuilder.build({
      employeeName: context.employeeName,
      leaveTypes: context.leaveTypes,
    });

    const existingMessages = session.messages as unknown as ChatMessage[];
    const messages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...existingMessages.slice(1), // skip old system prompt
      { role: 'user', content: message },
    ];

    const rawOutput = await chatComplete(messages);
    const parsed = this.parseAiOutput(rawOutput);
    const enriched = validateAndEnrichAiResponse(parsed, context.validCodes);

    messages.push({ role: 'assistant', content: rawOutput });

    const parsedData = enriched.status === 'structured' ? enriched : null;
    await this.repo.updateSession(sessionId, messages, parsedData);

    return this._buildResponse(sessionId, enriched, context.validCodes);
  }

  async confirmSession(sessionId: string, userId: string, orgId: string) {
    const session = await this.repo.findSession(sessionId, userId);
    if (!session) throw AppError.notFound('AI session not found');
    if (session.resolved) throw AppError.sessionResolved();

    const parsedData = session.parsedData as {
      leaveTypeCode: string;
      startDate: string;
      endDate: string;
      reason: string | null;
    } | null;

    if (!parsedData || !parsedData.startDate || !parsedData.endDate) {
      throw AppError.validation('Session does not have confirmed leave data yet. Please complete the conversation first.');
    }

    // Find leave type by code
    const leaveType = await prisma.leaveType.findFirst({
      where: { organizationId: orgId, code: parsedData.leaveTypeCode },
    });

    if (!leaveType) {
      throw AppError.validation(`Leave type "${parsedData.leaveTypeCode}" not found`);
    }

    const leaveRequest = await this.employeeService.submitLeaveRequest({
      requesterId: userId,
      orgId,
      leaveTypeId: leaveType.id,
      startDate: parsedData.startDate,
      endDate: parsedData.endDate,
      reason: parsedData.reason ?? undefined,
      aiGenerated: true,
      aiSessionId: sessionId,
    });

    await this.repo.resolveSession(sessionId);

    return { leaveRequest };
  }

  private _buildResponse(sessionId: string, enriched: typeof FALLBACK_RESPONSE, validCodes: string[]) {
    const isStructured = enriched.status === 'structured';

    let parsed = null;
    if (isStructured && enriched.startDate && enriched.endDate) {
      const start = new Date(enriched.startDate);
      const end = new Date(enriched.endDate);
      const totalDays = calcBusinessDays(start, end);

      parsed = {
        leaveTypeCode: enriched.leaveTypeCode!,
        leaveTypeName: enriched.leaveTypeCode!,
        startDate: enriched.startDate,
        endDate: enriched.endDate,
        totalDays,
        reason: enriched.reason,
      };
    }

    return {
      sessionId,
      status: isStructured ? 'STRUCTURED' : 'CLARIFICATION_NEEDED',
      parsed,
      message: enriched.message,
    };
  }
}
