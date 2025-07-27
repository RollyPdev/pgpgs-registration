import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true
      }
    });
    
    const registrations = await prisma.registration.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        emailAddress: true,
        contactNumber: true,
        chapter: true,
        membership: true,
        paymentAmount: true,
        status: true,
        createdAt: true
      }
    });
    
    return NextResponse.json({
      summary: {
        userCount: users.length,
        registrationCount: registrations.length,
        timestamp: new Date().toISOString()
      },
      users,
      registrations
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
