import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const logs = await prisma.loginLog.findMany({
      orderBy: { loginAt: 'desc' },
      take: 100
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching login logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch login logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, username, name, role, ipAddress, userAgent, success } = await request.json();

    const log = await prisma.loginLog.create({
      data: {
        userId,
        username,
        name,
        role,
        ipAddress,
        userAgent,
        success
      }
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error('Error creating login log:', error);
    return NextResponse.json(
      { error: 'Failed to create login log' },
      { status: 500 }
    );
  }
}