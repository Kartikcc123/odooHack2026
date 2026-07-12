import { prisma } from '@/lib/prisma';

export class BookingRepository {
  async findAll({ skip, take, assetId, userId, status }) {
    const where = {};
    if (assetId) where.assetId = assetId;
    if (userId) where.userId = userId;
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take,
        include: {
          asset: { select: { id: true, name: true, tag: true } },
          user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { startTime: 'asc' }
      }),
      prisma.booking.count({ where })
    ]);
    
    return { bookings, total };
  }

  async findById(id) {
    return await prisma.booking.findUnique({
      where: { id },
      include: { asset: true, user: true }
    });
  }

  async checkOverlap(assetId, startTime, endTime) {
    // Overlap condition:
    // Existing start < New end AND Existing end > New start
    // We only care about UPCOMING or ONGOING bookings
    return await prisma.booking.findFirst({
      where: {
        assetId,
        status: { in: ['UPCOMING', 'ONGOING'] },
        startTime: { lt: new Date(endTime) },
        endTime: { gt: new Date(startTime) }
      }
    });
  }

  async create(data) {
    return await prisma.booking.create({ data });
  }

  async updateStatus(id, status) {
    return await prisma.booking.update({
      where: { id },
      data: { status }
    });
  }
}
