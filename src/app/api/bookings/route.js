
import { successResponse, paginationResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { createBookingSchema } from '@/validators/booking.validator';
import { BookingService } from '@/services/booking.service';
import { requireAuth, requirePermission } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';
import { RESPONSE_CODES } from '@/constants/responseCodes';

const service = new BookingService();

export const GET = withErrorHandler(async (request) => {
  const session = await requireAuth();

  const { searchParams } = new URL(request.url);
  
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    assetId: searchParams.get('assetId'),
    status: searchParams.get('status')
  };

  // Employees can only view their own bookings, unless they are checking a specific asset's availability (handled implicitly by overlaps check)
  // For a directory view, we restrict. 
  if (session.role === 'EMPLOYEE' && !query.assetId) {
    query.userId = session.id;
  } else if (session.role !== 'EMPLOYEE') {
    query.userId = searchParams.get('userId');
  }

  const { bookings, total } = await service.getBookings(query);
  
  return paginationResponse(bookings, total, parseInt(query.page) || 1, parseInt(query.limit) || 10);
});

export const POST = withErrorHandler(async (request) => {
  const session = await requirePermission(PERMISSIONS.BOOK_RESOURCE);

  const body = await request.json();
  const validData = await validateRequest(createBookingSchema, body);
  
  const booking = await service.createBooking(validData, session.id);
  
  return successResponse(booking, MESSAGES.CREATED, RESPONSE_CODES.CREATED);
});
