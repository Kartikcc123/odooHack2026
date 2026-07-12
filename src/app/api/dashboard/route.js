import { successResponse } from '@/utils/response';
import { withErrorHandler } from '@/utils/validator';
import { DashboardService } from '@/services/dashboard.service';
import { requireAuth } from '@/middleware/auth';

const service = new DashboardService();

export const GET = withErrorHandler(async () => {
  const session = await requireAuth();
  
  const data = await service.getDashboardData(session.role, session.id, session.departmentId);
  
  return successResponse(data);
});
