import { prisma } from '@/lib/prisma';

export class NotificationService {
  async getUserNotifications(userId) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  }

  async markAsRead(id, userId) {
    const notification = await prisma.notification.findUnique({
      where: { id }
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found');
    }

    return await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId) {
    return await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
  }

  // Internal method to be called by other services to trigger notifications
  async triggerNotification(data) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        message: data.message,
        relatedEntity: data.relatedEntity,
        relatedEntityId: data.relatedEntityId,
        createdBy: data.createdBy
      }
    });
  }
}
