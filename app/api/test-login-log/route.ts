import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const testLog = await prisma.loginLog.create({
      data: {
        userId: 1,
        username: 'testuser',
        name: 'Test User',
        role: 'Administrator',
        ipAddress: '127.0.0.1',
        userAgent: 'Test Browser',
        success: true
      }
    });

    return NextResponse.json({ message: 'Test log created', log: testLog });
  } catch (error) {
    console.error('Error creating test log:', error);
    return NextResponse.json(
      { error: 'Failed to create test log' },
      { status: 500 }
    );
  }
}