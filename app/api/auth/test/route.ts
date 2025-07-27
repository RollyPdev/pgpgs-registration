import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    console.log('Testing authentication for:', username);
    
    // Find user by username
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (!user) {
      console.log('User not found:', username);
      return NextResponse.json(
        { error: 'User not found', found: false },
        { status: 404 }
      );
    }

    console.log('User found:', user.username, 'Role:', user.role);

    // Check password
    if (user.password !== password) {
      console.log('Password mismatch for user:', username);
      return NextResponse.json(
        { error: 'Invalid password', found: true, passwordMatch: false },
        { status: 401 }
      );
    }

    console.log('Authentication successful for:', username);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error during authentication test:', error);
    return NextResponse.json(
      { error: 'Authentication test failed' },
      { status: 500 }
    );
  }
} 