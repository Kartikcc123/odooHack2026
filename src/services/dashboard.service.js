import { prisma } from '@/lib/prisma';

export class DashboardService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getDashboardData(userRole, userId, _departmentId) {
    const isGlobal = ['ADMIN', 'ASSET_MANAGER'].includes(userRole);
    
    // For standard users, we might restrict dashboard data to their department or self.
    // Assuming an enterprise dashboard, the main KPI metrics are for managers.
    // If it's a regular user, return their specific stats.
    
    if (!isGlobal) {
      return await this.getUserDashboardData(userId);
    }
    
    return await this.getAdminDashboardData();
  }

  async getAdminDashboardData() {
    const [
      totalAssets,
      assetsByStatus,
      activeMaintenance,
      recentActivity,
      pendingTransfers
    ] = await Promise.all([
      // Total Assets count
      prisma.asset.count({ where: { isDeleted: false } }),
      
      // Assets grouped by status
      prisma.asset.groupBy({
        by: ['status'],
        _count: { status: true },
        where: { isDeleted: false }
      }),

      // Active Maintenance Requests
      prisma.maintenanceRequest.count({
        where: { status: { in: ['PENDING', 'APPROVED', 'IN_PROGRESS'] } }
      }),

      // Recent Activity Logs (Asset History)
      prisma.assetHistory.findMany({
        take: 10,
        orderBy: { timestamp: 'desc' },
        include: {
          asset: { select: { name: true, tag: true } },
          user: { select: { name: true } }
        }
      }),

      // Pending Transfers
      prisma.transferRequest.count({
        where: { status: 'PENDING' }
      })
    ]);

    return {
      overview: {
        totalAssets,
        activeMaintenance,
        pendingTransfers,
        assetsByStatus: assetsByStatus.map(item => ({
          status: item.status,
          count: item._count.status
        }))
      },
      recentActivity
    };
  }

  async getUserDashboardData(userId) {
    const [
      myAllocations,
      myBookings,
      myMaintenance
    ] = await Promise.all([
      prisma.allocation.count({
        where: { userId, status: 'ACTIVE' }
      }),
      prisma.booking.count({
        where: { userId, status: { in: ['UPCOMING', 'ONGOING'] } }
      }),
      prisma.maintenanceRequest.count({
        where: { reporterId: userId, status: { notIn: ['RESOLVED', 'REJECTED'] } }
      })
    ]);

    return {
      overview: {
        activeAllocations: myAllocations,
        upcomingBookings: myBookings,
        openMaintenanceRequests: myMaintenance
      }
    };
  }
}
