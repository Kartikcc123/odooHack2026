import { prisma } from '@/lib/prisma';

export class DepartmentRepository {
  async findAll({ skip, take, search }) {
    const where = { isDeleted: false };
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [departments, total] = await Promise.all([
      prisma.department.findMany({
        where,
        skip,
        take,
        include: {
          parent: { select: { id: true, name: true } },
          _count: { select: { users: true, allocations: true, children: true } }
        },
        orderBy: { name: 'asc' }
      }),
      prisma.department.count({ where })
    ]);
    
    return { departments, total };
  }

  async findById(id) {
    return await prisma.department.findUnique({
      where: { id, isDeleted: false },
      include: {
        parent: { select: { id: true, name: true } },
        children: { select: { id: true, name: true } }
      }
    });
  }

  async findByName(name) {
    return await prisma.department.findFirst({
      where: { name, isDeleted: false }
    });
  }

  async create(data) {
    return await prisma.department.create({ data });
  }

  async update(id, data) {
    return await prisma.department.update({
      where: { id },
      data
    });
  }

  async softDelete(id, userId) {
    return await prisma.department.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: userId,
        status: 'INACTIVE'
      }
    });
  }
}
