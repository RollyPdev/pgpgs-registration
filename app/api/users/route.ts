import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('=== USER CREATION API CALLED ===');
  try {
    const data = await request.json();
    console.log('Raw user data:', JSON.stringify(data, null, 2));
    
    // Validate input data
    if (!data.name || !data.username || !data.password || !data.role) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (data.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check for duplicate username
    const existingUser = await prisma.user.findUnique({
      where: {
        username: data.username
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    
    const user = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        password: hashedPassword,
        role: data.role
      }
    });

    return NextResponse.json({ 
      id: user.id, 
      name: user.name, 
      username: user.username, 
      role: user.role 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}