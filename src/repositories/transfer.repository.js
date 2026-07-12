import { prisma } from '@/lib/prisma';

export class TransferRepository {
  async findAll({ skip, take, assetId, fromUserId, toUserId, status }) {
    const where = {};
    if (assetId) where.assetId = assetId;
    if (fromUserId) where.fromUserId = fromUserId;
    if (toUserId) where.toUserId = toUserId;
    if (status) where.status = status;

    const [transfers, total] = await Promise.all([
      prisma.transferRequest.findMany({
        where,
        skip,
        take,
        include: {
          asset: { select: { id: true, name: true, tag: true } },
          fromUser: { select: { id: true, name: true, email: true } },
          toUser: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.transferRequest.count({ where })
    ]);
    
    return { transfers, total };
  }

  async findById(id) {
    return await prisma.transferRequest.findUnique({
      where: { id },
      include: {
        asset: true,
        fromUser: true,
        toUser: true
      }
    });
  }

  async create(data) {
    return await prisma.transferRequest.create({ data });
  }

  async respond(id, status, notes, actionUserId) {
    return await prisma.$transaction(async (tx) => {
      // 1. Update Transfer Request
      const transfer = await tx.transferRequest.update({
        where: { id },
        data: { status, notes }
      });

      if (status === 'APPROVED') {
        // Find existing allocation for the fromUser on this asset
        const currentAllocation = await tx.allocation.findFirst({
          where: { assetId: transfer.assetId, userId: transfer.fromUserId, status: 'ACTIVE' }
        });

        if (currentAllocation) {
          // Close old allocation
          await tx.allocation.update({
            where: { id: currentAllocation.id },
            data: { status: 'RETURNED', actualReturnDate: new Date(), notes: 'Closed via asset transfer.' }
          });
        }

        // Create new allocation for toUser
        await tx.allocation.create({
          data: {
            assetId: transfer.assetId,
            userId: transfer.toUserId
          }
        });

        // Log History
        await tx.assetHistory.create({
          data: {
            assetId: transfer.assetId,
            userId: actionUserId,
            action: 'TRANSFERRED',
            details: `Asset transferred to new user via approved transfer request.`
          }
        });
      }

      return transfer;
    });
  }
}
