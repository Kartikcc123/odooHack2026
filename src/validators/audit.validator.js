import { z } from 'zod';

export const createAuditCycleSchema = z.object({
  name: z.string().min(3).max(100),
  scope: z.string().optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime()
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
  message: "End date must be after start date",
  path: ["endDate"]
});

export const updateAuditCycleSchema = z.object({
  status: z.enum(['OPEN', 'CLOSED'])
});

export const addAuditRecordSchema = z.object({
  assetId: z.string(),
  status: z.enum(['VERIFIED', 'MISSING', 'DAMAGED']),
  discrepancyReport: z.string().optional().nullable()
});
