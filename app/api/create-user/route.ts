import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, username, password, role } = await request.json();
    
    // Validate input
    if (!name || !username || !password || !role) {
      return NextResponse.json(
        { error: 'Name, username, password, and role are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this username already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role
      }
    });

    return NextResponse.json({
      message: 'User created successfully!',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      },
      loginCredentials: {
        username,
        password
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    
    return NextResponse.json({
      users,
      count: users.length
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' });
  }
} 