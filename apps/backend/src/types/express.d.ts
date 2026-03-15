// Augments Express's global Request type — no import/export (script mode)
declare namespace Express {
  interface Request {
    user?: {
      sub: string;
      orgId: string;
      role: string;
      iat?: number;
      exp?: number;
    };
  }
}
