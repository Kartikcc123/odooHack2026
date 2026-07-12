import { successResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { updateBookingStatusSchema } from '@/validators/booking.validator';
import { BookingService } from '@/services/booking.service';
import { requireAuth } from '@/middleware/auth';
import { MESSAGES } from '@/constants/messages';

const service = new BookingService();

export const GET = withErrorHandler(async (request, { params }) => {
  await requireAuth(); 
  
  const { id } = await params;
  const booking = await service.getBookingById(id);
  
  return successResponse(booking);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  const session = await requireAuth();

  const { id } = await params;
  const body = await request.json();
  const validData = await validateRequest(updateBookingStatusSchema, body);
  
  const booking = await service.updateBookingStatus(id, validData.status, session.id, session.role);
  
  return successResponse(booking, MESSAGES.UPDATED);
});
