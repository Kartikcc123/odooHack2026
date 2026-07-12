import { successResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { respondTransferSchema } from '@/validators/transfer.validator';
import { TransferService } from '@/services/transfer.service';
import { requirePermission } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';


const service = new TransferService();

export const GET = withErrorHandler(async (request, { params }) => {
  const { id } = await params;
  const transfer = await service.getTransferById(id);
  return successResponse(transfer);
});

export const POST = withErrorHandler(async (request, { params }) => {
  // POST to /api/transfers/[id] acts as the "RESPOND" action endpoint
  const session = await requirePermission(PERMISSIONS.APPROVE_TRANSFER);

  const { id } = await params;
  const body = await request.json();
  const validData = await validateRequest(respondTransferSchema, body);
  
  const transfer = await service.respondTransfer(id, validData, session.id);
  
  return successResponse(transfer, `Transfer request ${validData.status.toLowerCase()} successfully.`);
});
