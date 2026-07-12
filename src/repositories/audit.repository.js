import { prisma } from '@/lib/prisma';

export class AuditRepository {
  async findAllCycles({ skip, take, status }) {
    const where = {};
    if (status) where.status = status;

    const [cycles, total] = await Promise.all([
      prisma.auditCycle.findMany({
        where,
        skip,
        take,
        include: {
          _count: { select: { records: true } }
        },
        orderBy: { startDate: 'desc' }
      }),
      prisma.auditCycle.count({ where })
    ]);
    
    return { cycles, total };
  }

  async findCycleById(id) {
    return await prisma.auditCycle.findUnique({
      where: { id },
      include: {
        records: {
          include: {
            asset: { select: { id: true, name: true, tag: true, status: true } },
            auditor: { select: { id: true, name: true } }
          }
        }
      }
    });
  }

  async createCycle(data) {
    return await prisma.auditCycle.create({ data });
  }

  async updateCycleStatus(id, status) {
    return await prisma.auditCycle.update({
      where: { id },
      data: { status }
    });
  }

  async addRecord(data) {
    return await prisma.$transaction(async (tx) => {
      // Create Audit Record
      const record = await tx.auditRecord.create({ data });

      // Only update Asset if it's missing or damaged
      let historyDetails = `Asset audited during cycle. Status verified as ${data.status}.`;
      let newAssetStatus = null;

      if (data.status === 'MISSING') {
        newAssetStatus = 'LOST';
      } else if (data.status === 'DAMAGED') {
        // We could put it in maintenance or leave it, for now we let it be handled manually or set condition
        // Let's set status to MAINTENANCE if damaged so it's not used
        newAssetStatus = 'MAINTENANCE';
        historyDetails += ' Asset automatically marked for MAINTENANCE due to damage reported in audit.';
      }

      if (newAssetStatus) {
        await tx.asset.update({
          where: { id: data.assetId },
          data: { status: newAssetStatus }
        });
      }

      // Log History
      await tx.assetHistory.create({
        data: {
          assetId: data.assetId,
          userId: data.auditorId,
          action: 'AUDITED',
          details: historyDetails
        }
      });

      return record;
    });
  }
}
