import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  warrantyRequired: z.boolean().optional(),
  defaultWarrantyMonths: z.number().int().min(0).optional().nullable()
});

export const updateCategorySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  warrantyRequired: z.boolean().optional(),
  defaultWarrantyMonths: z.number().int().min(0).optional().nullable()
});
