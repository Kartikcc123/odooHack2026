import { successResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { returnAllocationSchema } from '@/validators/allocation.validator';
import { AllocationService } from '@/services/allocation.service';
import { requirePermission, requireAuth } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';


const service = new AllocationService();

export const GET = withErrorHandler(async (request, { params }) => {
  await requireAuth(); 
  
  const { id } = await params;
  const allocation = await service.getAllocationById(id);
  
  return successResponse(allocation);
});

export const POST = withErrorHandler(async (request, { params }) => {
  // POST to /api/allocations/[id] acts as the "RETURN" action endpoint
  const session = await requirePermission(PERMISSIONS.ALLOCATE_ASSET);

  const { id } = await params;
  const body = await request.json();
  const validData = await validateRequest(returnAllocationSchema, body);
  
  const allocation = await service.returnAllocation(id, validData, session.id);
  
  return successResponse(allocation, 'Asset returned successfully.');
});
