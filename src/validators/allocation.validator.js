import { z } from 'zod';

export const createAllocationSchema = z.object({
  assetId: z.string(),
  userId: z.string().optional().nullable(),
  departmentId: z.string().optional().nullable(),
  expectedReturnDate: z.string().datetime().optional().nullable(),
  notes: z.string().optional().nullable()
}).refine(data => data.userId || data.departmentId, {
  message: "Must allocate to either a User or a Department",
  path: ["userId"]
});

export const returnAllocationSchema = z.object({
  notes: z.string().optional().nullable(),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'POOR', 'BROKEN']).optional()
});
