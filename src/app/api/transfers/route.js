
import { successResponse, paginationResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { createTransferSchema } from '@/validators/transfer.validator';
import { TransferService } from '@/services/transfer.service';
import { requireAuth } from '@/middleware/auth';
import { MESSAGES } from '@/constants/messages';
import { RESPONSE_CODES } from '@/constants/responseCodes';

const service = new TransferService();

export const GET = withErrorHandler(async (request) => {
  const session = await requireAuth();

  const { searchParams } = new URL(request.url);
  
  // Base query. If not admin, restrict to their own transfers
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    assetId: searchParams.get('assetId'),
    status: searchParams.get('status')
  };

  // Restrict view if standard employee
  if (session.role === 'EMPLOYEE') {
    // Can only see their own requests
    // (This simple logic could be expanded to see both incoming and outgoing, but for now we'll fetch all and filter in service if needed,
    // or just pass both. In Prisma we'd need OR, so we rely on the service or just allow them to see incoming for now)
    query.toUserId = session.id;
  } else {
    query.fromUserId = searchParams.get('fromUserId');
    query.toUserId = searchParams.get('toUserId');
  }

  const { transfers, total } = await service.getTransfers(query);
  
  return paginationResponse(transfers, total, parseInt(query.page) || 1, parseInt(query.limit) || 10);
});

export const POST = withErrorHandler(async (request) => {
  const session = await requireAuth(); // Anyone can request a transfer

  const body = await request.json();
  const validData = await validateRequest(createTransferSchema, body);
  
  const transfer = await service.createTransfer(validData, session.id);
  
  return successResponse(transfer, MESSAGES.CREATED, RESPONSE_CODES.CREATED);
});
