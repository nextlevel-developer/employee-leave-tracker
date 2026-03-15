import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { success, paginated } from '../../lib/api-response';

const notifService = new NotificationService();

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const isRead = req.query.isRead !== undefined ? req.query.isRead === 'true' : undefined;

    const { data, total } = await notifService.getNotifications(req.user!.sub, { isRead, page, limit });
    return paginated(res, data, { total, page, limit });
  } catch (err) {
    return next(err);
  }
}

export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try {
    const count = await notifService.getUnreadCount(req.user!.sub);
    return success(res, { count });
  } catch (err) {
    return next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    await notifService.markAsRead(req.params.id, req.user!.sub);
    return success(res, { id: req.params.id, isRead: true });
  } catch (err) {
    return next(err);
  }
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await notifService.markAllAsRead(req.user!.sub);
    return success(res, { updatedCount: result.count });
  } catch (err) {
    return next(err);
  }
}
