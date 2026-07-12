import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const departments = await prisma.department.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // In a real app, verify the user is an Admin before creating a dept

    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }

    const department = await prisma.department.create({
      data: { name }
    });

    return NextResponse.json(department, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
