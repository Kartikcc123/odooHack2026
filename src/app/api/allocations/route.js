
import { successResponse, paginationResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { createAllocationSchema } from '@/validators/allocation.validator';
import { AllocationService } from '@/services/allocation.service';
import { requirePermission } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';
import { RESPONSE_CODES } from '@/constants/responseCodes';

const service = new AllocationService();

export const GET = withErrorHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    assetId: searchParams.get('assetId'),
    userId: searchParams.get('userId'),
    departmentId: searchParams.get('departmentId'),
    status: searchParams.get('status')
  };

  const { allocations, total } = await service.getAllocations(query);
  
  return paginationResponse(allocations, total, parseInt(query.page) || 1, parseInt(query.limit) || 10);
});

export const POST = withErrorHandler(async (request) => {
  const session = await requirePermission(PERMISSIONS.ALLOCATE_ASSET);

  const body = await request.json();
  const validData = await validateRequest(createAllocationSchema, body);
  
  const allocation = await service.createAllocation(validData, session.id);
  
  return successResponse(allocation, MESSAGES.CREATED, RESPONSE_CODES.CREATED);
});
