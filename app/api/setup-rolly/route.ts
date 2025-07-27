import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    // Check if Rolly admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        username: 'Rolly'
      }
    });

    if (existingAdmin) {
      return NextResponse.json({
        message: 'Rolly admin user already exists',
        user: {
          username: existingAdmin.username,
          name: existingAdmin.name,
          role: existingAdmin.role
        },
        loginCredentials: {
          username: 'Rolly',
          password: 'Astigko2025!'
        }
      });
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash('Astigko2025!', saltRounds);

    // Create Rolly admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Rolly',
        username: 'Rolly',
        password: hashedPassword,
        role: 'Administrator'
      }
    });

    return NextResponse.json({
      message: 'Rolly admin user created successfully!',
      user: {
        id: adminUser.id,
        username: adminUser.username,
        name: adminUser.name,
        role: adminUser.role,
        createdAt: adminUser.createdAt
      },
      loginCredentials: {
        username: 'Rolly',
        password: 'Astigko2025!'
      },
      instructions: 'You can now login to the admin dashboard with these credentials'
    });

  } catch (error) {
    console.error('Error creating Rolly admin user:', error);
    return NextResponse.json(
      { error: 'Failed to create Rolly admin user' },
      { status: 500 }
    );
  }
} 