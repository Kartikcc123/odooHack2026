import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const employees = await prisma.user.findMany({
      include: {
        department: true
      },
      orderBy: { name: 'asc' }
    });

    // Don't return passwords
    const safeEmployees = employees.map(emp => {
      const { password, ...rest } = emp;
      return rest;
    });

    return NextResponse.json(safeEmployees);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, role, departmentId } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    const updatedEmployee = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(departmentId && { departmentId })
      }
    });

    const { password, ...safeEmployee } = updatedEmployee;

    return NextResponse.json(safeEmployee);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
