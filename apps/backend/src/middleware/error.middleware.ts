import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode } from '../types/errors';
import { ZodError } from 'zod';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message },
    });
  }

  if (err instanceof ZodError) {
    const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return res.status(422).json({
      success: false,
      error: { code: ErrorCode.VALIDATION_ERROR, message },
    });
  }

  console.error('Unhandled error:', err);

  // Surface AI service errors with their actual message
  const message = err?.message?.startsWith('AI service')
    ? err.message
    : 'Internal server error';

  return res.status(500).json({
    success: false,
    error: { code: ErrorCode.INTERNAL_ERROR, message },
  });
}
