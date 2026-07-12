import { prisma } from '@/lib/prisma';

export class AssetRepository {
  async findAll({ skip, take, search, categoryId, status, location, isBookable }) {
    const where = { isDeleted: false };
    if (search) {
      where.OR = [
        { tag: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { serial: { contains: search, mode: 'insensitive' } },
        { qrCode: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (location) where.location = location;
    if (isBookable !== undefined) where.isBookable = isBookable;

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        skip,
        take,
        include: {
          category: { select: { id: true, name: true } },
          _count: { select: { allocations: true, bookings: true, maintenanceReqs: true } }
        },
        orderBy: { tag: 'asc' }
      }),
      prisma.asset.count({ where })
    ]);
    
    return { assets, total };
  }

  async findById(id) {
    return await prisma.asset.findUnique({
      where: { id, isDeleted: false },
      include: {
        category: { select: { id: true, name: true } },
        history: { 
          orderBy: { timestamp: 'desc' },
          take: 10,
          include: { user: { select: { id: true, name: true } } }
        }
      }
    });
  }

  async findByTag(tag) {
    return await prisma.asset.findFirst({
      where: { tag, isDeleted: false }
    });
  }

  async findBySerialOrQrCode(serial, qrCode) {
    const OR = [];
    if (serial) OR.push({ serial });
    if (qrCode) OR.push({ qrCode });
    if (OR.length === 0) return null;

    return await prisma.asset.findFirst({
      where: {
        isDeleted: false,
        OR
      }
    });
  }

  async create(data, userId) {
    // We use a transaction to create the asset and the initial history log
    return await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({ data });
      
      await tx.assetHistory.create({
        data: {
          assetId: asset.id,
          userId,
          action: 'CREATED',
          details: 'Asset added to the system.'
        }
      });
      
      return asset;
    });
  }

  async update(id, data, userId, historyDetails) {
    return await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.update({
        where: { id },
        data
      });
      
      if (historyDetails) {
        await tx.assetHistory.create({
          data: {
            assetId: id,
            userId,
            action: 'UPDATED',
            details: historyDetails
          }
        });
      }
      
      return asset;
    });
  }

  async softDelete(id, userId) {
    return await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId,
          status: 'RETIRED'
        }
      });

      await tx.assetHistory.create({
        data: {
          assetId: id,
          userId,
          action: 'DELETED',
          details: 'Asset retired and removed from active system.'
        }
      });

      return asset;
    });
  }
}
