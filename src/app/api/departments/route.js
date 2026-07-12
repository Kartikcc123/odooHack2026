
import { successResponse, paginationResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { createDepartmentSchema } from '@/validators/department.validator';
import { DepartmentService } from '@/services/department.service';
import { requirePermission } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';
import { RESPONSE_CODES } from '@/constants/responseCodes';

const service = new DepartmentService();

export const GET = withErrorHandler(async (request) => {
  await requirePermission(PERMISSIONS.MANAGE_DEPARTMENTS);

  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search')
  };

  const { departments, total } = await service.getDepartments(query);
  
  return paginationResponse(departments, total, parseInt(query.page) || 1, parseInt(query.limit) || 10);
});

export const POST = withErrorHandler(async (request) => {
  await requirePermission(PERMISSIONS.MANAGE_DEPARTMENTS);

  const body = await request.json();
  const validData = await validateRequest(createDepartmentSchema, body);
  
  const department = await service.createDepartment(validData);
  
  return successResponse(department, MESSAGES.CREATED, RESPONSE_CODES.CREATED);
});
