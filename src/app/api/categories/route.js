
import { successResponse, paginationResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { createCategorySchema } from '@/validators/category.validator';
import { CategoryService } from '@/services/category.service';
import { requirePermission } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';
import { RESPONSE_CODES } from '@/constants/responseCodes';

const service = new CategoryService();

export const GET = withErrorHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search')
  };

  const { categories, total } = await service.getCategories(query);
  
  return paginationResponse(categories, total, parseInt(query.page) || 1, parseInt(query.limit) || 10);
});

export const POST = withErrorHandler(async (request) => {
  await requirePermission(PERMISSIONS.CREATE_ASSET); // Usually admins/asset managers can manage categories

  const body = await request.json();
  const validData = await validateRequest(createCategorySchema, body);
  
  const category = await service.createCategory(validData);
  
  return successResponse(category, MESSAGES.CREATED, RESPONSE_CODES.CREATED);
});
