import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  assetId: z.string(),
  issue: z.string().min(5),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  attachments: z.array(z.string()).optional()
});

export const updateMaintenanceSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED', 'IN_PROGRESS', 'RESOLVED']),
  technicianId: z.string().optional().nullable()
});
