import { z } from 'zod';

export const createTransferSchema = z.object({
  assetId: z.string(),
  toUserId: z.string(),
  notes: z.string().optional().nullable()
});

export const respondTransferSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().optional().nullable()
});
