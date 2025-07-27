import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username: 'cpcpress' }
    });

    if (existingUser) {
      return NextResponse.json({
        message: 'User cpcpress already exists',
        user: {
          username: existingUser.username,
          name: existingUser.name,
          role: existingUser.role
        }
      });
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('cpcpress123', saltRounds);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: 'Jayv Astorias',
        username: 'cpcpress',
        password: hashedPassword,
        role: 'Member'
      }
    });

    return NextResponse.json({
      message: 'cpcpress user created successfully!',
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt
      },
      loginCredentials: {
        username: 'cpcpress',
        password: 'cpcpress123'
      },
      instructions: 'You can now login to the admin dashboard with these credentials'
    });

  } catch (error) {
    console.error('Error creating cpcpress user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
} 