import { prisma } from '@/lib/prisma';

export class UserRepository {
  async findAll({ skip, take, search, departmentId, role }) {
    const where = { isDeleted: false };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeCode: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (departmentId) where.departmentId = departmentId;
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true, employeeCode: true, name: true, email: true, phone: true,
          role: true, status: true, departmentId: true,
          department: { select: { id: true, name: true } },
          createdAt: true
        },
        orderBy: { name: 'asc' }
      }),
      prisma.user.count({ where })
    ]);
    
    return { users, total };
  }

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id, isDeleted: false },
      select: {
        id: true, employeeCode: true, name: true, email: true, phone: true,
        role: true, status: true, departmentId: true,
        department: { select: { id: true, name: true } }
      }
    });
  }

  async findByEmail(email) {
    return await prisma.user.findFirst({
      where: { email, isDeleted: false }
    });
  }

  async findByEmployeeCode(employeeCode) {
    return await prisma.user.findFirst({
      where: { employeeCode, isDeleted: false }
    });
  }

  async create(data) {
    // Return without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = await prisma.user.create({ data });
    return userWithoutPassword;
  }

  async update(id, data) {
    const user = await prisma.user.update({
      where: { id },
      data
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async softDelete(id, deletedBy) {
    return await prisma.user.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy,
        status: 'INACTIVE'
      }
    });
  }
}
