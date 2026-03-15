import { AuthRepository } from './auth.repository';
import { hashPassword, comparePassword } from '../../lib/bcrypt';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../lib/jwt';
import { AppError, ErrorCode } from '../../types/errors';

export class AuthService {
  private repo = new AuthRepository();

  async register(data: {
    organizationName: string;
    slug: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const existingSlug = await this.repo.findOrgBySlug(data.slug);
    if (existingSlug) {
      throw new AppError('Organization slug is already taken', 422, ErrorCode.SLUG_TAKEN);
    }

    const existingEmail = await this.repo.findUserByEmail(data.email);
    if (existingEmail) {
      throw new AppError('Email is already registered', 422, ErrorCode.EMAIL_TAKEN);
    }

    const passwordHash = await hashPassword(data.password);

    const { org, user } = await this.repo.createOrgAndAdmin({
      orgName: data.organizationName,
      slug: data.slug,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      passwordHash,
    });

    const tokenPayload = { sub: user.id, orgId: org.id, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl,
        organizationId: user.organizationId,
      },
      organization: { id: org.id, name: org.name, slug: org.slug },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.repo.findUserByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401, ErrorCode.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw AppError.forbidden('Account is deactivated');
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      throw new AppError('Invalid email or password', 401, ErrorCode.INVALID_CREDENTIALS);
    }

    const tokenPayload = { sub: user.id, orgId: user.organizationId, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl,
        organizationId: user.organizationId,
        organization: user.organization ? {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
        } : undefined,
      },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await this.repo.findUserById(payload.sub);
    if (!user || !user.isActive) {
      throw AppError.unauthorized('User not found or inactive');
    }

    const newTokenPayload = { sub: user.id, orgId: user.organizationId, role: user.role };
    const accessToken = signAccessToken(newTokenPayload);
    return { accessToken };
  }

  async getMe(userId: string) {
    const user = await this.repo.findUserById(userId);
    if (!user) throw AppError.notFound('User not found');

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      avatarUrl: user.avatarUrl,
      organizationId: user.organizationId,
      organization: user.organization ? {
        id: user.organization.id,
        name: user.organization.name,
        slug: user.organization.slug,
      } : undefined,
    };
  }
}
