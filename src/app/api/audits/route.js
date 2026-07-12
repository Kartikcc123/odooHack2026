
import { successResponse, paginationResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { createAuditCycleSchema } from '@/validators/audit.validator';
import { AuditService } from '@/services/audit.service';
import { requirePermission } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';
import { RESPONSE_CODES } from '@/constants/responseCodes';

const service = new AuditService();

export const GET = withErrorHandler(async (request) => {
  await requirePermission(PERMISSIONS.RUN_AUDIT);

  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    status: searchParams.get('status')
  };

  const { cycles, total } = await service.getAuditCycles(query);
  
  return paginationResponse(cycles, total, parseInt(query.page) || 1, parseInt(query.limit) || 10);
});

export const POST = withErrorHandler(async (request) => {
  await requirePermission(PERMISSIONS.RUN_AUDIT);

  const body = await request.json();
  const validData = await validateRequest(createAuditCycleSchema, body);
  
  const cycle = await service.createAuditCycle(validData);
  
  return successResponse(cycle, MESSAGES.CREATED, RESPONSE_CODES.CREATED);
});
