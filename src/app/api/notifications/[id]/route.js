import { successResponse } from '@/utils/response';
import { withErrorHandler } from '@/utils/validator';
import { NotificationService } from '@/services/notification.service';
import { requireAuth } from '@/middleware/auth';

const service = new NotificationService();

export const PUT = withErrorHandler(async (request, { params }) => {
  const session = await requireAuth();
  
  const { id } = await params;
  await service.markAsRead(id, session.id);
  
  return successResponse(null, 'Notification marked as read.');
});
