
import { successResponse, paginationResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { createMaintenanceSchema } from '@/validators/maintenance.validator';
import { MaintenanceService } from '@/services/maintenance.service';
import { requireAuth } from '@/middleware/auth';
import { MESSAGES } from '@/constants/messages';
import { RESPONSE_CODES } from '@/constants/responseCodes';

const service = new MaintenanceService();

export const GET = withErrorHandler(async (request) => {
  const session = await requireAuth();

  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    assetId: searchParams.get('assetId'),
    status: searchParams.get('status')
  };

  if (session.role === 'EMPLOYEE') {
    query.reporterId = session.id;
  } else {
    query.reporterId = searchParams.get('reporterId');
    query.technicianId = searchParams.get('technicianId');
  }

  const { requests, total } = await service.getMaintenanceRequests(query);
  
  return paginationResponse(requests, total, parseInt(query.page) || 1, parseInt(query.limit) || 10);
});

export const POST = withErrorHandler(async (request) => {
  const session = await requireAuth(); // Any user can report an issue

  const body = await request.json();
  const validData = await validateRequest(createMaintenanceSchema, body);
  
  const maintenance = await service.createMaintenanceRequest(validData, session.id);
  
  return successResponse(maintenance, MESSAGES.CREATED, RESPONSE_CODES.CREATED);
});
