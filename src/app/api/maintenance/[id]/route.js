import { successResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { updateMaintenanceSchema } from '@/validators/maintenance.validator';
import { MaintenanceService } from '@/services/maintenance.service';
import { requirePermission, requireAuth } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';

const service = new MaintenanceService();

export const GET = withErrorHandler(async (request, { params }) => {
  await requireAuth(); 
  
  const { id } = await params;
  const maintenance = await service.getMaintenanceById(id);
  
  return successResponse(maintenance);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  const session = await requirePermission(PERMISSIONS.APPROVE_MAINTENANCE);

  const { id } = await params;
  const body = await request.json();
  const validData = await validateRequest(updateMaintenanceSchema, body);
  
  const maintenance = await service.updateMaintenanceStatus(id, validData, session.id);
  
  return successResponse(maintenance, MESSAGES.UPDATED);
});
