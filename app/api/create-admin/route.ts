import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password, name, role } = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (existingUser) {
      return NextResponse.json({
        message: 'User already exists',
        user: {
          username: existingUser.username,
          name: existingUser.name,
          role: existingUser.role
        }
      });
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: name,
        username: username,
        password: hashedPassword,
        role: role
      }
    });

    return NextResponse.json({
      message: 'Admin user created successfully',
      user: {
        id: adminUser.id,
        username: adminUser.username,
        name: adminUser.name,
        role: adminUser.role,
        createdAt: adminUser.createdAt
      },
      loginCredentials: {
        username: username,
        password: password // Return the plain password for reference
      }
    });

  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create admin user' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      message: 'Current users in database',
      users: users,
      count: users.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
} 