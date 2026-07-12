import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Departments
  const engDept = await prisma.department.upsert({
    where: { name: 'Engineering' },
    update: {},
    create: { name: 'Engineering', status: 'ACTIVE' },
  });

  const facDept = await prisma.department.upsert({
    where: { name: 'Facilities' },
    update: {},
    create: { name: 'Facilities', status: 'ACTIVE' },
  });

  // 2. Create Asset Categories
  const electronicsCategory = await prisma.assetCategory.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: { name: 'Electronics', description: 'Electronic devices and hardware' },
  });

  const furnitureCategory = await prisma.assetCategory.upsert({
    where: { name: 'Furniture' },
    update: {},
    create: { name: 'Furniture', description: 'Office furniture' },
  });

  // 3. Create Users
  const password = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@assetflow.com' },
    update: {},
    create: {
      employeeCode: 'EMP-001',
      name: 'Admin User',
      email: 'admin@assetflow.com',
      password,
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@assetflow.com' },
    update: {},
    create: {
      employeeCode: 'EMP-002',
      name: 'Asset Manager',
      email: 'manager@assetflow.com',
      password,
      role: 'ASSET_MANAGER',
    },
  });

  const head = await prisma.user.upsert({
    where: { email: 'head@assetflow.com' },
    update: {},
    create: {
      employeeCode: 'EMP-003',
      name: 'Engineering Head',
      email: 'head@assetflow.com',
      password,
      role: 'DEPARTMENT_HEAD',
      departmentId: engDept.id,
    },
  });

  const employee = await prisma.user.upsert({
    where: { email: 'employee@assetflow.com' },
    update: {},
    create: {
      employeeCode: 'EMP-004',
      name: 'Standard Employee',
      email: 'employee@assetflow.com',
      password,
      role: 'EMPLOYEE',
      departmentId: engDept.id,
    },
  });

  // 4. Create Assets
  await prisma.asset.upsert({
    where: { tag: 'AF-0001' },
    update: {},
    create: {
      tag: 'AF-0001',
      serial: 'SN-0001',
      name: 'MacBook Pro M2',
      categoryId: electronicsCategory.id,
      status: 'AVAILABLE',
      condition: 'NEW',
    },
  });

  await prisma.asset.upsert({
    where: { tag: 'AF-0002' },
    update: {},
    create: {
      tag: 'AF-0002',
      serial: 'SN-0002',
      name: 'Office Chair',
      categoryId: furnitureCategory.id,
      status: 'AVAILABLE',
      condition: 'GOOD',
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
