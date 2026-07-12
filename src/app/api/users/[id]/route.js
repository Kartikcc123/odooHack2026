import { successResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { updateUserSchema } from '@/validators/user.validator';
import { UserService } from '@/services/user.service';
import { requirePermission, requireAuth } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';

const service = new UserService();

export const GET = withErrorHandler(async (request, { params }) => {
  await requireAuth(); // Usually employees can view other employees in directory
  
  const { id } = await params;
  const user = await service.getUserById(id);
  
  return successResponse(user);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  await requirePermission(PERMISSIONS.MANAGE_USERS);

  const { id } = await params;
  const body = await request.json();
  const validData = await validateRequest(updateUserSchema, body);
  
  const user = await service.updateUser(id, validData);
  
  return successResponse(user, MESSAGES.UPDATED);
});

export const DELETE = withErrorHandler(async (request, { params }) => {
  const session = await requirePermission(PERMISSIONS.MANAGE_USERS);

  const { id } = await params;
  await service.deleteUser(id, session.id);
  
  return successResponse(null, MESSAGES.DELETED);
});
