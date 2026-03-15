import { z } from 'zod';

export const rejectSchema = z.object({
  rejectionReason: z.string().min(1).max(500),
});

export const managerRequestsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).optional(),
  employeeId: z.string().optional(),
  leaveTypeId: z.string().optional(),
});
