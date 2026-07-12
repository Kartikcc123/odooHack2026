
import { successResponse, paginationResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { createAssetSchema } from '@/validators/asset.validator';
import { AssetService } from '@/services/asset.service';
import { requirePermission } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';
import { RESPONSE_CODES } from '@/constants/responseCodes';

const service = new AssetService();

export const GET = withErrorHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const query = {
    page: searchParams.get('page'),
    limit: searchParams.get('limit'),
    search: searchParams.get('search'),
    categoryId: searchParams.get('categoryId'),
    status: searchParams.get('status'),
    location: searchParams.get('location'),
    isBookable: searchParams.get('isBookable')
  };

  const { assets, total } = await service.getAssets(query);
  
  return paginationResponse(assets, total, parseInt(query.page) || 1, parseInt(query.limit) || 10);
});

export const POST = withErrorHandler(async (request) => {
  const session = await requirePermission(PERMISSIONS.CREATE_ASSET);

  const body = await request.json();
  const validData = await validateRequest(createAssetSchema, body);
  
  const asset = await service.createAsset(validData, session.id);
  
  return successResponse(asset, MESSAGES.CREATED, RESPONSE_CODES.CREATED);
});
