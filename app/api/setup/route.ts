import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        username: 'admin'
      }
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Admin user already exists',
        user: {
          username: existingAdmin.username,
          role: existingAdmin.role
        }
      });
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Create default admin user with hashed password
    const adminUser = await prisma.user.create({
      data: {
        name: 'Administrator',
        username: 'admin',
        password: hashedPassword,
        role: 'Administrator'
      }
    });

    return NextResponse.json({
      message: 'Default admin user created successfully',
      user: {
        username: adminUser.username,
        role: adminUser.role
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