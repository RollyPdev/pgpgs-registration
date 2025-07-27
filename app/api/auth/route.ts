import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database configuration missing' },
        { status: 500 }
      );
    }

    const { username, password } = await request.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Find user by username
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    });

    // Return user info and token
    return NextResponse.json({
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      token: token
    });

  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 