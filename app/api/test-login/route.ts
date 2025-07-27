import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    console.log('Testing login for:', username);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { username }
    });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        availableUsers: await prisma.user.findMany({
          select: { id: true, username: true, name: true, role: true }
        })
      });
    }
    
    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    
    return NextResponse.json({
      success: isValid,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        hasPassword: !!user.password,
        passwordLength: user.password.length
      },
      passwordValid: isValid
    });
    
  } catch (error) {
    console.error('Test login error:', error);
    return NextResponse.json({ success: false, error: 'Test failed' });
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