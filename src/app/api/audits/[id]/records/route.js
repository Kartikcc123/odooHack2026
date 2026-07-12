import { successResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { addAuditRecordSchema } from '@/validators/audit.validator';
import { AuditService } from '@/services/audit.service';
import { requirePermission } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';
import { RESPONSE_CODES } from '@/constants/responseCodes';

const service = new AuditService();

export const POST = withErrorHandler(async (request, { params }) => {
  const session = await requirePermission(PERMISSIONS.RUN_AUDIT);

  const { id } = await params;
  const body = await request.json();
  const validData = await validateRequest(addAuditRecordSchema, body);
  
  const record = await service.addAuditRecord(id, validData, session.id);
  
  return successResponse(record, MESSAGES.CREATED, RESPONSE_CODES.CREATED);
});
