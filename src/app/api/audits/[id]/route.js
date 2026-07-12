import { successResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { updateAuditCycleSchema } from '@/validators/audit.validator';
import { AuditService } from '@/services/audit.service';
import { requirePermission } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';

const service = new AuditService();

export const GET = withErrorHandler(async (request, { params }) => {
  await requirePermission(PERMISSIONS.RUN_AUDIT);
  
  const { id } = await params;
  const cycle = await service.getAuditCycleById(id);
  
  return successResponse(cycle);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  await requirePermission(PERMISSIONS.RUN_AUDIT);

  const { id } = await params;
  const body = await request.json();
  const validData = await validateRequest(updateAuditCycleSchema, body);
  
  const cycle = await service.updateAuditCycleStatus(id, validData);
  
  return successResponse(cycle, MESSAGES.UPDATED);
});
