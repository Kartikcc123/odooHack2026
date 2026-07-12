import { successResponse } from '@/utils/response';
import { withErrorHandler } from '@/utils/validator';
import { NotificationService } from '@/services/notification.service';
import { requireAuth } from '@/middleware/auth';

const service = new NotificationService();

export const GET = withErrorHandler(async () => {
  const session = await requireAuth();
  
  const notifications = await service.getUserNotifications(session.id);
  
  return successResponse(notifications);
});

export const PUT = withErrorHandler(async (request) => {
  const session = await requireAuth();
  
  const body = await request.json();
  if (body.action === 'MARK_ALL_READ') {
    await service.markAllAsRead(session.id);
    return successResponse(null, 'All notifications marked as read.');
  }

  return successResponse(null, 'No action performed.');
});
