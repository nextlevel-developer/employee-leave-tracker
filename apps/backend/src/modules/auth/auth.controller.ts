import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { success } from '../../lib/api-response';

const authService = new AuthService();

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.register(req.body);
    return success(res, data, 201);
  } catch (err) {
    return next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.login(req.body.email, req.body.password);
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.refresh(req.body.refreshToken);
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}

export async function logout(_req: Request, res: Response, next: NextFunction) {
  try {
    return success(res, { message: 'Logged out successfully' });
  } catch (err) {
    return next(err);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.getMe(req.user!.sub);
    return success(res, data);
  } catch (err) {
    return next(err);
  }
}
