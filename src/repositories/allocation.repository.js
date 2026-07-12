import { prisma } from '@/lib/prisma';

export class AllocationRepository {
  async findAll({ skip, take, assetId, userId, departmentId, status }) {
    const where = {};
    if (assetId) where.assetId = assetId;
    if (userId) where.userId = userId;
    if (departmentId) where.departmentId = departmentId;
    if (status) where.status = status;

    const [allocations, total] = await Promise.all([
      prisma.allocation.findMany({
        where,
        skip,
        take,
        include: {
          asset: { select: { id: true, name: true, tag: true } },
          user: { select: { id: true, name: true, email: true } },
          department: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.allocation.count({ where })
    ]);
    
    return { allocations, total };
  }

  async findById(id) {
    return await prisma.allocation.findUnique({
      where: { id },
      include: {
        asset: true,
        user: true,
        department: true
      }
    });
  }

  async create(data, actionUserId) {
    return await prisma.$transaction(async (tx) => {
      // 1. Create Allocation
      const allocation = await tx.allocation.create({ data });

      // 2. Update Asset Status to ALLOCATED
      await tx.asset.update({
        where: { id: data.assetId },
        data: { status: 'ALLOCATED' }
      });

      // 3. Log History
      let assignedTo = data.userId ? 'User' : 'Department';
      await tx.assetHistory.create({
        data: {
          assetId: data.assetId,
          userId: actionUserId,
          action: 'ALLOCATED',
          details: `Asset allocated to ${assignedTo}.`
        }
      });

      return allocation;
    });
  }

  async markReturned(id, assetId, returnData, actionUserId) {
    return await prisma.$transaction(async (tx) => {
      // 1. Update Allocation
      const allocation = await tx.allocation.update({
        where: { id },
        data: {
          status: 'RETURNED',
          actualReturnDate: new Date(),
          notes: returnData.notes
        }
      });

      // 2. Update Asset Status back to AVAILABLE and update condition if provided
      const assetUpdateData = { status: 'AVAILABLE' };
      if (returnData.condition) {
        assetUpdateData.condition = returnData.condition;
      }
      
      await tx.asset.update({
        where: { id: assetId },
        data: assetUpdateData
      });

      // 3. Log History
      await tx.assetHistory.create({
        data: {
          assetId,
          userId: actionUserId,
          action: 'RETURNED',
          details: `Asset returned. Condition: ${returnData.condition || 'Unchanged'}. Notes: ${returnData.notes || 'None'}`
        }
      });

      return allocation;
    });
  }
}
