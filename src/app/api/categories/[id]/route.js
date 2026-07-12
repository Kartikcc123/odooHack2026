import { successResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { updateCategorySchema } from '@/validators/category.validator';
import { CategoryService } from '@/services/category.service';
import { requirePermission, requireAuth } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';

const service = new CategoryService();

export const GET = withErrorHandler(async (request, { params }) => {
  await requireAuth(); 
  
  const { id } = await params;
  const category = await service.getCategoryById(id);
  
  return successResponse(category);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  await requirePermission(PERMISSIONS.CREATE_ASSET);

  const { id } = await params;
  const body = await request.json();
  const validData = await validateRequest(updateCategorySchema, body);
  
  const category = await service.updateCategory(id, validData);
  
  return successResponse(category, MESSAGES.UPDATED);
});

export const DELETE = withErrorHandler(async (request, { params }) => {
  const session = await requirePermission(PERMISSIONS.CREATE_ASSET);

  const { id } = await params;
  await service.deleteCategory(id, session.id);
  
  return successResponse(null, MESSAGES.DELETED);
});
