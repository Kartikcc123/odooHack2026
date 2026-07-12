import { z } from 'zod';

export const createAssetSchema = z.object({
  tag: z.string().min(2).max(50),
  name: z.string().min(2).max(100),
  categoryId: z.string(),
  serial: z.string().optional().nullable(),
  qrCode: z.string().optional().nullable(),
  purchaseDate: z.string().datetime().optional().nullable(),
  purchaseCost: z.number().min(0).optional().nullable(),
  warrantyExpiry: z.string().datetime().optional().nullable(),
  condition: z.enum(['NEW', 'GOOD', 'FAIR', 'POOR', 'BROKEN']).optional(),
  location: z.string().optional().nullable(),
  photo: z.string().optional().nullable(),
  documents: z.array(z.string()).optional(),
  isBookable: z.boolean().optional(),
  expectedReturnDate: z.string().datetime().optional().nullable(),
  status: z.enum(['AVAILABLE', 'ALLOCATED', 'RESERVED', 'MAINTENANCE', 'LOST', 'RETIRED', 'DISPOSED']).optional()
});

export const updateAssetSchema = createAssetSchema.partial();
