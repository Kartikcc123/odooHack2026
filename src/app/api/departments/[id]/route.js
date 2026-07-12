import { successResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { updateDepartmentSchema } from '@/validators/department.validator';
import { DepartmentService } from '@/services/department.service';
import { requirePermission, requireAuth } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';

const service = new DepartmentService();

export const GET = withErrorHandler(async (request, { params }) => {
  // All authenticated users can usually view a department's details
  await requireAuth();
  
  const { id } = await params;
  const department = await service.getDepartmentById(id);
  
  return successResponse(department);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  await requirePermission(PERMISSIONS.MANAGE_DEPARTMENTS);

  const { id } = await params;
  const body = await request.json();
  const validData = await validateRequest(updateDepartmentSchema, body);
  
  const department = await service.updateDepartment(id, validData);
  
  return successResponse(department, MESSAGES.UPDATED);
});

export const DELETE = withErrorHandler(async (request, { params }) => {
  const session = await requirePermission(PERMISSIONS.MANAGE_DEPARTMENTS);

  const { id } = await params;
  await service.deleteDepartment(id, session.id);
  
  return successResponse(null, MESSAGES.DELETED);
});
