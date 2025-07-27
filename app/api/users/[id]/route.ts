import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Validate input data
    if (!data.name || !data.username || !data.role) {
      return NextResponse.json(
        { error: 'Name, username, and role are required' },
        { status: 400 }
      );
    }

    // Check if username already exists (excluding current user)
    const existingUser = await prisma.user.findFirst({
      where: {
        username: data.username,
        id: { not: parseInt(id) }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Prepare update data
    const updateData: {
      name: string;
      username: string;
      role: string;
      password?: string;
    } = {
      name: data.name,
      username: data.username,
      role: data.role
    };

    // Hash password if provided
    if (data.password && data.password.length > 0) {
      if (data.password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters long' },
          { status: 400 }
        );
      }
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(data.password, saltRounds);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json({ 
      id: user.id, 
      name: user.name, 
      username: user.username, 
      role: user.role 
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check if this is the last administrator
    const userToDelete = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (userToDelete?.role === 'Administrator') {
      const adminCount = await prisma.user.count({
        where: { role: 'Administrator' }
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete the last administrator' },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 