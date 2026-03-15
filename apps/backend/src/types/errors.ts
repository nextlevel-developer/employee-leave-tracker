export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  DATE_CONFLICT = 'DATE_CONFLICT',
  REQUEST_NOT_PENDING = 'REQUEST_NOT_PENDING',
  SESSION_RESOLVED = 'SESSION_RESOLVED',
  SLUG_TAKEN = 'SLUG_TAKEN',
  EMAIL_TAKEN = 'EMAIL_TAKEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;

  constructor(message: string, statusCode: number, code: ErrorCode) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401, ErrorCode.UNAUTHORIZED);
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403, ErrorCode.FORBIDDEN);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404, ErrorCode.NOT_FOUND);
  }

  static validation(message: string) {
    return new AppError(message, 422, ErrorCode.VALIDATION_ERROR);
  }

  static insufficientBalance(message: string) {
    return new AppError(message, 422, ErrorCode.INSUFFICIENT_BALANCE);
  }

  static dateConflict(message: string) {
    return new AppError(message, 422, ErrorCode.DATE_CONFLICT);
  }

  static requestNotPending(message = 'Leave request is not in PENDING status') {
    return new AppError(message, 422, ErrorCode.REQUEST_NOT_PENDING);
  }

  static sessionResolved(message = 'AI session has already been used') {
    return new AppError(message, 422, ErrorCode.SESSION_RESOLVED);
  }
}
