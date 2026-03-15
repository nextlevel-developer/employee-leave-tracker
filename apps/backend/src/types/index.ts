export type Role = 'EMPLOYEE' | 'MANAGER' | 'ADMIN';

export interface JwtPayload {
  sub: string;
  orgId: string;
  role: Role;
  iat?: number;
  exp?: number;
}
