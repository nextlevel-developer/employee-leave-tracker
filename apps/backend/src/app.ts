import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';

import authRouter from './modules/auth/auth.router';
import employeeRouter from './modules/employee/employee.router';
import managerRouter from './modules/manager/manager.router';
import aiRouter from './modules/ai/ai.router';
import notificationRouter from './modules/notification/notification.router';
import leaveTypesRouter from './modules/leave-types/leave-types.router';

export function createApp() {
  const app = express();

  app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/health', async (_req, res) => {
    const { prisma } = await import('./config/database');
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ status: 'error', db: 'failed', error: err.message });
    }
  });

  // Routes
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/employees', employeeRouter);
  app.use('/api/v1/manager', managerRouter);
  app.use('/api/v1/ai', aiRouter);
  app.use('/api/v1/notifications', notificationRouter);
  app.use('/api/v1/leave-types', leaveTypesRouter);

  app.use(errorMiddleware);

  return app;
}
