import { z } from 'zod';

export const startSessionSchema = z.object({
  message: z.string().min(1).max(1000),
});

export const continueSessionSchema = z.object({
  message: z.string().min(1).max(1000),
});
