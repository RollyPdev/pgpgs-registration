import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../../lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Find user by username
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (!user) {
      // Log failed login attempt
      try {
        await prisma.loginLog.create({
          data: {
            userId: 0,
            username: username,
            name: 'Unknown User',
            role: 'Unknown',
            ipAddress: ip,
            userAgent: userAgent,
            success: false
          }
        });
      } catch (logError) {
        console.error('Failed to log failed login:', logError);
      }
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      // Log failed login attempt
      try {
        await prisma.loginLog.create({
          data: {
            userId: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            ipAddress: ip,
            userAgent: userAgent,
            success: false
          }
        });
      } catch (logError) {
        console.error('Failed to log failed login:', logError);
      }
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Log successful login
    try {
      await prisma.loginLog.create({
        data: {
          userId: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
          ipAddress: ip,
          userAgent: userAgent,
          success: true
        }
      });
    } catch (logError) {
      console.error('Failed to log successful login:', logError);
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