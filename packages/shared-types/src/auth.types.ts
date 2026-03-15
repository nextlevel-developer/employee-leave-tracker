export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  organizationName: string;
  slug: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserProfile;
  organization: OrganizationInfo;
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  department: string | null;
  avatarUrl: string | null;
  organizationId: string;
  organization?: OrganizationInfo;
}

export interface OrganizationInfo {
  id: string;
  name: string;
  slug: string;
}

export interface JwtPayload {
  sub: string;
  orgId: string;
  role: Role;
  iat?: number;
  exp?: number;
}

export type Role = 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
