import { prisma } from '@/lib/prisma';

export class MaintenanceRepository {
  async findAll({ skip, take, assetId, reporterId, technicianId, status }) {
    const where = {};
    if (assetId) where.assetId = assetId;
    if (reporterId) where.reporterId = reporterId;
    if (technicianId) where.technicianId = technicianId;
    if (status) where.status = status;

    const [requests, total] = await Promise.all([
      prisma.maintenanceRequest.findMany({
        where,
        skip,
        take,
        include: {
          asset: { select: { id: true, name: true, tag: true } },
          reporter: { select: { id: true, name: true, email: true } },
          technician: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.maintenanceRequest.count({ where })
    ]);
    
    return { requests, total };
  }

  async findById(id) {
    return await prisma.maintenanceRequest.findUnique({
      where: { id },
      include: { asset: true, reporter: true, technician: true }
    });
  }

  async create(data, reporterId) {
    return await prisma.$transaction(async (tx) => {
      // Create request
      const maintenance = await tx.maintenanceRequest.create({
        data: {
          ...data,
          reporterId
        }
      });

      // Update Asset Status to MAINTENANCE
      await tx.asset.update({
        where: { id: data.assetId },
        data: { status: 'MAINTENANCE' }
      });

      // Log History
      await tx.assetHistory.create({
        data: {
          assetId: data.assetId,
          userId: reporterId,
          action: 'MAINTENANCE_REQUESTED',
          details: `Asset marked for maintenance. Issue: ${data.issue}`
        }
      });

      return maintenance;
    });
  }

  async updateStatus(id, assetId, data, actionUserId) {
    return await prisma.$transaction(async (tx) => {
      // 1. Update request
      const maintenance = await tx.maintenanceRequest.update({
        where: { id },
        data
      });

      // 2. Determine Asset Status changes based on maintenance status
      let newAssetStatus = null;
      let historyDetails = `Maintenance status updated to ${data.status}.`;
      
      if (data.status === 'RESOLVED' || data.status === 'REJECTED') {
        newAssetStatus = 'AVAILABLE';
      }

      if (newAssetStatus) {
        await tx.asset.update({
          where: { id: assetId },
          data: { status: newAssetStatus }
        });
        historyDetails += ` Asset status reverted to ${newAssetStatus}.`;
      }

      // 3. Log History
      await tx.assetHistory.create({
        data: {
          assetId,
          userId: actionUserId,
          action: `MAINTENANCE_${data.status}`,
          details: historyDetails
        }
      });

      return maintenance;
    });
  }
}
