import { z } from 'zod';

export const createBookingSchema = z.object({
  assetId: z.string(),
  resourceType: z.enum(['MEETING_ROOM', 'PROJECTOR', 'LAPTOP', 'VEHICLE', 'OTHER']).optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime()
}).refine(data => new Date(data.startTime) < new Date(data.endTime), {
  message: "End time must be after start time",
  path: ["endTime"]
}).refine(data => new Date(data.startTime) > new Date(), {
  message: "Start time must be in the future",
  path: ["startTime"]
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['ONGOING', 'COMPLETED', 'CANCELLED'])
});
