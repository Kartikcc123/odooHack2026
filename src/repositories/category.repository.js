import { prisma } from '@/lib/prisma';

export class CategoryRepository {
  async findAll({ skip, take, search }) {
    const where = { isDeleted: false };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [categories, total] = await Promise.all([
      prisma.assetCategory.findMany({
        where,
        skip,
        take,
        include: {
          _count: { select: { assets: true } }
        },
        orderBy: { name: 'asc' }
      }),
      prisma.assetCategory.count({ where })
    ]);
    
    return { categories, total };
  }

  async findById(id) {
    return await prisma.assetCategory.findUnique({
      where: { id, isDeleted: false },
      include: {
        _count: { select: { assets: true } }
      }
    });
  }

  async findByName(name) {
    return await prisma.assetCategory.findFirst({
      where: { name, isDeleted: false }
    });
  }

  async create(data) {
    return await prisma.assetCategory.create({ data });
  }

  async update(id, data) {
    return await prisma.assetCategory.update({
      where: { id },
      data
    });
  }

  async softDelete(id, deletedBy) {
    return await prisma.assetCategory.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy
      }
    });
  }
}
