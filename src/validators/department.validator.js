import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  parentId: z.string().optional().nullable(),
  headId: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

export const updateDepartmentSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  parentId: z.string().optional().nullable(),
  headId: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});
