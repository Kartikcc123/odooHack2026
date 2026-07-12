
import { successResponse, paginationResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { createUserSchema } from '@/validators/user.validator';
import { UserService } from '@/services/user.service';
import { requirePermission } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';
import { RESPONSE_CODES } from '@/constants/responseCodes';

const service = new UserService();

export const GET = withErrorHandler(async (request) => {
  await requirePermission(PERMISSIONS.MANAGE_USERS);

  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search'),
    departmentId: searchParams.get('departmentId'),
    role: searchParams.get('role')
  };

  const { users, total } = await service.getUsers(query);
  
  return paginationResponse(users, total, parseInt(query.page) || 1, parseInt(query.limit) || 10);
});

export const POST = withErrorHandler(async (request) => {
  await requirePermission(PERMISSIONS.MANAGE_USERS);

  const body = await request.json();
  const validData = await validateRequest(createUserSchema, body);
  
  const user = await service.createUser(validData);
  
  return successResponse(user, MESSAGES.CREATED, RESPONSE_CODES.CREATED);
});
