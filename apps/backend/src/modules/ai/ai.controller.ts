import { Request, Response, NextFunction } from 'express';
import { AiService } from './ai.service';
import { success } from '../../lib/api-response';

const aiService = new AiService();

export async function startSession(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await aiService.startSession(req.user!.sub, req.user!.orgId, req.body.message);
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function continueSession(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await aiService.continueSession(
      req.params.sessionId,
      req.user!.sub,
      req.user!.orgId,
      req.body.message
    );
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function confirmSession(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await aiService.confirmSession(req.params.sessionId, req.user!.sub, req.user!.orgId);
    return success(res, data, 201);
  } catch (err) {
    return next(err);
  }
}
