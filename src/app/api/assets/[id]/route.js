import { successResponse } from '@/utils/response';
import { validateRequest, withErrorHandler } from '@/utils/validator';
import { updateAssetSchema } from '@/validators/asset.validator';
import { AssetService } from '@/services/asset.service';
import { requirePermission, requireAuth } from '@/middleware/auth';
import { PERMISSIONS } from '@/constants/permissions';
import { MESSAGES } from '@/constants/messages';

const service = new AssetService();

export const GET = withErrorHandler(async (request, { params }) => {
  await requireAuth(); 
  
  const { id } = await params;
  const asset = await service.getAssetById(id);
  
  return successResponse(asset);
});

export const PUT = withErrorHandler(async (request, { params }) => {
  const session = await requirePermission(PERMISSIONS.UPDATE_ASSET);

  const { id } = await params;
  const body = await request.json();
  const validData = await validateRequest(updateAssetSchema, body);
  
  const asset = await service.updateAsset(id, validData, session.id);
  
  return successResponse(asset, MESSAGES.UPDATED);
});

export const DELETE = withErrorHandler(async (request, { params }) => {
  const session = await requirePermission(PERMISSIONS.DELETE_ASSET);

  const { id } = await params;
  await service.deleteAsset(id, session.id);
  
  return successResponse(null, MESSAGES.DELETED);
});
